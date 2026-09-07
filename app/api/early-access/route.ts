import { isValidEmail, normalizeEmail } from "@/lib/early-access";

/**
 * Waitlist intake. Validation lives here so the homepage form stays dumb.
 *
 * To persist signups, set EARLY_ACCESS_WEBHOOK_URL (a POST endpoint that
 * accepts `{ email, source, at }`). Until then the route still returns 200
 * after a valid email so the UI can be reviewed without a provider.
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
  const webhook = process.env.EARLY_ACCESS_WEBHOOK_URL;

  if (!webhook) {
    if (process.env.NODE_ENV !== "production") {
      console.info("[early-access] no webhook configured; accepted", email);
    }
    return;
  }

  const res = await fetch(webhook, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      email,
      source: "early-access",
      at: new Date().toISOString(),
    }),
  });

  if (!res.ok) {
    throw new Error(`Webhook ${res.status}`);
  }
}