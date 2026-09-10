import type { Metadata } from "next";
import { PageHeader } from "@/components/ui/PageHeader";
import { Section, SectionHeading } from "@/components/ui/Section";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { JsonLd } from "@/components/ui/JsonLd";
import { BUILT_NOT_BOUGHT, CTA, ENGAGEMENT_FAQS, HOW_WE_WORK } from "@/lib/content";
import { faqPageSchema, serviceSchema } from "@/lib/schema";

export const metadata: Metadata = {
  title: "How we work",
  description:
    "How Avishkar works with practices: a 30-minute conversation about the workflow, one scoped build on the systems you already use, then measurement.",
  alternates: { canonical: "/how-we-work" },
};

export default function HowWeWorkPage() {
  return (
    <>
      <JsonLd data={serviceSchema} />
      <JsonLd data={faqPageSchema(ENGAGEMENT_FAQS)} />
      <PageHeader
        eyebrow="How we work"
        title={HOW_WE_WORK.headline}
        description="No long discovery phase, no platform migration, no committee. We start with the workflow that frustrates you and build the smallest thing that fixes it."
      >
        <Button href="/contact">{CTA.book}</Button>
      </PageHeader>

      <Section tone="canvas">
        <div className="space-y-12 md:space-y-16">
          {HOW_WE_WORK.steps.map((step, i) => (
            <div
              key={step.title}
              className="grid gap-4 border-t border-line-strong pt-6 md:grid-cols-[minmax(0,3fr)_minmax(0,7fr)] md:gap-12"
            >
              <div>
                <p className="text-label text-ink-subtle">{String(i + 1).padStart(2, "0")}</p>
                <h2 className="mt-2 text-h3 font-serif font-normal tracking-[-0.01em] text-ink">{step.title}</h2>
                <p className="mt-2 text-small text-ink-subtle">{step.timing}</p>
              </div>
              <p className="max-w-measure text-body text-ink-muted">{step.body}</p>
            </div>
          ))}
        </div>
      </Section>

      <Section tone="alt">
        <SectionHeading
          eyebrow="What we build"
          title={BUILT_NOT_BOUGHT.headline}
          sub={BUILT_NOT_BOUGHT.body}
        />
        <ul className="mt-10 grid gap-x-10 gap-y-3 sm:grid-cols-2 lg:grid-cols-3">
          {BUILT_NOT_BOUGHT.forms.map((form) => (
            <li key={form} className="border-t border-line-strong pt-3 text-small text-ink">
              {form}
            </li>
          ))}
        </ul>
        <p className="mt-10 max-w-measure text-body text-ink-muted">
          {BUILT_NOT_BOUGHT.customBody}
        </p>
        <div className="mt-6">
          <Button href="/contact?intent=custom" variant="quiet" arrow>
            {CTA.custom}
          </Button>
        </div>
      </Section>

      <Section tone="canvas">
        <SectionHeading eyebrow="Questions" title="What practices usually ask first." />
        <dl className="mt-10 max-w-measure space-y-8">
          {ENGAGEMENT_FAQS.map((faq) => (
            <div key={faq.q} className="border-t border-line pt-5">
              <dt className="text-h3 font-serif font-normal tracking-[-0.01em] text-ink">{faq.q}</dt>
              <dd className="mt-3 text-body text-ink-muted">{faq.a}</dd>
            </div>
          ))}
        </dl>
      </Section>

      <div className="border-t border-line bg-alt py-16 md:py-20">
        <Container>
          <div className="max-w-measure">
            <h2 className="text-h2 font-serif font-light tracking-[-0.02em] text-ink">Start with the workflow.</h2>
            <p className="mt-4 text-lead text-ink-muted">
              Thirty minutes, no slide deck. If technology isn&apos;t the right answer, we&apos;ll
              say so.
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
