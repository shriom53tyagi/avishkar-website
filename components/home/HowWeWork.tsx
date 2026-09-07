import { Section, SectionHeading } from "@/components/ui/Section";
import { Reveal } from "@/components/ui/Reveal";
import { Button } from "@/components/ui/Button";
import { HOW_WE_WORK } from "@/lib/content";

export function HowWeWork() {
  return (
    <Section tone="canvas">
      <SectionHeading
        eyebrow="How we work"
        title={HOW_WE_WORK.headline}
        sub={HOW_WE_WORK.sub}
      />

      <div className="mt-12 grid gap-8 lg:grid-cols-3 lg:gap-12">
        {HOW_WE_WORK.steps.map((step, i) => (
          <Reveal key={step.title} delay={i * 0.05}>
            <div className="border-t border-line-strong pt-5">
              <div className="flex items-baseline justify-between gap-4">
                <p className="text-label text-ink-subtle">{String(i + 1).padStart(2, "0")}</p>
                <p className="text-label text-ink-subtle">{step.timing}</p>
              </div>
              <h3 className="mt-3 text-h3 text-ink">{step.title}</h3>
              <p className="mt-2 text-small text-ink-muted">{step.body}</p>
            </div>
          </Reveal>
        ))}
      </div>

      <div className="mt-10">
        <Button href="/how-we-work" variant="quiet" arrow>
          How we work
        </Button>
      </div>
    </Section>
  );
}
