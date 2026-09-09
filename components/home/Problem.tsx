import { Section } from "@/components/ui/Section";
import { Stagger, StaggerItem, FadeUp } from "@/components/ui/Motion";
import { PROBLEM } from "@/lib/content";

/**
 * Three beats down the page: the claim, the systems a practice already runs,
 * then the turn to what Avishkar does about them. The systems are separate
 * tiles because the point of the section is that they sit apart from each
 * other — a single joined-up list would argue the opposite.
 */
export function Problem() {
  return (
    <Section id="problem" tone="canvas" full nextId="capability">
      <FadeUp className="max-w-measure">
        <h2 className="text-h2 text-ink">{PROBLEM.headline}</h2>
        <p className="mt-4 text-lead text-ink-muted">{PROBLEM.body}</p>
      </FadeUp>

      <Stagger className="mt-12 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:mt-14 lg:grid-cols-6">
        {PROBLEM.systems.map((system) => (
          <StaggerItem key={system} className="h-full">
            <div className="flex h-full items-center justify-center rounded-lg border border-line bg-surface px-4 py-6 text-center text-small font-medium text-ink-muted shadow-card transition-colors duration-300 hover:border-accent hover:text-accent">
              {system}
            </div>
          </StaggerItem>
        ))}
      </Stagger>

      <FadeUp delay={0.1}>
        <div className="relative mt-12 rounded-lg border border-line bg-surface p-8 shadow-card lg:mt-14 lg:flex lg:items-center lg:justify-between lg:gap-12 md:p-10">
          <span aria-hidden className="absolute left-0 top-8 h-12 w-px bg-accent md:top-10" />
          <h3 className="text-h3 text-ink lg:shrink-0">{PROBLEM.turn}</h3>
          <p className="mt-4 max-w-measure text-body text-ink-muted lg:mt-0">
            {PROBLEM.turnBody}
          </p>
        </div>
      </FadeUp>
    </Section>
  );
}
