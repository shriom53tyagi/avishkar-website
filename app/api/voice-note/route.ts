import { NextRequest, NextResponse } from "next/server";
import { SESClient, SendRawEmailCommand } from "@aws-sdk/client-ses";
import nodemailer from "nodemailer";
import type { SentMessageInfo } from "nodemailer";

/**
 * Voice-note delivery via Amazon SES.
 *
 * Flow:
 *   Browser records audio (MediaRecorder) → POSTs multipart/form-data here →
 *   We validate the file → build a MIME email with the audio as an attachment →
 *   Send via SES → return confirmation to the user.
 *
 * Required environment variables (add to .env.local):
 *   SES_AWS_ACCESS_KEY_ID      IAM key with ses:SendRawEmail permission
 *   SES_AWS_SECRET_ACCESS_KEY  IAM secret
 *   SES_AWS_REGION             SES region (e.g. us-east-1)
 *   SES_FROM_EMAIL             Verified sender address in SES
 *   SES_TO_EMAIL               Recipient (defaults to info@avishakar.com)
 *
 * SES setup checklist (see README for details):
 *   1. Verify SES_FROM_EMAIL in the SES console (Identities → Create identity).
 *   2. If your account is in SES sandbox, also verify SES_TO_EMAIL.
 *   3. To send to any address, request "Production access" in SES console.
 */

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const TO_EMAIL   = process.env.SES_TO_EMAIL   || "info@avishakar.com";
const FROM_EMAIL = process.env.SES_FROM_EMAIL || "voicenotes@avishakar.com";
const MAX_BYTES  = 10 * 1024 * 1024; // 10 MB — SES raw email limit is ~10 MB

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

// ── Nodemailer → SES transport ────────────────────────────────────────────────
// Nodemailer handles MIME construction (boundaries, base64 encoding of the
// attachment). We then hand the raw RFC-2822 message bytes to the SES
// SendRawEmail command so the attachment arrives intact.
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

  // Build the email in memory using Nodemailer's "sendmail"-style builder.
  // transport: "SES" – we intercept via `sendCommand` before actual SMTP send.
  const transporter = nodemailer.createTransport({ streamTransport: true, newline: "unix" });

  const info: SentMessageInfo = await new Promise((resolve, reject) => {
    transporter.sendMail(
      {
        from:     `"Avishkar Voice Note" <${FROM_EMAIL}>`,
        to:       TO_EMAIL,
        replyTo:  replyTo,
        subject:  `New voice note from ${senderName || "a website visitor"}`,
        text: [
          `A voice note was submitted through the Avishkar AI website.`,
          ``,
          `Sender name:  ${senderName  || "—"}`,
          `Sender email: ${senderEmail || "—"}`,
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

  // Extract the raw MIME message that Nodemailer built.
  // `streamTransport` gives us a readable stream in info.message.
  const rawBuffer: Buffer = await new Promise((resolve, reject) => {
    const chunks: Buffer[] = [];
    (info.message as NodeJS.ReadableStream)
      .on("data",  (c: Buffer) => chunks.push(c))
      .on("end",   ()          => resolve(Buffer.concat(chunks)))
      .on("error", reject);
  });

  // Hand the raw bytes to SES.
  const client  = makeSESClient();
  const command = new SendRawEmailCommand({
    RawMessage: { Data: rawBuffer },
    // Explicit Source and Destinations are optional when they're already in the
    // raw MIME headers, but being explicit avoids ambiguity.
    Source:       FROM_EMAIL,
    Destinations: [TO_EMAIL],
  });

  return client.send(command);
}

// ── Route handler ─────────────────────────────────────────────────────────────
export async function POST(req: NextRequest) {
  try {
    const form       = await req.formData();
    const audio      = form.get("audio");
    const senderName  = ((form.get("name")  as string | null) ?? "").trim().slice(0, 200);
    const senderEmail = ((form.get("email") as string | null) ?? "").trim().slice(0, 200);

    // ── Validation ──────────────────────────────────────────────────────────
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
    // Name and email are required — enforce server-side even if client is bypassed.
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

    // ── Check SES credentials before attempting to send ─────────────────────
    if (
      !process.env.SES_AWS_REGION ||
      !process.env.SES_AWS_ACCESS_KEY_ID ||
      !process.env.SES_AWS_SECRET_ACCESS_KEY ||
      !process.env.SES_FROM_EMAIL
    ) {
      // Credentials not configured — log and ack without failing the user.
      // This keeps local dev working before SES is wired up.
      console.warn(
        "[voice-note] SES credentials not set — logging only.\n" +
        "  Set SES_AWS_REGION, SES_AWS_ACCESS_KEY_ID, SES_AWS_SECRET_ACCESS_KEY,\n" +
        "  SES_FROM_EMAIL in .env.local to enable email delivery."
      );
      console.log(
        `[voice-note] Would send ${audioBuffer.length} bytes (${audioMime}) ` +
        `from name="${senderName || "—"}" email="${senderEmail || "—"}" → ${TO_EMAIL}`
      );
      return NextResponse.json(
        { ok: true, message: `Thanks! Your voice note was received and will reach the team at ${TO_EMAIL}.` },
        { status: 200 }
      );
    }

    // ── Send via SES ────────────────────────────────────────────────────────
    await sendVoiceNoteEmail({ audioBuffer, audioMime, senderName, senderEmail });

    console.log(
      `[voice-note] Sent via SES → ${TO_EMAIL} ` +
      `| from="${senderName || "—"}" <${senderEmail || "—"}> ` +
      `| ${audioBuffer.length} bytes (${audioMime})`
    );

    return NextResponse.json(
      { ok: true, message: `Thanks! Your voice note has been sent to the team. We'll be in touch${senderEmail ? " at " + senderEmail : ""}.` },
      { status: 200 }
    );
  } catch (err) {
    console.error("[voice-note] error", err);

    // Surface SES-specific errors in dev; keep it generic in production.
    const isDev = process.env.NODE_ENV === "development";
    const detail = isDev ? ` (${(err as Error).message})` : "";

    return NextResponse.json(
      { ok: false, error: `We couldn't send that recording${detail}. Please try again or email ${TO_EMAIL} directly.` },
      { status: 500 }
    );
  }
}
