import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ArticlePage, type Article } from "@/components/av/ArticlePage";
import { ISSUES, getIssue, type Issue } from "@/lib/letter-data";
import { SITE_URL } from "@/lib/site";

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

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const issue = getIssue((await params).slug);
  if (!issue) return {};
  return {
    title: issue.title,
    description: issue.teaser,
    alternates: { canonical: `/letter/${issue.slug}` },
    openGraph: { title: `${issue.title} · Avishkar`, description: issue.teaser, url: `${SITE_URL}/letter/${issue.slug}`, type: "article" },
      };
}

export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const issue = getIssue((await params).slug);
  if (!issue) notFound();
  return <ArticlePage article={toArticle(issue)} related={[]} basePath="/letter" backLabel="All issues" />;
}
