import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ArticlePage, type Article, type RelatedPost } from "@/components/av/ArticlePage";
import { getInsightBySlug, listPublishedInsights, type Insight } from "@/lib/db";
import { JsonLd } from "@/components/ui/JsonLd";
import { blogPostingSchema, breadcrumbSchema } from "@/lib/schema";
import { buildMetadata, clip, TITLE_SUFFIX } from "@/lib/seo";

// Cached and revalidated in the background every 5 minutes instead of
// querying the DB on every request — content is the same either way,
// just served from cache between revalidations.
export const revalidate = 300;

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

  const title =
    insight.title.length + TITLE_SUFFIX.length <= 60 ? insight.title : { absolute: insight.title };

  return buildMetadata({
    title,
    description: clip(insight.dek),
    path: `/insights/${slug}`,
    type: "article",
    publishedTime: insight.bylinePublishedAt.toISOString(),
    modifiedTime: insight.updatedAt.toISOString(),
    authors: [insight.bylineName],
    image: insight.heroImageUrl
      ? { url: insight.heroImageUrl, alt: insight.heroImageAlt || insight.title }
      : undefined,
  });
}

export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const insight = await getInsightBySlug(slug);
  if (!insight) notFound();

  const relatedInsights = await listPublishedInsights({ limit: 3, excludeSlug: slug });

  return (
    <>
      <JsonLd
        data={blogPostingSchema({
          title: insight.title,
          description: clip(insight.dek),
          path: `/insights/${slug}`,
          datePublished: insight.bylinePublishedAt.toISOString(),
          dateModified: insight.updatedAt.toISOString(),
          authorName: insight.bylineName,
          imageUrl: insight.heroImageUrl || null,
        })}
      />
      <JsonLd
        data={breadcrumbSchema([
          { name: "Home", path: "/" },
          { name: "Insights", path: "/insights" },
          { name: insight.title, path: `/insights/${slug}` },
        ])}
      />
      <ArticlePage article={toArticle(insight)} related={relatedInsights.map(toRelated)} />
    </>
  );
}
