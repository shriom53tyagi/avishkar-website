import { SESClient, SendEmailCommand } from "@aws-sdk/client-ses";
import { isValidEmail, normalizeEmail } from "@/lib/early-access";

/**
 * The Avishkar Letter signups (footer form + /letter). Same delivery as
 * /api/early-access: the team is emailed via SES (SES_* env vars). If SES
 * isn't configured the route still returns 200 for a valid email so the UI
 * can be reviewed without a provider.
 */
export async function POST(request: Request) {
  let email = "";
  let firstName = "";
  let source = "";
  let details = "";

  try {
    const body = (await request.json()) as {
      email?: unknown;
      firstName?: unknown;
      source?: unknown;
      details?: unknown;
    };
    source = typeof body.source === "string" ? body.source.trim().slice(0, 60) : "";
    details = typeof body.details === "string" ? body.details.trim().slice(0, 1000) : "";
    email = typeof body.email === "string" ? normalizeEmail(body.email) : "";
    firstName = typeof body.firstName === "string" ? body.firstName.trim().slice(0, 100) : "";
  } catch {
    return Response.json({ ok: false }, { status: 400 });
  }

  if (!isValidEmail(email)) {
    return Response.json({ ok: false }, { status: 400 });
  }

  try {
    await recordSubscriber(email, firstName, source, details);
  } catch {
    return Response.json({ ok: false }, { status: 502 });
  }

  return Response.json({ ok: true });
}

async function recordSubscriber(email: string, firstName: string, source: string, details: string) {
  const { SES_AWS_ACCESS_KEY_ID, SES_AWS_SECRET_ACCESS_KEY, SES_AWS_REGION, SES_FROM_EMAIL, SES_TO_EMAIL } =
    process.env;

  if (!SES_AWS_ACCESS_KEY_ID || !SES_AWS_SECRET_ACCESS_KEY || !SES_AWS_REGION || !SES_FROM_EMAIL || !SES_TO_EMAIL) {
    if (process.env.NODE_ENV !== "production") {
      console.info("[subscribe] SES not configured; accepted", email);
    }
    return;
  }

  const client = new SESClient({
    region: SES_AWS_REGION,
    credentials: { accessKeyId: SES_AWS_ACCESS_KEY_ID, secretAccessKey: SES_AWS_SECRET_ACCESS_KEY },
  });

  const isReport = source === "benchmarks-report";

  await client.send(
    new SendEmailCommand({
      Source: SES_FROM_EMAIL,
      Destination: { ToAddresses: [SES_TO_EMAIL] },
      ReplyToAddresses: [email],
      Message: {
        Subject: { Data: `${isReport ? "Benchmark report request" : "Avishkar Letter signup"}: ${email}` },
        Body: {
          Text: {
            Data: `${
              isReport
                ? `${email} requested the full benchmark report.\n\n${details}`
                : `${firstName || "(no name given)"} <${email}> subscribed to The Avishkar Letter.`
            }\n\nSource: ${source || "unknown"}\nSubmitted at ${new Date().toISOString()}.`,
          },
        },
      },
    }),
  );
}
