"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useInView, useReducedMotion } from "framer-motion";

/**
 * A set of named items that start scattered at odd angles and settle into a
 * clean grid, joined by a hand-drawn connecting thread — the "ten systems
 * become one" motif from the brand reference, ported for a fixed list of
 * named items instead of a scroll-driven film. Runs once on entry.
 */
export function ScatterGrid({ items }: { items: string[] }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.4 });
  const reduce = useReducedMotion();
  const [settled, setSettled] = useState(false);

  const scatter = useMemo(
    () =>
      items.map((_, i) => ({
        x: (Math.sin(i * 12.9) * 0.5 + 0.5) * 80 + 5,
        y: (Math.cos(i * 7.3) * 0.5 + 0.5) * 60 + 10,
        r: ((i * 37) % 14) - 7,
      })),
    [items]
  );

  const cols = items.length > 3 ? 3 : items.length;
  const rows = Math.ceil(items.length / cols);
  const grid = useMemo(
    () =>
      items.map((_, i) => ({
        x: ((i % cols) + 0.5) * (100 / cols),
        y: ((Math.floor(i / cols) + 0.5) * 100) / rows,
      })),
    [items, cols, rows]
  );

  useEffect(() => {
    if (!inView) return;
    if (reduce) {
      setSettled(true);
      return;
    }
    const t = setTimeout(() => setSettled(true), 60);
    return () => clearTimeout(t);
  }, [inView, reduce]);

  const pathD = `M${grid.map((g) => `${g.x} ${g.y}`).join(" L")}`;

  return (
    <div ref={ref} className="relative h-[22rem] w-full sm:h-[26rem]">
      <svg
        aria-hidden
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
        className="absolute inset-0 h-full w-full"
      >
        <path
          d={pathD}
          fill="none"
          stroke="var(--brass)"
          strokeWidth="0.3"
          strokeLinecap="round"
          strokeLinejoin="round"
          vectorEffect="non-scaling-stroke"
          style={{
            opacity: settled ? 0.5 : 0,
            transition: "opacity 1.1s ease .35s",
          }}
        />
      </svg>

      {items.map((item, i) => {
        const from = scatter[i];
        const to = grid[i];
        const pos = settled ? to : from;
        return (
          <div
            key={item}
            className="card absolute flex items-center justify-center px-4 py-5 text-center text-small font-medium text-ink-muted"
            style={{
              left: `${pos.x}%`,
              top: `${pos.y}%`,
              transform: `translate(-50%, -50%) rotate(${settled ? 0 : from.r}deg)`,
              minWidth: "9rem",
              transition: reduce
                ? "none"
                : `left 1.1s cubic-bezier(.2,.9,.25,1) ${i * 0.05}s, top 1.1s cubic-bezier(.2,.9,.25,1) ${i * 0.05}s, transform 1.1s cubic-bezier(.2,.9,.25,1) ${i * 0.05}s`,
            }}
          >
            {item}
          </div>
        );
      })}
    </div>
  );
}
