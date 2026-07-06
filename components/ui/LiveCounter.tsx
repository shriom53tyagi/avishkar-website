"use client";

import { useEffect, useState } from "react";
import { useReducedMotion } from "framer-motion";

interface Props {
  start: number;
  /** Max random increment added per tick. */
  step?: number;
  intervalMs?: number;
  prefix?: string;
  suffix?: string;
  className?: string;
}

/**
 * A perpetually-incrementing "live" counter (Ramp-style). Ticks upward by a
 * small random amount on an interval to convey real-time activity. Static under
 * prefers-reduced-motion.
 */
export function LiveCounter({
  start,
  step = 4,
  intervalMs = 2200,
  prefix = "",
  suffix = "",
  className,
}: Props) {
  const reduce = useReducedMotion();
  const [n, setN] = useState(start);

  useEffect(() => {
    if (reduce) return;
    const t = setInterval(() => {
      setN((v) => v + Math.floor(Math.random() * step) + 1);
    }, intervalMs);
    return () => clearInterval(t);
  }, [reduce, step, intervalMs]);

  return (
    <span className={className}>
      {prefix}
      {/* Fixed locale: server/client locales can differ and break hydration */}
      {n.toLocaleString("en-US")}
      {suffix}
    </span>
  );
}
