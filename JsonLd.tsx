/**
 * Renders a JSON-LD structured-data <script> tag.
 *
 * Usage:
 *   <JsonLd data={organizationSchema} />
 *
 * This is a Server Component (no "use client") so the script is in the raw
 * HTML that crawlers read — not injected later by JavaScript.
 *
 * dangerouslySetInnerHTML is safe here because `data` is always our own static
 * content, never user input. JSON.stringify handles all escaping correctly.
 */
export function JsonLd({ data }: { data: Record<string, unknown> }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
