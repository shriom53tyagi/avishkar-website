import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ArticlePage } from "@/components/av/ArticlePage";
import { SITE_URL } from "@/lib/site";

const SLUG = "the-practice-operating-system-nobody-sold-you";

export function generateStaticParams() {
  return [{ slug: SLUG }];
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  if (slug !== SLUG) return {};
  return {
    title: "The practice operating system nobody sold you",
    description:
      "Most growing practices assemble their technology one urgent decision at a time. A framework for deciding what to keep, what to connect, and what to build — before the next location makes it harder.",
    alternates: { canonical: `/insights/${SLUG}` },
    openGraph: {
      title: "The practice operating system nobody sold you",
      description:
        "Most growing practices assemble their technology one urgent decision at a time. A framework for deciding what to keep, what to connect, and what to build — before the next location makes it harder.",
      url: `${SITE_URL}/insights/${SLUG}`,
      type: "article",
      publishedTime: "2026-09-04",
    },
  };
}

export default async function Page({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  if (slug !== SLUG) notFound();
  return <ArticlePage />;
}
