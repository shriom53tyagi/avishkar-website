import { Section, SectionHeading } from "@/components/ui/Section";
import { Reveal } from "@/components/ui/Reveal";
import { Button } from "@/components/ui/Button";
import { SECURITY_PILLARS, TRUST } from "@/lib/content";

export function Trust() {
  return (
    <Section tone="alt">
      <div className="grid gap-12 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:gap-20">
        <Reveal>
          <SectionHeading eyebrow="Trust" title={TRUST.headline} sub={TRUST.sub} />
          <div className="mt-8">
            <Button href="/security" variant="quiet" arrow>
              Learn about security
            </Button>
          </div>
        </Reveal>

        <Reveal delay={0.06}>
          <dl className="grid gap-x-10 gap-y-8 sm:grid-cols-2">
            {SECURITY_PILLARS.map((pillar) => (
              <div key={pillar.title} className="border-t border-line-strong pt-4">
                <dt className="text-small font-semibold text-ink">{pillar.title}</dt>
                <dd className="mt-2 text-small text-ink-muted">{pillar.body}</dd>
              </div>
            ))}
          </dl>
        </Reveal>
      </div>
    </Section>
  );
}
