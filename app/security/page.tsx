import type { Metadata } from "next";
import { PageHeader } from "@/components/ui/PageHeader";
import { Section, SectionHeading } from "@/components/ui/Section";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { CONTACT_EMAIL, CTA, SECURITY_PILLARS, TRUST } from "@/lib/content";

export const metadata: Metadata = {
  title: "Security",
  description:
    "How Avishkar handles practice and patient data: least-privilege access, data minimization, HIPAA-aligned practices, BAA on request, and human oversight.",
  alternates: { canonical: "/security" },
};

/**
 * Every claim here has to survive a security questionnaire. Keep the language
 * specific about what we do and honest about what is not yet certified.
 */
const PRACTICES = [
  {
    title: "Access",
    body: "Access is requested per engagement, scoped to the systems the build touches, and read-only wherever reading is enough. Credentials are never shared between clients.",
  },
  {
    title: "Data handling",
    body: "We work with the specific fields a solution needs. Data in transit is encrypted, and we don't copy patient records into places the practice hasn't agreed to.",
  },
  {
    title: "Protected health information",
    body: "Where an engagement involves protected health information, it is handled under HIPAA-aligned practices and a Business Associate Agreement is available on request before any access begins.",
  },
  {
    title: "Oversight",
    body: "Agents surface findings and draft actions. Anything patient-facing or clinical is reviewed by your team before it goes out. We don't automate clinical judgement.",
  },
  {
    title: "Change and offboarding",
    body: "Access is reviewed as engagements change and revoked when work ends. You can ask us to remove data we hold at any time.",
  },
];

export default function SecurityPage() {
  return (
    <>
      <PageHeader eyebrow="Security" title={TRUST.headline} description={TRUST.sub} />

      <Section tone="canvas">
        <SectionHeading eyebrow="Principles" title="What this means in practice." />
        <dl className="mt-12 grid gap-x-12 gap-y-10 sm:grid-cols-2">
          {SECURITY_PILLARS.map((pillar) => (
            <div key={pillar.title} className="border-t border-line-strong pt-5">
              <dt className="text-h3 font-serif font-normal tracking-[-0.01em] text-ink">{pillar.title}</dt>
              <dd className="mt-2 max-w-measure text-small text-ink-muted">{pillar.body}</dd>
            </div>
          ))}
        </dl>
      </Section>

      <Section tone="alt">
        <SectionHeading eyebrow="Detail" title="How we handle access and data." />
        <div className="mt-12 space-y-10">
          {PRACTICES.map((practice) => (
            <div
              key={practice.title}
              className="grid gap-3 border-t border-line-strong pt-5 md:grid-cols-[minmax(0,3fr)_minmax(0,7fr)] md:gap-12"
            >
              <h3 className="text-h3 font-serif font-normal tracking-[-0.01em] text-ink">{practice.title}</h3>
              <p className="max-w-measure text-body text-ink-muted">{practice.body}</p>
            </div>
          ))}
        </div>
      </Section>

      <div className="border-t border-line bg-canvas py-16 md:py-20">
        <Container>
          <div className="max-w-measure">
            <h2 className="text-h2 font-serif font-light tracking-[-0.02em] text-ink">Security review or questionnaire?</h2>
            <p className="mt-4 text-lead text-ink-muted">
              Send it over. We&apos;d rather answer specific questions about your environment than
              publish generic assurances.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-4">
              <Button href={`mailto:${CONTACT_EMAIL}`}>Email the team</Button>
              <Button href="/contact" variant="secondary">
                {CTA.book}
              </Button>
            </div>
          </div>
        </Container>
      </div>
    </>
  );
}
