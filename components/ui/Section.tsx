import type { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { Container } from "@/components/ui/Container";

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
}: {
  children: ReactNode;
  id?: string;
  tone?: Tone;
  className?: string;
  /** Hairline above the section, for adjacent sections sharing a tone. */
  bordered?: boolean;
}) {
  return (
    <section
      id={id}
      className={cn(
        "py-16 md:py-24 lg:py-28",
        TONES[tone],
        bordered && "border-t border-line",
        className
      )}
    >
      <Container>{children}</Container>
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
