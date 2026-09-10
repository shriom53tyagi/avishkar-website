"use client";

import { useMemo } from "react";
import { useReducedMotion } from "framer-motion";

// Safe zones that stay clear of the hero's text column and the aside card:
// a strip above the copy, a strip below it, and the gap between the two
// columns. Each zone is [xMin, xMax, yMin, yMax] in percent.
const ZONES: [number, number, number, number][] = [
  [4, 26, 6, 15],
  [8, 20, 78, 88],
  [61, 66, 16, 26],
];

/**
 * Ambient, out-of-focus cards drifting behind the hero — the reference's
 * scattered-systems field, minus the scroll choreography. Purely decorative:
 * faded and never interactive, so it reads as texture rather than as a
 * second copy of the list. Sized to its positioned parent, so mount it
 * inside the one section it should drift across.
 */
export function FloatingCards({ items }: { items: string[] }) {
  const reduce = useReducedMotion();

  const cards = useMemo(() => {
    const perZone = new Array(ZONES.length).fill(0);
    return items.map((item, i) => {
      const zoneIndex = i % ZONES.length;
      const slot = perZone[zoneIndex]++;
      const zone = ZONES[zoneIndex];
      // Spread items sharing a zone evenly along its length instead of
      // letting random jitter stack them on top of each other.
      const total = Math.ceil(items.length / ZONES.length);
      const t = total > 1 ? slot / (total - 1) : 0.5;
      const jitter = ((i * 37) % 100) / 100 - 0.5;
      const x = zone[0] + t * (zone[1] - zone[0]);
      const y = zone[2] + ((jitter + 0.5) * (zone[3] - zone[2]));
      const r = ((i * 41) % 16) - 8;
      return { item, x, y, r, delay: (i % 6) * 0.9 };
    });
  }, [items]);

  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
      {cards.map(({ item, x, y, r, delay }, i) => (
        <div
          key={`${item}-${i}`}
          className="card absolute whitespace-nowrap px-5 py-4 text-small font-medium text-ink opacity-0"
          style={{
            left: `${x}%`,
            top: `${y}%`,
            transform: `translate(-50%, -50%) rotate(${r}deg)`,
            animation: reduce ? "none" : `float-in 1.4s ease forwards, drift 9s ease-in-out ${delay}s infinite`,
            animationDelay: `${delay}s, ${delay + 1.4}s`,
            opacity: reduce ? 0.55 : undefined,
          }}
        >
          {item}
        </div>
      ))}
    </div>
  );
}
