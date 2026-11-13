import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { AuditDetailPage } from "@/components/av/AuditDetailPage";
import { AUDITS, getAudit } from "@/lib/audits-data";
import { JsonLd } from "@/components/ui/JsonLd";
import { breadcrumbSchema } from "@/lib/schema";
import { buildMetadata } from "@/lib/seo";

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
  return buildMetadata({
    title: audit.headline,
    description: `Practice audit: ${audit.label}. What Avishkar, a technology partner for medspas, found and what we would fix.`,
    path: `/audits/${audit.slug}`,
    type: "article",
    noindex: audit.sample,
  });
}

export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const audit = getAudit((await params).slug);
  if (!audit) notFound();
  return (
    <>
      <JsonLd
        data={breadcrumbSchema([
          { name: "Home", path: "/" },
          { name: "Practice Audits", path: "/audits" },
          { name: audit.headline, path: `/audits/${audit.slug}` },
        ])}
      />
      <AuditDetailPage audit={audit} />
    </>
  );
}
