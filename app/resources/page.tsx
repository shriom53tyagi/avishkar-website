import type { Metadata } from "next";
import Link from "next/link";
import { PageHeader } from "@/components/ui/PageHeader";
import { Section } from "@/components/ui/Section";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { RESOURCES, CATEGORY_LABELS } from "@/lib/resources";
import { CTA } from "@/lib/content";

export const metadata: Metadata = {
  title: "Resources",
  description:
    "Guides and benchmark data on healthcare operations: revenue leakage, claim denials and patient no-shows.",
  alternates: { canonical: "/resources" },
};

export default function ResourcesPage() {
  return (
    <>
      <PageHeader
        eyebrow="Resources"
        title="Guides and benchmarks."
        description="Reference material on the operational and financial problems that come up most often in practice and clinic operations."
      />

      <Section tone="canvas">
        <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {RESOURCES.map((resource) => (
            <li key={resource.slug}>
              <Link
                href={`/resources/${resource.slug}`}
                className="flex h-full flex-col rounded border border-line bg-surface p-6 transition-colors hover:border-accent"
              >
                <div className="flex items-center justify-between gap-3">
                  <span className="text-label uppercase tracking-[0.08em] text-ink-subtle">
                    {CATEGORY_LABELS[resource.category]}
                  </span>
                  <span className="text-label text-ink-subtle">{resource.readingTime}</span>
                </div>
                <h2 className="mt-5 text-h3 text-ink">{resource.title}</h2>
                <p className="mt-2 flex-1 text-small text-ink-muted">
                  {resource.metaDescription}
                </p>
                <span className="mt-6 text-small font-medium text-accent">
                  Read <span aria-hidden>&rarr;</span>
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </Section>

      <div className="border-t border-line bg-alt py-16 md:py-20">
        <Container>
          <div className="max-w-measure">
            <h2 className="text-h2 text-ink">Want the numbers from your own practice?</h2>
            <p className="mt-4 text-lead text-ink-muted">
              Benchmarks describe typical organizations. We&apos;d rather look at your workflow
              and your data.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-4">
              <Button href="/contact">{CTA.book}</Button>
              <Button href="/agents" variant="secondary">
                {CTA.seeWork}
              </Button>
            </div>
          </div>
        </Container>
      </div>
    </>
  );
}
