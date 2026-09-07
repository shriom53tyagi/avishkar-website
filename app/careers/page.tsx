import type { Metadata } from "next";
import { PageHeader } from "@/components/ui/PageHeader";
import { Section, SectionHeading } from "@/components/ui/Section";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { CONTACT_EMAIL, OPEN_ROLES } from "@/lib/content";

export const metadata: Metadata = {
  title: "Careers",
  description:
    "Work at Avishkar: we build technology for medspas, aesthetic practices and clinics — integrations, automation, internal tools, and AI agents.",
  alternates: { canonical: "/careers" },
};

const VALUES = [
  {
    title: "Understand before you build",
    note: "We earn the right to automate a workflow by understanding how it actually runs first.",
  },
  {
    title: "Small, working, measured",
    note: "One scoped build that works beats a platform nobody adopted. We measure what we ship.",
  },
  {
    title: "Careful with patient data",
    note: "Least privilege, data minimization, and human oversight are part of the work, not a checkbox.",
  },
];

export default function CareersPage() {
  return (
    <>
      <PageHeader
        eyebrow="Careers"
        title="Build technology practices actually use."
        description="Our engineers and operators work directly with practice teams. If specific, unglamorous, high-leverage problems appeal to you, we'd like to talk."
      />

      <Section tone="canvas">
        <div className="grid gap-x-12 gap-y-10 sm:grid-cols-3">
          {VALUES.map((value) => (
            <div key={value.title} className="border-t border-line-strong pt-5">
              <h2 className="text-h3 text-ink">{value.title}</h2>
              <p className="mt-2 text-small text-ink-muted">{value.note}</p>
            </div>
          ))}
        </div>
      </Section>

      <Section tone="alt">
        <SectionHeading eyebrow="Open roles" title="Where we need help right now." />
        <ul className="mt-10 space-y-4">
          {OPEN_ROLES.map((role) => (
            <li key={role.title}>
              <a
                href={`mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(
                  `Application: ${role.title}`
                )}`}
                className="flex flex-col gap-4 rounded border border-line-strong bg-surface p-6 transition-colors hover:border-accent sm:flex-row sm:items-center sm:justify-between"
              >
                <div>
                  <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
                    <span className="text-h3 text-ink">{role.title}</span>
                    <span className="text-label uppercase text-ink-subtle">{role.team}</span>
                  </div>
                  <p className="mt-2 max-w-measure text-small text-ink-muted">{role.blurb}</p>
                  <p className="mt-2 text-small text-ink-subtle">{role.location}</p>
                </div>
                <span className="shrink-0 text-small font-medium text-accent">
                  Apply <span aria-hidden>&rarr;</span>
                </span>
              </a>
            </li>
          ))}
        </ul>
      </Section>

      <div className="border-t border-line bg-canvas py-16 md:py-20">
        <Container>
          <div className="max-w-measure">
            <h2 className="text-h2 text-ink">Don&apos;t see your role?</h2>
            <p className="mt-4 text-lead text-ink-muted">
              Send a note about the kind of problems you want to work on, and what you&apos;ve
              built.
            </p>
            <div className="mt-8">
              <Button href={`mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent("Resume")}`}>
                Email {CONTACT_EMAIL}
              </Button>
            </div>
          </div>
        </Container>
      </div>
    </>
  );
}
