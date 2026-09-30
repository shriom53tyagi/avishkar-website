import type { Metadata } from "next";
import { InsightsPage, type FeaturedPost, type Post } from "@/components/av/InsightsPage";
import { listPublishedInsights, type Insight } from "@/lib/db";

// Cached and revalidated in the background every 5 minutes instead of
// querying the DB on every request — content is the same either way,
// just served from cache between revalidations.
export const revalidate = 300;

export const metadata: Metadata = {
  title: "Insights",
  description:
    "Field notes on aesthetics, medspa operations, wellness, and the technology underneath — written by the people building it, for the people running the practice.",
  alternates: { canonical: "/insights" },
};

function formatDate(date: Date): string {
  return date.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

function toPost(insight: Insight): Post {
  return {
    slug: insight.slug,
    title: insight.title,
    cat: insight.kicker,
    read: `${insight.readTimeMinutes} min`,
    date: formatDate(insight.bylinePublishedAt),
    art: insight.heroImageTagChipText ?? insight.heroImageAlt,
    dek: insight.dek,
    img: insight.heroImageUrl,
  };
}

export default async function Page() {
  const insights = await listPublishedInsights({});

  const [first, ...rest] = insights;
  const featured: FeaturedPost | null = first
    ? { ...toPost(first), bylineName: first.bylineName }
    : null;
  const posts: Post[] = rest.map(toPost);

  return <InsightsPage posts={posts} featured={featured} />;
}
