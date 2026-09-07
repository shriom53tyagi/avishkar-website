import { Section } from "@/components/ui/Section";
import { Reveal } from "@/components/ui/Reveal";
import { Button } from "@/components/ui/Button";
import { CTA, FINAL_CTA } from "@/lib/content";

export function FinalCTA() {
  return (
    <Section tone="canvas" bordered>
      <Reveal className="max-w-measure">
        <h2 className="text-h2 text-ink">{FINAL_CTA.headline}</h2>
        <p className="mt-5 text-lead text-ink-muted">{FINAL_CTA.body}</p>
        <div className="mt-10 flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-4">
          <Button href="/contact">{CTA.book}</Button>
          <Button href="/agents" variant="secondary">
            {CTA.seeWork}
          </Button>
        </div>
      </Reveal>
    </Section>
  );
}
