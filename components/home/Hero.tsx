import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { CTA, EARLY_ACCESS, HERO } from "@/lib/content";
import { EarlyAccessForm } from "@/components/home/EarlyAccessForm";

/**
 * Company hero on the left. The right column is the empty region — used to
 * show the model Avishkar is building, without replacing the opening line.
 */
export function Hero() {
  return (
    <section className="border-b border-line bg-canvas pb-16 pt-16 md:pb-24 md:pt-24">
      <Container>
        <div className="grid gap-12 lg:grid-cols-[minmax(0,7fr)_minmax(280px,5fr)] lg:items-start lg:gap-16">
          <div className="max-w-2xl">
            <h1 className="text-display text-ink">{HERO.headline}</h1>
            <p className="mt-6 max-w-measure text-lead text-ink-muted">{HERO.sub}</p>

            <div className="mt-10 flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-4">
              <Button href="/agents">{CTA.seeWork}</Button>
              <Button href="/contact" variant="secondary">
                {CTA.book}
              </Button>
            </div>

            <p className="mt-8 text-small text-ink-muted">{HERO.audience}</p>
          </div>

          <aside id="early-access" className="min-w-0" aria-label={EARLY_ACCESS.eyebrow}>
            <p className="eyebrow">{EARLY_ACCESS.eyebrow}</p>
            <h2 className="mt-3 text-h3 text-ink">{EARLY_ACCESS.headline}</h2>
            <p className="mt-3 text-small text-ink-muted">{EARLY_ACCESS.body}</p>
            <p className="mt-2 text-small text-ink-subtle">{EARLY_ACCESS.status}</p>
            <div className="mt-6">
              <EarlyAccessForm idPrefix="hero-early-access" compact />
            </div>
          </aside>
        </div>
      </Container>
    </section>
  );
}
