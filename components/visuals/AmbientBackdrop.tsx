import { cn } from "@/lib/utils";

/**
 * Slow-drifting colour blooms behind a section.
 *
 * Animation is pure CSS on `transform`/`opacity` so it runs on the compositor
 * and costs no main-thread work; `prefers-reduced-motion` freezes it into a
 * static wash (see globals.css). Purely decorative — never put content here.
 */
export function AmbientBackdrop({
  className,
  tone = "light",
}: {
  className?: string;
  /** `dark` brightens the blooms so they read on the accent band. */
  tone?: "light" | "dark";
}) {
  return (
    <div
      aria-hidden
      className={cn("pointer-events-none absolute inset-0 overflow-hidden", className)}
    >
      <span className={cn("ambient-bloom ambient-bloom-a", tone === "dark" && "is-dark")} />
      <span className={cn("ambient-bloom ambient-bloom-b", tone === "dark" && "is-dark")} />
      <span className={cn("ambient-bloom ambient-bloom-c", tone === "dark" && "is-dark")} />
      <span className={cn("ambient-grid", tone === "dark" && "is-dark")} />
    </div>
  );
}
