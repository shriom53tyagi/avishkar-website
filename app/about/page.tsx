import type { Metadata } from "next";
import { PageHeader } from "@/components/ui/PageHeader";
import { Section, SectionHeading } from "@/components/ui/Section";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { ABOUT, CTA, HERO } from "@/lib/content";

export const metadata: Metadata = {
  title: "About",
  description:
    "Avishkar is a technology company that builds around how practices already work — integrations, automation, internal tools, reporting, and AI agents.",
  alternates: { canonical: "/about" },
};

export default function AboutPage() {
  return (
    <>
      <PageHeader eyebrow="About" title={ABOUT.headline} description={ABOUT.sub} />

      <Section tone="canvas">
        <div className="grid gap-12 lg:grid-cols-[minmax(0,7fr)_minmax(0,5fr)] lg:gap-20">
          <div className="max-w-measure space-y-6">
            {ABOUT.body.map((paragraph) => (
              <p key={paragraph.slice(0, 32)} className="text-body text-ink-muted">
                {paragraph}
              </p>
            ))}
          </div>
          <div className="border-l border-line pl-6 md:pl-8">
            <p className="eyebrow">Who we work with</p>
            <p className="mt-4 text-body text-ink">{HERO.audience}</p>
          </div>
        </div>
      </Section>

      <Section tone="alt">
        <SectionHeading eyebrow="How we think" title="Four things we hold to." />
        <div className="mt-12 grid gap-x-12 gap-y-10 sm:grid-cols-2">
          {ABOUT.principles.map((principle) => (
            <div key={principle.title} className="border-t border-line-strong pt-5">
              <h3 className="text-h3 font-serif font-normal tracking-[-0.01em] text-ink">{principle.title}</h3>
              <p className="mt-2 max-w-measure text-small text-ink-muted">{principle.body}</p>
            </div>
          ))}
        </div>
      </Section>

      <div className="border-t border-line bg-canvas py-16 md:py-20">
        <Container>
          <div className="max-w-measure">
            <h2 className="text-h2 font-serif font-light tracking-[-0.02em] text-ink">Bring us the problem.</h2>
            <p className="mt-4 text-lead text-ink-muted">
              The best first conversation is a specific one: a workflow, a report you can&apos;t
              get, or a system that won&apos;t give up its data.
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
