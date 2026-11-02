import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { AuditDetailPage } from "@/components/av/AuditDetailPage";
import { AUDITS, getAudit } from "@/lib/audits-data";
import { SITE_URL } from "@/lib/site";

export const dynamicParams = false;

export function generateStaticParams() {
  return AUDITS.map((a) => ({ slug: a.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const audit = getAudit((await params).slug);
  if (!audit) return {};
  return {
    title: audit.headline,
    description: `Practice audit: ${audit.label}. What we found and what we'd fix.`,
    alternates: { canonical: `/audits/${audit.slug}` },
    openGraph: {
      title: `${audit.headline} · Avishkar`,
      url: `${SITE_URL}/audits/${audit.slug}`,
      type: "article",
    },
    robots: audit.sample ? { index: false } : undefined,
  };
}

export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const audit = getAudit((await params).slug);
  if (!audit) notFound();
  return <AuditDetailPage audit={audit} />;
}
