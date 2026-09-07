import { Section, SectionHeading } from "@/components/ui/Section";
import { Reveal } from "@/components/ui/Reveal";
import { AgentCard } from "@/components/ui/AgentCard";
import { Button } from "@/components/ui/Button";
import { FEATURED_AGENTS } from "@/lib/agents";
import { AGENTS_PREVIEW, BUILT_NOT_BOUGHT, CTA } from "@/lib/content";

/**
 * The showcase. It follows the breadth section deliberately, and closes with
 * the custom-build escape hatch — the point where a visitor decides none of
 * these examples is their problem is the point to offer a conversation.
 */
export function AgentsPreview() {
  return (
    <Section id="agents" tone="alt">
      <SectionHeading
        eyebrow="Work you can see"
        title={AGENTS_PREVIEW.headline}
        sub={AGENTS_PREVIEW.sub}
      />

      <div className="mt-12 grid gap-4 sm:grid-cols-2">
        {FEATURED_AGENTS.map((agent, i) => (
          <Reveal key={agent.slug} delay={i * 0.04} className="h-full w-full">
            <AgentCard agent={agent} />
          </Reveal>
        ))}
      </div>

      <div className="mt-10">
        <Button href="/agents" variant="quiet" arrow>
          See all agents
        </Button>
      </div>

      <Reveal>
        <div className="mt-16 border-t border-line pt-10 lg:flex lg:items-start lg:justify-between lg:gap-16">
          <div className="max-w-measure">
            <h3 className="text-h3 text-ink">{BUILT_NOT_BOUGHT.customHeadline}</h3>
            <p className="mt-3 text-small text-ink-muted">{BUILT_NOT_BOUGHT.customBody}</p>
          </div>
          <div className="mt-6 shrink-0 lg:mt-1">
            <Button href="/contact?intent=custom" variant="secondary">
              {CTA.custom}
            </Button>
          </div>
        </div>
      </Reveal>
    </Section>
  );
}
