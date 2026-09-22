import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ArticlePage, type Article, type RelatedPost } from "@/components/av/ArticlePage";
import { getInsightBySlug, listPublishedInsights, type Insight } from "@/lib/db";
import { SITE_URL } from "@/lib/site";

export const revalidate = 60;

export function generateStaticParams() {
  return [];
}

function formatDate(date: Date): string {
  return date.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

function toArticle(insight: Insight): Article {
  return {
    slug: insight.slug,
    title: insight.title,
    kicker: insight.kicker,
    readTimeMinutes: insight.readTimeMinutes,
    dek: insight.dek,
    heroImageUrl: insight.heroImageUrl,
    heroImageAlt: insight.heroImageAlt,
    heroImageTagChipText: insight.heroImageTagChipText,
    bylineName: insight.bylineName,
    date: formatDate(insight.bylinePublishedAt),
    sections: insight.sections.map((s) => ({ id: s.id, heading: s.heading })),
    sources: insight.sources,
    bodyHtml: insight.bodyHtml,
  };
}

function toRelated(insight: Insight): RelatedPost {
  return {
    slug: insight.slug,
    cat: insight.kicker,
    read: `${insight.readTimeMinutes} min`,
    title: insight.title,
    date: formatDate(insight.bylinePublishedAt),
  };
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const insight = await getInsightBySlug(slug);
  if (!insight) return {};

  return {
    title: insight.title,
    description: insight.dek,
    alternates: { canonical: `/insights/${slug}` },
    openGraph: {
      title: insight.title,
      description: insight.dek,
      url: `${SITE_URL}/insights/${slug}`,
      type: "article",
      publishedTime: insight.bylinePublishedAt.toISOString(),
    },
  };
}

export default async function Page({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const insight = await getInsightBySlug(slug);
  if (!insight) notFound();

  const relatedInsights = await listPublishedInsights({ limit: 3, excludeSlug: slug });

  return <ArticlePage article={toArticle(insight)} related={relatedInsights.map(toRelated)} />;
}
