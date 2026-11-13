import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ArticlePage, type Article } from "@/components/av/ArticlePage";
import { ISSUES, getIssue, type Issue } from "@/lib/letter-data";
import { JsonLd } from "@/components/ui/JsonLd";
import { breadcrumbSchema } from "@/lib/schema";
import { buildMetadata, clip } from "@/lib/seo";

export const dynamicParams = false;

export function generateStaticParams() {
  return ISSUES.map((i) => ({ slug: i.slug }));
}

// TODO: issues are local data for now; add real dek, read time and byline per issue.
function toArticle(issue: Issue): Article {
  return {
    slug: issue.slug,
    title: issue.title,
    kicker: `The Avishkar Letter · No. ${issue.number}`,
    readTimeMinutes: 3,
    dek: issue.teaser,
    heroImageUrl: "",
    heroImageAlt: "",
    heroImageTagChipText: null,
    bylineName: "Avishkar",
    date: issue.month,
    sections: [],
    sources: [],
    bodyHtml: issue.bodyHtml,
  };
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const issue = getIssue((await params).slug);
  if (!issue) return {};
  return buildMetadata({
    title: issue.title,
    description: clip(issue.teaser),
    path: `/letter/${issue.slug}`,
    type: "article",
  });
}

export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const issue = getIssue((await params).slug);
  if (!issue) notFound();
  return (
    <>
      <JsonLd
        data={breadcrumbSchema([
          { name: "Home", path: "/" },
          { name: "The Avishkar Letter", path: "/letter" },
          { name: issue.title, path: `/letter/${issue.slug}` },
        ])}
      />
      <ArticlePage
        article={toArticle(issue)}
        related={[]}
        basePath="/letter"
        backLabel="All issues"
      />
    </>
  );
}
