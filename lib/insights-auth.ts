let warnedMissingApiKey = false;

/**
 * Checks the Bearer token against INSIGHTS_PUBLISH_API_KEY. Returns false
 * (and logs once) if the env var is missing, so the Content Engine's writes
 * fail closed instead of accepting unauthenticated requests.
 */
export function isAuthorizedPublishRequest(request: Request): boolean {
  const expected = process.env.INSIGHTS_PUBLISH_API_KEY;
  if (!expected) {
    if (!warnedMissingApiKey) {
      console.warn("[insights] INSIGHTS_PUBLISH_API_KEY is not set — publish API is disabled.");
      warnedMissingApiKey = true;
    }
    return false;
  }

  const header = request.headers.get("authorization") ?? "";
  const [scheme, token] = header.split(" ");
  return scheme === "Bearer" && token === expected;
}
