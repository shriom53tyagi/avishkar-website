import { Section, SectionHeading } from "@/components/ui/Section";
import { Reveal } from "@/components/ui/Reveal";
import { CAPABILITY } from "@/lib/content";

export function Capability() {
  return (
    <Section tone="alt">
      <SectionHeading eyebrow="What Avishkar does" title={CAPABILITY.headline} />

      <div className="mt-12 grid gap-x-8 gap-y-10 sm:grid-cols-2 lg:mt-16 lg:grid-cols-4">
        {CAPABILITY.steps.map((step, i) => (
          <Reveal key={step.title} delay={i * 0.05}>
            <div className="border-t border-line-strong pt-5">
              <p className="text-label text-ink-subtle">{String(i + 1).padStart(2, "0")}</p>
              <h3 className="mt-3 text-h3 text-ink">{step.title}</h3>
              <p className="mt-2 text-small text-ink-muted">{step.body}</p>
            </div>
          </Reveal>
        ))}
      </div>
    </Section>
  );
}
