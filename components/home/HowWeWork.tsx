import { Section } from "@/components/ui/Section";
import { Stagger, StaggerItem, FadeUp } from "@/components/ui/Motion";
import { Button } from "@/components/ui/Button";
import { HOW_WE_WORK } from "@/lib/content";

/**
 * The engagement timeline. A marker sits on the rule above each step and the
 * rule runs between them, so the three columns read as one sequence.
 *
 * The steps are cards rather than bare columns: at full-page height, three
 * thin text columns leave the section looking empty, and giving them a
 * surface lets the row carry the extra height honestly.
 */
export function HowWeWork() {
  return (
    <Section id="how-we-work" tone="canvas" full nextId="trust">
      <FadeUp className="max-w-measure">
        <p className="eyebrow mb-4">How we work</p>
        <h2 className="text-h2 font-serif font-light tracking-[-0.02em] text-ink">{HOW_WE_WORK.headline}</h2>
        <p className="mt-4 text-lead text-ink-muted">{HOW_WE_WORK.sub}</p>
      </FadeUp>

      <Stagger className="mt-14 grid gap-5 lg:grid-cols-3 lg:gap-6">
        {HOW_WE_WORK.steps.map((step, i) => (
          <StaggerItem key={step.title} className="h-full">
            <div className="group card flex h-full flex-col p-7 transition-all duration-300 hover:-translate-y-1 hover:border-line-strong hover:shadow-card-hover md:p-8">
              <div className="flex items-baseline justify-between gap-4">
                <span className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-accent/30 bg-accent-tint text-label font-medium text-accent">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <p className="text-label uppercase tracking-[0.08em] text-ink-subtle">
                  {step.timing}
                </p>
              </div>
              <h3 className="mt-6 text-h3 font-serif font-normal tracking-[-0.01em] text-ink">{step.title}</h3>
              <p className="mt-3 text-body text-ink-muted">{step.body}</p>
            </div>
          </StaggerItem>
        ))}
      </Stagger>

      <FadeUp className="mt-12">
        <Button href="/how-we-work" variant="quiet" arrow>
          How we work
        </Button>
      </FadeUp>
    </Section>
  );
}
