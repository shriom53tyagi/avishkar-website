import { HomePage, type LatestInsight } from "@/components/av/HomePage";
import type { Metadata } from "next";
import { listPublishedInsights, type Insight } from "@/lib/db";
import { buildMetadata, DEFAULT_DESCRIPTION, DEFAULT_TITLE } from "@/lib/seo";

export const revalidate = 60;

export const metadata: Metadata = buildMetadata({
  title: { absolute: DEFAULT_TITLE },
  description: DEFAULT_DESCRIPTION,
  path: "/",
});

function formatDate(date: Date): string {
  return date.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

function toLatestInsight(insight: Insight): LatestInsight {
  return {
    slug: insight.slug,
    art: insight.heroImageTagChipText ?? insight.heroImageAlt,
    img: insight.heroImageUrl,
    cat: insight.kicker,
    read: `${insight.readTimeMinutes} min`,
    title: insight.title,
    dek: insight.dek,
    date: formatDate(insight.bylinePublishedAt),
  };
}

export default async function Page() {
  const insights = await listPublishedInsights({ limit: 3 });
  return <HomePage latestInsights={insights.map(toLatestInsight)} />;
}
