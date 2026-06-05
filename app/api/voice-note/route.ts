import { NextRequest, NextResponse } from "next/server";
import { SESClient, SendRawEmailCommand } from "@aws-sdk/client-ses";
import nodemailer from "nodemailer";
import type { SentMessageInfo } from "nodemailer";
import { getRateLimiter, getClientIp } from "@/lib/ratelimit";

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
 */

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const TO_EMAIL   = process.env.SES_TO_EMAIL   || "info@avhishkar.app";
const FROM_EMAIL = process.env.SES_FROM_EMAIL || "info@avhishkar.app";
const MAX_BYTES  = 10 * 1024 * 1024; // 10 MB

const sanitize = (s: string) =>
  s.replace(/[\r\n\t]/g, " ").replace(/[^\x20-\x7E]/g, "").trim();

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

  const rawBuffer: Buffer = await new Promise((resolve, reject) => {
    const chunks: Buffer[] = [];
    (info.message as NodeJS.ReadableStream)
      .on("data",  (c: Buffer) => chunks.push(c))
      .on("end",   ()          => resolve(Buffer.concat(chunks)))
      .on("error", reject);
  });

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
    // Upstash rate limit: 3 requests per hour per IP
    const limiter = getRateLimiter("voice-note", 3, "3600 s");
    if (limiter) {
      const ip = getClientIp(req);
      const result = await limiter.limit(ip);
      if (!result.success) {
        return NextResponse.json(
          { ok: false, error: "Voice note limit reached. Try again in an hour." },
          { status: 429 }
        );
      }
    }

    const form = await req.formData();
    const audio = form.get("audio");

    // Sanitize and cap input fields
    const rawName  = (form.get("name")  as string | null) ?? "";
    const rawEmail = (form.get("email") as string | null) ?? "";
    const senderName  = sanitize(rawName).slice(0, 200);
    const senderEmail = sanitize(rawEmail).slice(0, 200);

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
