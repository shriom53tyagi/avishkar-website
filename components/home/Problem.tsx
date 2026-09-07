import { Section } from "@/components/ui/Section";
import { Reveal } from "@/components/ui/Reveal";
import { PROBLEM } from "@/lib/content";

export function Problem() {
  return (
    <Section tone="canvas">
      <div className="grid gap-12 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] lg:gap-20">
        <Reveal>
          <h2 className="text-h2 text-ink">{PROBLEM.headline}</h2>
          <ul className="mt-8 flex flex-wrap gap-x-6 gap-y-3">
            {PROBLEM.systems.map((system) => (
              <li key={system} className="text-small text-ink-muted">
                {system}
              </li>
            ))}
          </ul>
          <p className="mt-8 max-w-measure text-body text-ink-muted">{PROBLEM.body}</p>
        </Reveal>

        <Reveal delay={0.06} className="lg:pt-2">
          <div className="border-l border-line pl-6 md:pl-8">
            <h3 className="text-h3 text-ink">{PROBLEM.turn}</h3>
            <p className="mt-3 max-w-measure text-body text-ink-muted">{PROBLEM.turnBody}</p>
          </div>
        </Reveal>
      </div>
    </Section>
  );
}
