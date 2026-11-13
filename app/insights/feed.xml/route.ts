import { listPublishedInsights, type Insight } from "@/lib/db";
import { SITE_URL } from "@/lib/site";

export const revalidate = 300;

function esc(text: string): string {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

export async function GET() {
  let insights: Insight[] = [];
  try {
    insights = await listPublishedInsights({ limit: 50 });
  } catch (error) {
    console.warn("[feed] Could not load Insights; serving an empty feed.", error);
  }

  const items = insights
    .map(
      (i) => `    <item>
      <title>${esc(i.title)}</title>
      <link>${SITE_URL}/insights/${i.slug}</link>
      <guid isPermaLink="true">${SITE_URL}/insights/${i.slug}</guid>
      <pubDate>${i.bylinePublishedAt.toUTCString()}</pubDate>
      <author>${esc(i.bylineName)}</author>
      <category>${esc(i.kicker)}</category>
      <description>${esc(i.dek)}</description>
    </item>`,
    )
    .join("\n");

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>Avishkar Insights</title>
    <link>${SITE_URL}/insights</link>
    <atom:link href="${SITE_URL}/insights/feed.xml" rel="self" type="application/rss+xml" />
    <description>Field notes from Avishkar, a technology partner for medspas, on medspa operations and technology.</description>
    <language>en-us</language>
${items}
  </channel>
</rss>
`;

  return new Response(xml, {
    headers: { "Content-Type": "application/rss+xml; charset=utf-8" },
  });
}
