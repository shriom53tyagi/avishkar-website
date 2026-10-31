import { Section } from "@/components/ui/Section";
import { Stagger, StaggerItem, FadeUp } from "@/components/ui/Motion";
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
    <Section id="agents" tone="surface" full nextId="how-we-work">
      <FadeUp className="max-w-measure">
        <p className="eyebrow mb-4">Work you can see</p>
        <h2 className="text-h2 font-serif font-light tracking-[-0.02em] text-ink">
          {AGENTS_PREVIEW.headline}
        </h2>
        <p className="mt-4 text-lead text-ink-muted">{AGENTS_PREVIEW.sub}</p>
      </FadeUp>

      <Stagger className="mt-12 grid gap-4 sm:grid-cols-2">
        {FEATURED_AGENTS.map((agent) => (
          <StaggerItem key={agent.slug} className="h-full">
            <AgentCard agent={agent} />
          </StaggerItem>
        ))}
      </Stagger>

      <FadeUp className="mt-10">
        <Button href="/agents" variant="quiet" arrow>
          See all agents
        </Button>
      </FadeUp>

      <FadeUp>
        <div className="mt-16 border-t border-line pt-10 lg:flex lg:items-start lg:justify-between lg:gap-16">
          <div className="max-w-measure">
            <h3 className="text-h3 font-serif font-normal tracking-[-0.01em] text-ink">
              {BUILT_NOT_BOUGHT.customHeadline}
            </h3>
            <p className="mt-3 text-small text-ink-muted">{BUILT_NOT_BOUGHT.customBody}</p>
          </div>
          <div className="mt-6 shrink-0 lg:mt-1">
            <Button href="/contact?intent=custom" variant="secondary">
              {CTA.custom}
            </Button>
          </div>
        </div>
      </FadeUp>
    </Section>
  );
}
