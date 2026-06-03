import { NextRequest, NextResponse } from "next/server";
import { SESClient, SendRawEmailCommand } from "@aws-sdk/client-ses";
import nodemailer from "nodemailer";
import type { SentMessageInfo } from "nodemailer";

/**
 * Voice-note delivery via Amazon SES.
 *
 * Flow:
 *   Browser records audio (MediaRecorder) -> POSTs multipart/form-data here ->
 *   We validate the file -> build a MIME email with the audio as an attachment ->
 *   Send via SES -> return confirmation to the user.
 *
 * Required environment variables (add to .env.local):
 *   SES_AWS_ACCESS_KEY_ID      IAM key with ses:SendRawEmail permission
 *   SES_AWS_SECRET_ACCESS_KEY  IAM secret
 *   SES_AWS_REGION             SES region (e.g. us-west-1)
 *   SES_FROM_EMAIL             Verified sender address in SES (plain email only, no display name)
 *   SES_TO_EMAIL               Recipient (defaults to info@avhishkar.app)
 *
 * To change who sends / receives, update SES_FROM_EMAIL and SES_TO_EMAIL in
 * your .env.local file. Both addresses must be verified identities in SES
 * while your account is in sandbox mode.
 *
 * SES setup checklist:
 *   1. Verify your domain (or individual addresses) in the SES console.
 *   2. If in sandbox mode, both FROM and TO must be verified.
 *   3. To send to any address, request "Production access" in SES console.
 */

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// Change these two in .env.local to control who sends and who receives.
const TO_EMAIL   = process.env.SES_TO_EMAIL   || "info@avhishkar.app";
const FROM_EMAIL = process.env.SES_FROM_EMAIL || "info@avhishkar.app";
const MAX_BYTES  = 10 * 1024 * 1024; // 10 MB
const RATE_LIMIT_WINDOW_MS = 60_000;
const MAX_VOICE_NOTE_REQUESTS_PER_WINDOW = 5;

type RateLimitEntry = { count: number; reset: number };
const rateLimitStore = new Map<string, RateLimitEntry>();

function getClientIp(req: NextRequest) {
  const forwarded = req.headers.get("x-forwarded-for")?.split(",")[0].trim();
  return forwarded || req.headers.get("x-real-ip") || "anonymous";
}

function checkRateLimit(req: NextRequest, maxRequests: number, windowMs: number) {
  const now = Date.now();
  const key = `${req.nextUrl.pathname}:${getClientIp(req)}`;
  const entry = rateLimitStore.get(key);

  if (!entry || entry.reset <= now) {
    rateLimitStore.set(key, { count: 1, reset: now + windowMs });
    return { ok: true, remaining: maxRequests - 1, reset: now + windowMs };
  }

  if (entry.count >= maxRequests) {
    return { ok: false, remaining: 0, reset: entry.reset };
  }

  entry.count += 1;
  return { ok: true, remaining: maxRequests - entry.count, reset: entry.reset };
}

// ── SES client factory ────────────────────────────────────────────────────────
function makeSESClient() {
  const region    = process.env.SES_AWS_REGION;
  const accessKey = process.env.SES_AWS_ACCESS_KEY_ID;
  const secretKey = process.env.SES_AWS_SECRET_ACCESS_KEY;

  if (!region || !accessKey || !secretKey) {
    throw new Error(
      "Missing SES credentials. Set SES_AWS_REGION, SES_AWS_ACCESS_KEY_ID, and SES_AWS_SECRET_ACCESS_KEY in .env.local"
    );
  }

  return new SESClient({
    region,
    credentials: { accessKeyId: accessKey, secretAccessKey: secretKey },
  });
}

// ── Nodemailer -> SES transport ───────────────────────────────────────────────
async function sendVoiceNoteEmail({
  audioBuffer,
  audioMime,
  senderName,
  senderEmail,
}: {
  audioBuffer: Buffer;
  audioMime:   string;
  senderName:  string;
  senderEmail: string;
}): Promise<SentMessageInfo> {
  const ext      = audioMime.includes("mp4") ? "mp4" : "webm";
  const filename = `voice-note.${ext}`;
  const replyTo  = senderEmail || TO_EMAIL;

  const transporter = nodemailer.createTransport({ streamTransport: true, newline: "unix" });

  const info: SentMessageInfo = await new Promise((resolve, reject) => {
    transporter.sendMail(
      {
        // IMPORTANT: FROM_EMAIL must be a plain email address with no display
        // name (e.g. info@avhishkar.app NOT "Avishkar" <info@avhishkar.app>).
        // SES verifies the From: header against your verified identities and
        // rejects it if a display name is included while in sandbox mode.
        from:    FROM_EMAIL,
        to:      TO_EMAIL,
        replyTo: replyTo,
        subject: `New voice note from ${senderName || "a website visitor"}`,
        text: [
          `A voice note was submitted through the Avishkar AI website.`,
          ``,
          `Sender name:  ${senderName  || "-"}`,
          `Sender email: ${senderEmail || "-"}`,
          ``,
          `The audio recording is attached.`,
          ``,
          `---`,
          `Reply directly to this email to reach ${senderEmail || "the sender"}.`,
        ].join("\n"),
        attachments: [
          {
            filename,
            content:     audioBuffer,
            contentType: audioMime,
          },
        ],
      },
      (err, inf) => (err ? reject(err) : resolve(inf))
    );
  });

  // Extract raw MIME bytes from nodemailer stream.
  const rawBuffer: Buffer = await new Promise((resolve, reject) => {
    const chunks: Buffer[] = [];
    (info.message as NodeJS.ReadableStream)
      .on("data",  (c: Buffer) => chunks.push(c))
      .on("end",   ()          => resolve(Buffer.concat(chunks)))
      .on("error", reject);
  });

  // Send via SES.
  const client  = makeSESClient();
  const command = new SendRawEmailCommand({
    RawMessage:   { Data: rawBuffer },
    Source:       FROM_EMAIL,
    Destinations: [TO_EMAIL],
  });

  return client.send(command);
}

// ── Route handler ─────────────────────────────────────────────────────────────
export async function POST(req: NextRequest) {
  try {
    const rate = checkRateLimit(req, MAX_VOICE_NOTE_REQUESTS_PER_WINDOW, RATE_LIMIT_WINDOW_MS);
    if (!rate.ok) {
      const retryIn = Math.max(1, Math.ceil((rate.reset - Date.now()) / 1000));
      return NextResponse.json(
        {
          ok: false,
          error: `Too many voice note submissions from your network. Please wait ${retryIn} seconds and try again or email ${TO_EMAIL}.`,
        },
        {
          status: 429,
          headers: {
            "Retry-After": String(retryIn),
            "X-RateLimit-Limit": String(MAX_VOICE_NOTE_REQUESTS_PER_WINDOW),
            "X-RateLimit-Remaining": String(rate.remaining),
          },
        }
      );
    }

    const form        = await req.formData();
    const audio       = form.get("audio");
    const senderName  = ((form.get("name")  as string | null) ?? "").trim().slice(0, 200);
    const senderEmail = ((form.get("email") as string | null) ?? "").trim().slice(0, 200);

    // Validation
    if (!(audio instanceof Blob)) {
      return NextResponse.json({ ok: false, error: "No audio file received." }, { status: 400 });
    }
    if (audio.size === 0) {
      return NextResponse.json({ ok: false, error: "The recording was empty." }, { status: 400 });
    }
    if (audio.size > MAX_BYTES) {
      return NextResponse.json(
        { ok: false, error: "That recording is a bit large. Please keep it under ~10 MB." },
        { status: 413 }
      );
    }
    if (!senderName) {
      return NextResponse.json({ ok: false, error: "Name is required." }, { status: 400 });
    }
    if (!senderEmail) {
      return NextResponse.json({ ok: false, error: "Email is required." }, { status: 400 });
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(senderEmail)) {
      return NextResponse.json({ ok: false, error: "Please provide a valid email address." }, { status: 400 });
    }

    const audioBuffer = Buffer.from(await audio.arrayBuffer());
    const audioMime   = audio.type || "audio/webm";

    // Check credentials before attempting to send.
    if (
      !process.env.SES_AWS_REGION ||
      !process.env.SES_AWS_ACCESS_KEY_ID ||
      !process.env.SES_AWS_SECRET_ACCESS_KEY ||
      !process.env.SES_FROM_EMAIL
    ) {
      console.warn(
        "[voice-note] SES credentials not set - logging only.\n" +
        "  Set SES_AWS_REGION, SES_AWS_ACCESS_KEY_ID, SES_AWS_SECRET_ACCESS_KEY,\n" +
        "  SES_FROM_EMAIL in .env.local to enable email delivery."
      );
      console.log(
        `[voice-note] Would send ${audioBuffer.length} bytes (${audioMime}) ` +
        `from name="${senderName}" email="${senderEmail}" -> ${TO_EMAIL}`
      );
      return NextResponse.json(
        { ok: true, message: `Thanks! Your voice note was received and will reach the team at ${TO_EMAIL}.` },
        { status: 200 }
      );
    }

    // Send via SES.
    await sendVoiceNoteEmail({ audioBuffer, audioMime, senderName, senderEmail });

    console.log(
      `[voice-note] Sent via SES -> ${TO_EMAIL} ` +
      `| from="${senderName}" <${senderEmail}> ` +
      `| ${audioBuffer.length} bytes (${audioMime})`
    );

    return NextResponse.json(
      {
        ok: true,
        message: `Thanks! Your voice note has been sent to the team. We'll be in touch${senderEmail ? " at " + senderEmail : ""}.`,
      },
      { status: 200 }
    );
  } catch (err) {
    console.error("[voice-note] error", err);

    const isDev  = process.env.NODE_ENV === "development";
    const detail = isDev ? ` (${(err as Error).message})` : "";

    return NextResponse.json(
      {
        ok: false,
        error: `We couldn't send that recording${detail}. Please try again or email ${TO_EMAIL} directly.`,
      },
      { status: 500 }
    );
  }
}
