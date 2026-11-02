import { Section } from "@/components/ui/Section";
import { FadeUp } from "@/components/ui/Motion";
import { ScatterGrid } from "@/components/visuals/ScatterGrid";
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
        <h2 className="text-h2 font-serif font-light tracking-[-0.02em] text-ink">
          {PROBLEM.headline}
        </h2>
        <p className="mt-4 text-lead text-ink-muted">{PROBLEM.body}</p>
      </FadeUp>

      <div className="mt-12 lg:mt-14">
        <ScatterGrid items={PROBLEM.systems} />
      </div>

      <FadeUp delay={0.1}>
        <div className="card relative mt-12 p-8 lg:mt-14 lg:flex lg:items-center lg:justify-between lg:gap-12 md:p-10">
          <span aria-hidden className="absolute left-0 top-8 h-12 w-px bg-accent md:top-10" />
          <h3 className="text-h3 font-serif font-normal tracking-[-0.01em] text-ink lg:shrink-0">
            {PROBLEM.turn}
          </h3>
          <p className="mt-4 max-w-measure text-body text-ink-muted lg:mt-0">{PROBLEM.turnBody}</p>
        </div>
      </FadeUp>
    </Section>
  );
}
