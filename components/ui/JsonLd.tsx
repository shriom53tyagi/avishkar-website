/**
 * Renders a JSON-LD structured-data <script> tag.
 *
 * Pass any Schema.org object as `data` and it gets serialized safely into the
 * page head/body for search engines. Invisible to users.
 *
 * This is a Server Component (no "use client") — the script is rendered in the
 * initial HTML, which is exactly what crawlers read.
 */
export function JsonLd({ data }: { data: Record<string, unknown> }) {
  return (
    <script
      type="application/ld+json"
      // Safe: `data` is our own static content, never user input.
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
