/**
 * Early-access waitlist. The UI calls `submitEarlyAccess`; the API route is
 * the only place a list, webhook, or CRM should be attached.
 */

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function normalizeEmail(value: string): string {
  return value.trim().toLowerCase();
}

export function isValidEmail(value: string): boolean {
  const email = normalizeEmail(value);
  return EMAIL_PATTERN.test(email) && email.length <= 254;
}

export async function submitEarlyAccess(
  email: string
): Promise<{ ok: true } | { ok: false; error: string }> {
  const res = await fetch("/api/early-access", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email }),
  });

  if (res.ok) return { ok: true };

  if (res.status === 400) {
    return { ok: false, error: "Enter a valid work email." };
  }

  return { ok: false, error: "Couldn't save that. Try again." };
}

/** The Avishkar Letter signup (footer + /letter). Posts to /api/subscribe. */
export async function submitSubscribe(
  email: string,
  firstName: string,
  extra: { source?: string; details?: string } = {}
): Promise<{ ok: true } | { ok: false; error: string }> {
  try {
    const res = await fetch("/api/subscribe", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, firstName, ...extra }),
    });
    if (res.ok) return { ok: true };
    if (res.status === 400) return { ok: false, error: "Enter a valid work email." };
  } catch {
    // fall through to the generic error
  }
  return { ok: false, error: "Couldn't save that. Try again." };
}
