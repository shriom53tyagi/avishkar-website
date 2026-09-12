import { cn } from "@/lib/utils";

/**
 * Shared heading block for standalone sections (Results, What We Do) that
 * need an eyebrow + title + description above a card grid.
 */
export function SectionHeading({
  eyebrow,
  title,
  description,
  align = "left",
  className,
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  align?: "left" | "center";
  className?: string;
}) {
  return (
    <div className={cn(align === "center" && "text-center", className)}>
      {eyebrow && <p className="eyebrow mb-4">{eyebrow}</p>}
      <h2 className="text-h2 font-serif font-light tracking-[-0.02em] text-ink">{title}</h2>
      {description && <p className="mt-4 text-lead text-ink-muted">{description}</p>}
    </div>
  );
}
