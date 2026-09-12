import { SESClient, SendEmailCommand } from "@aws-sdk/client-ses";
import { isValidEmail, normalizeEmail } from "@/lib/early-access";

/**
 * Waitlist intake. Validation lives here so the homepage form stays dumb.
 *
 * Notifies the team by email via SES (SES_* env vars) whenever someone
 * signs up. If SES isn't configured, the route still returns 200 after a
 * valid email so the UI can be reviewed without a provider.
 */
export async function POST(request: Request) {
  let email = "";

  try {
    const body = (await request.json()) as { email?: unknown };
    email = typeof body.email === "string" ? normalizeEmail(body.email) : "";
  } catch {
    return Response.json({ ok: false }, { status: 400 });
  }

  if (!isValidEmail(email)) {
    return Response.json({ ok: false }, { status: 400 });
  }

  try {
    await recordEarlyAccess(email);
  } catch {
    return Response.json({ ok: false }, { status: 502 });
  }

  return Response.json({ ok: true });
}

async function recordEarlyAccess(email: string) {
  const { SES_AWS_ACCESS_KEY_ID, SES_AWS_SECRET_ACCESS_KEY, SES_AWS_REGION, SES_FROM_EMAIL, SES_TO_EMAIL } =
    process.env;

  if (!SES_AWS_ACCESS_KEY_ID || !SES_AWS_SECRET_ACCESS_KEY || !SES_AWS_REGION || !SES_FROM_EMAIL || !SES_TO_EMAIL) {
    if (process.env.NODE_ENV !== "production") {
      console.info("[early-access] SES not configured; accepted", email);
    }
    return;
  }

  const client = new SESClient({
    region: SES_AWS_REGION,
    credentials: {
      accessKeyId: SES_AWS_ACCESS_KEY_ID,
      secretAccessKey: SES_AWS_SECRET_ACCESS_KEY,
    },
  });

  await client.send(
    new SendEmailCommand({
      Source: SES_FROM_EMAIL,
      Destination: { ToAddresses: [SES_TO_EMAIL] },
      ReplyToAddresses: [email],
      Message: {
        Subject: { Data: `Early access request: ${email}` },
        Body: {
          Text: {
            Data: `${email} wants early access to the specialized AI model.\n\nSubmitted at ${new Date().toISOString()}.`,
          },
        },
      },
    })
  );
}