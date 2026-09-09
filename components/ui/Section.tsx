import type { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { Container } from "@/components/ui/Container";
import { ScrollCue } from "@/components/ui/ScrollCue";

type Tone = "canvas" | "alt" | "surface";

const TONES: Record<Tone, string> = {
  canvas: "bg-canvas",
  alt: "bg-alt",
  surface: "bg-surface",
};

/**
 * Standard vertical rhythm for every page section. Sections separate by
 * alternating surface, not by borders — `tone="alt"` is the quieter band.
 */
export function Section({
  children,
  id,
  tone = "canvas",
  className,
  bordered,
  full,
  nextId,
}: {
  children: ReactNode;
  id?: string;
  tone?: Tone;
  className?: string;
  /** Hairline above the section, for adjacent sections sharing a tone. */
  bordered?: boolean;
  /**
   * Fill the viewport and centre the content vertically.
   *
   * `min-h` rather than `h`: on narrow screens the content of most sections
   * is taller than a viewport, and it must grow instead of being clipped.
   * `svh` rather than `vh` so a mobile browser's dynamic toolbar doesn't
   * inflate the height past the visible area.
   */
  full?: boolean;
  /** id of the next section. Renders a scroll-down cue that jumps there while this section is in view. Only meaningful on a `full` section. */
  nextId?: string;
}) {
  return (
    <section
      id={id}
      className={cn(
        "relative",
        full ? "flex min-h-svh items-center py-20 md:py-24" : "py-16 md:py-24 lg:py-28",
        TONES[tone],
        bordered && "border-t border-line",
        className
      )}
    >
      <Container className={full ? "w-full" : undefined}>{children}</Container>
      {full && nextId && <ScrollCue targetId={nextId} />}
    </section>
  );
}

/** Section label + headline + optional supporting line, consistently set. */
export function SectionHeading({
  eyebrow,
  title,
  sub,
  align = "left",
  className,
}: {
  eyebrow?: string;
  title: ReactNode;
  sub?: ReactNode;
  align?: "left" | "center";
  className?: string;
}) {
  return (
    <div
      className={cn(
        "max-w-measure",
        align === "center" && "mx-auto text-center",
        className
      )}
    >
      {eyebrow && <p className="eyebrow mb-4">{eyebrow}</p>}
      <h2 className="text-h2 text-ink">{title}</h2>
      {sub && <p className="mt-4 text-lead text-ink-muted">{sub}</p>}
    </div>
  );
}
