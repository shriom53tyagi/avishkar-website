import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { Stagger, StaggerItem, FadeUp } from "@/components/ui/Motion";
import { AmbientBackdrop } from "@/components/visuals/AmbientBackdrop";
import { ScrollCue } from "@/components/ui/ScrollCue";
import { CTA, EARLY_ACCESS, HERO } from "@/lib/content";
import { EarlyAccessForm } from "@/components/home/EarlyAccessForm";

/**
 * Company hero on the left. The right column is the empty region — used to
 * show the model Avishkar is building, without replacing the opening line.
 *
 * Sized to fill the viewport below the sticky navbar: `svh` (not `vh`) so a
 * mobile browser's dynamic toolbar doesn't inflate it, minus the navbar's
 * 4rem height plus its 1px bottom border, so the section ends exactly at the
 * fold. `min-h`, not `h`, so on narrow screens — where the two columns stack
 * and the content is taller than a viewport — it still grows instead of
 * clipping.
 */
export function Hero() {
  return (
    <section className="relative isolate flex min-h-[calc(100svh-4rem-1px)] items-center overflow-hidden border-b border-line bg-canvas py-20 md:py-24">
      <AmbientBackdrop />

      <Container className="relative">
        <div className="grid w-full gap-14 lg:grid-cols-[minmax(0,7fr)_minmax(300px,5fr)] lg:items-center lg:gap-16">
          <Stagger className="max-w-2xl">
            <StaggerItem>
              <h1 className="text-display text-ink">{HERO.headline}</h1>
            </StaggerItem>

            <StaggerItem>
              <p className="mt-6 max-w-measure text-lead text-ink-muted">{HERO.sub}</p>
            </StaggerItem>

            <StaggerItem>
              <div className="mt-10 flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-4">
                <Button href="/agents">{CTA.seeWork}</Button>
                <Button href="/contact" variant="secondary">
                  {CTA.book}
                </Button>
              </div>
            </StaggerItem>

            <StaggerItem>
              <p className="mt-10 border-t border-line pt-5 text-small text-ink-subtle">
                {HERO.audience}
              </p>
            </StaggerItem>
          </Stagger>

          <FadeUp delay={0.25}>
            <aside
              id="early-access"
              className="min-w-0 rounded-lg border border-line bg-surface/70 p-6 shadow-card backdrop-blur-sm"
              aria-label={EARLY_ACCESS.eyebrow}
            >
              <p className="eyebrow">{EARLY_ACCESS.eyebrow}</p>
              <h2 className="mt-3 text-h3 text-ink">
                {EARLY_ACCESS.headline}
              </h2>
              <p className="mt-3 text-small text-ink-muted">{EARLY_ACCESS.body}</p>
              <p className="mt-2 text-small text-ink-subtle">{EARLY_ACCESS.status}</p>
              <div className="-mx-6 mt-6 px-6">
                <EarlyAccessForm idPrefix="hero-early-access" compact />
              </div>
            </aside>
          </FadeUp>
        </div>
      </Container>

      <ScrollCue targetId="problem" />
    </section>
  );
}
