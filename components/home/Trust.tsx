import { Section } from "@/components/ui/Section";
import { Stagger, StaggerItem, FadeUp } from "@/components/ui/Motion";
import { Button } from "@/components/ui/Button";
import { SECURITY_PILLARS, TRUST } from "@/lib/content";

/**
 * Security posture. The pillars sit in bordered tiles rather than under bare
 * rules so the right column has enough weight to hold its half of a
 * full-page section.
 */
export function Trust() {
  return (
    <Section id="trust" tone="alt" full nextId="final-cta">
      <div className="grid gap-12 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:items-center lg:gap-20">
        <FadeUp>
          <p className="eyebrow mb-4">Trust</p>
          <h2 className="text-h2 font-serif font-light tracking-[-0.02em] text-ink">{TRUST.headline}</h2>
          <p className="mt-4 text-lead text-ink-muted">{TRUST.sub}</p>
          <div className="rule mt-6" />
          <div className="mt-8">
            <Button href="/security" variant="quiet" arrow>
              Learn about security
            </Button>
          </div>
        </FadeUp>

        <Stagger className="grid gap-4 sm:grid-cols-2">
          {SECURITY_PILLARS.map((pillar) => (
            <StaggerItem key={pillar.title} className="h-full">
              <div className="card h-full p-6 transition-all duration-300 hover:-translate-y-0.5">
                <p className="text-body font-semibold text-ink">{pillar.title}</p>
                <p className="mt-3 text-small text-ink-muted">{pillar.body}</p>
              </div>
            </StaggerItem>
          ))}
        </Stagger>
      </div>
    </Section>
  );
}
