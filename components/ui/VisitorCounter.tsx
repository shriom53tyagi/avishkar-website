"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { Users } from "lucide-react";
import { cn } from "@/lib/utils";

export function VisitorCounter({ className }: { className?: string }) {
  const [target, setTarget] = useState<number | null>(null);
  const [display, setDisplay] = useState(0);
  const [pulse, setPulse] = useState(false);
  const reduce = useReducedMotion();
  const countedRef = useRef(false);

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
      const eased = 1 - Math.pow(1 - p, 3);
      setDisplay(Math.round(from + (target - from) * eased));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [target, reduce]);

  async function onClick() {
    setPulse(true);
    setTimeout(() => setPulse(false), 450);
    try {
      const res = await fetch("/api/visitors", { method: "GET" });
      const data = (await res.json()) as { count?: number };
      if (typeof data.count === "number") setTarget(data.count);
    } catch {
      /* ignore */
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
        "group inline-flex items-center gap-2.5 rounded-full border border-slate-900/10 bg-slate-900/[0.03] px-3.5 py-1.5",
        "backdrop-blur transition-colors hover:border-slate-900/20",
        className
      )}
    >
      <span className="relative inline-flex h-1.5 w-1.5">
        <span className="absolute inset-0 rounded-full bg-cyan-400" />
        <span className="absolute inset-0 animate-ping rounded-full bg-cyan-400/60" />
      </span>
      <Users className="h-3.5 w-3.5 text-slate-400 transition-colors group-hover:text-cyan-600" />
      <span className="font-mono text-[12px] tabular-nums tracking-tight text-slate-700">
        {ready ? (
          <span className="text-gradient-cyan font-medium">{display.toLocaleString()}</span>
        ) : (
          <span className="text-slate-300">—</span>
        )}
      </span>
      <span className="font-mono text-[10px] uppercase tracking-[0.16em] text-slate-400">
        visitors
      </span>
    </motion.button>
  );
}
