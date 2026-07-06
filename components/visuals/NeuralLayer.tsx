import { NeuralBackground } from "./NeuralBackground";

/**
 * Positioned, masked wrapper around NeuralBackground for use as a section
 * backdrop. Defaults suit dark chapters; override `className` to tune opacity /
 * mask per placement.
 */
export function NeuralLayer({
  className = "opacity-50 [mask-image:radial-gradient(ellipse_85%_70%_at_50%_40%,black,transparent_75%)]",
}: {
  className?: string;
}) {
  return (
    <div aria-hidden className={`pointer-events-none absolute inset-0 z-0 ${className}`}>
      <NeuralBackground />
    </div>
  );
}
