import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { Stagger, StaggerItem } from "@/components/ui/Motion";
import { AmbientBackdrop } from "@/components/visuals/AmbientBackdrop";
import { CTA, FINAL_CTA } from "@/lib/content";

/**
 * The one dark band on the page, and the only full-height one. Everything
 * before it is neutral surfaces on a normal section rhythm, so a viewport-
 * filling accent close reads as a deliberate stop rather than another
 * section in the stack.
 *
 * `min-h-svh` rather than `min-h-screen`: on mobile browsers the dynamic
 * toolbar makes `vh` taller than the visible area, which would push the
 * buttons below the fold on exactly the section that exists to show them.
 *
 * Buttons here are plain links styled to match `Button`'s shape rather than
 * using the component directly: `Button`'s variants set their own
 * background/border/text colors, and this is the one place those need to be
 * inverted for a dark background.
 */
export function FinalCTA() {
  return (
    <section
      id="final-cta"
      className="relative isolate flex min-h-svh items-center overflow-hidden bg-accent py-28"
    >
      <AmbientBackdrop tone="dark" />

      <Container className="relative">
        <Stagger className="mx-auto max-w-3xl text-center">
          <StaggerItem>
            <h2 className="text-display font-serif font-light tracking-[-0.025em] text-white">
              {FINAL_CTA.headline}
            </h2>
          </StaggerItem>
          <StaggerItem>
            <p className="mx-auto mt-7 max-w-measure text-lead text-white/70">{FINAL_CTA.body}</p>
          </StaggerItem>
          <StaggerItem>
            <div className="mt-12 flex flex-col items-center gap-3 sm:flex-row sm:justify-center sm:gap-4">
              <Link
                href="/contact"
                className="inline-flex items-center gap-2 rounded bg-white px-6 py-3.5 text-body font-medium text-accent outline-offset-2 transition-transform duration-300 hover:-translate-y-0.5 hover:bg-white/90 focus-visible:outline-2 focus-visible:outline-white"
              >
                {CTA.book}
              </Link>
              <Link
                href="/agents"
                className="inline-flex items-center gap-2 rounded border border-white/25 px-6 py-3.5 text-body font-medium text-white outline-offset-2 transition-colors hover:border-white/60 hover:bg-white/5 focus-visible:outline-2 focus-visible:outline-white"
              >
                {CTA.seeWork}
              </Link>
            </div>
          </StaggerItem>
          <StaggerItem>
            <p className="mt-8 text-small text-white/50">No obligation. Thirty minutes, on us.</p>
          </StaggerItem>
        </Stagger>
      </Container>
    </section>
  );
}
