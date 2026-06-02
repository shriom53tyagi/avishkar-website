"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { Users } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * Interactive, animated visitor counter.
 *
 * On mount it POSTs to `/api/visitors` to record this visit and gets back the
 * real server-side count, then rolls the number up to that value. Hovering
 * lifts/sheens the chip; clicking gives a little "pulse" and re-fetches the
 * latest count. Honors `prefers-reduced-motion` (snaps instead of animating).
 */
export function VisitorCounter({ className }: { className?: string }) {
  const [target, setTarget] = useState<number | null>(null);
  const [display, setDisplay] = useState(0);
  const [pulse, setPulse] = useState(false);
  const reduce = useReducedMotion();
  const countedRef = useRef(false);

  // Record the visit once and fetch the authoritative count.
  useEffect(() => {
    if (countedRef.current) return;
    countedRef.current = true;

    let cancelled = false;
    (async () => {
      try {
        const res = await fetch("/api/visitors", { method: "POST" });
        const data = (await res.json()) as { count?: number };
        if (!cancelled && typeof data.count === "number") setTarget(data.count);
      } catch {
        // Network hiccup — leave the counter hidden rather than show a wrong value.
      }
    })();

    return () => {
      cancelled = true;
    };
  }, []);

  // Roll the displayed number up to the target.
  useEffect(() => {
    if (target === null) return;

    if (reduce) {
      setDisplay(target);
      return;
    }

    let raf = 0;
    const duration = 1600;
    const from = display;
    const start = performance.now();

    const tick = (t: number) => {
      const p = Math.min(1, (t - start) / duration);
      const eased = 1 - Math.pow(1 - p, 3); // easeOutCubic, matches AnimatedNumber
      setDisplay(Math.round(from + (target - from) * eased));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
    // Only re-run when the target changes (not on every display tick).
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [target, reduce]);

  // Click → quick pulse + refresh the live count (no extra increment).
  async function onClick() {
    setPulse(true);
    setTimeout(() => setPulse(false), 450);
    try {
      const res = await fetch("/api/visitors", { method: "GET" });
      const data = (await res.json()) as { count?: number };
      if (typeof data.count === "number") setTarget(data.count);
    } catch {
      /* ignore — keep the current value */
    }
  }

  const ready = target !== null;

  return (
    <motion.button
      type="button"
      onClick={onClick}
      aria-label={`${ready ? display.toLocaleString() : ""} visitors and counting — refresh`}
      whileHover={reduce ? undefined : { y: -2 }}
      animate={pulse && !reduce ? { scale: [1, 1.06, 1] } : { scale: 1 }}
      transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
      className={cn(
        "group inline-flex items-center gap-2.5 rounded-full border border-white/10 bg-white/[0.03] px-3.5 py-1.5",
        "backdrop-blur transition-colors hover:border-white/20",
        className
      )}
    >
      <span className="relative inline-flex h-1.5 w-1.5">
        <span className="absolute inset-0 rounded-full bg-cyan-400" />
        <span className="absolute inset-0 animate-ping rounded-full bg-cyan-400/60" />
      </span>
      <Users className="h-3.5 w-3.5 text-white/45 transition-colors group-hover:text-cyan-300" />
      <span className="font-mono text-[12px] tabular-nums tracking-tight text-white/80">
        {ready ? (
          <span className="text-gradient-cyan font-medium">{display.toLocaleString()}</span>
        ) : (
          <span className="text-white/30">—</span>
        )}
      </span>
      <span className="font-mono text-[10px] uppercase tracking-[0.16em] text-white/40">
        visitors
      </span>
    </motion.button>
  );
}
