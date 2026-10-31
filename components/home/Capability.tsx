import { Section } from "@/components/ui/Section";
import { Stagger, StaggerItem, FadeUp } from "@/components/ui/Motion";
import { CAPABILITY } from "@/lib/content";

/**
 * The four-step method, set as a two-column spread: the headline holds the
 * left rail while the steps stack down the right. At full-page height a
 * single centred block would leave most of the section empty, so the columns
 * carry the height instead of padding doing it.
 */
export function Capability() {
  return (
    <Section id="capability" tone="alt" full nextId="agents">
      <div className="grid gap-12 lg:grid-cols-[minmax(0,4fr)_minmax(0,7fr)] lg:gap-24">
        <FadeUp className="lg:self-center">
          <p className="eyebrow mb-4">What Avishkar does</p>
          <h2 className="text-h2 font-serif font-light tracking-[-0.02em] text-ink">
            {CAPABILITY.headline}
          </h2>
        </FadeUp>

        <Stagger className="flex flex-col">
          {CAPABILITY.steps.map((step, i) => (
            <StaggerItem key={step.title}>
              <div className="group grid grid-cols-[auto_minmax(0,1fr)] gap-x-6 border-t border-line-strong py-7 md:gap-x-10 md:py-8">
                <p className="text-label font-medium text-accent transition-colors">
                  {String(i + 1).padStart(2, "0")}
                </p>
                <div>
                  <h3 className="text-h3 text-ink">{step.title}</h3>
                  <p className="mt-2 max-w-measure text-body text-ink-muted">{step.body}</p>
                </div>
              </div>
            </StaggerItem>
          ))}
        </Stagger>
      </div>
    </Section>
  );
}
