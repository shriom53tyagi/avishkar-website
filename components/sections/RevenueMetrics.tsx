"use client";

import { motion } from "framer-motion";
import { GridBackground } from "@/components/ui/GridBackground";
import { Reveal } from "@/components/ui/Reveal";
import { PROBLEMS } from "@/lib/data";
import { cn } from "@/lib/utils";

const SEVERITY_STYLES = {
  critical: {
    bar: "bg-rose-500",
    badge: "border-rose-200 bg-rose-50 text-rose-600",
    value: "text-rose-600",
  },
  high: {
    bar: "bg-amber-500",
    badge: "border-amber-200 bg-amber-50 text-amber-700",
    value: "text-amber-700",
  },
  medium: {
    bar: "bg-blue-500",
    badge: "border-blue-200 bg-blue-50 text-blue-700",
    value: "text-blue-700",
  },
} as const;

export function RevenueMetrics() {
  return (
    <section id="diagnosis" className="relative py-24 sm:py-32">
      <GridBackground />

      <div className="mx-auto max-w-7xl px-6">
        {/* Section header — left-aligned */}
        <div className="max-w-2xl">
          <Reveal>
            <span className="font-mono text-[11px] uppercase tracking-[0.14em] text-blue-700">
              The Diagnosis
            </span>
          </Reveal>
          <Reveal delay={0.05}>
            <h2 className="mt-3 text-[32px] font-semibold leading-[1.15] tracking-[-0.5px] text-gradient sm:text-4xl">
              Where your revenue leaks
            </h2>
          </Reveal>
          <Reveal delay={0.08}>
            <p className="mt-4 max-w-xl text-[15px] leading-relaxed text-slate-500">
              Each category quantified to the workflow level — ranked by financial impact, not by assumption.
            </p>
          </Reveal>
        </div>

        {/* Bar chart card */}
        <Reveal delay={0.1}>
          <div className="surface mt-10 max-w-3xl overflow-hidden rounded-2xl">
            <div className="divide-y divide-slate-900/[0.06]">
              {PROBLEMS.map((p, i) => {
                const s = SEVERITY_STYLES[p.severity as keyof typeof SEVERITY_STYLES];
                return (
                  <div key={p.code} className="px-6 py-4">
                    {/* Top row: code + label + severity */}
                    <div className="flex items-center gap-3">
                      <span className="shrink-0 font-mono text-[10px] uppercase tracking-[0.16em] text-slate-400">
                        {p.code}
                      </span>
                      <span className="flex-1 text-[14px] font-medium text-slate-700">
                        {p.title}
                      </span>
                      <span
                        className={cn(
                          "shrink-0 rounded-full border px-2 py-0.5 font-mono text-[9px] uppercase tracking-[0.14em]",
                          s.badge
                        )}
                      >
                        {p.severity}
                      </span>
                    </div>

                    {/* Bar + value row */}
                    <div className="mt-2.5 flex items-center gap-3">
                      <div className="relative h-2 flex-1 overflow-hidden rounded-full bg-slate-900/[0.06]">
                        <motion.div
                          initial={{ width: 0 }}
                          whileInView={{ width: `${p.pct}%` }}
                          viewport={{ once: true, margin: "-5% 0px" }}
                          transition={{
                            duration: 1,
                            delay: i * 0.08,
                            ease: [0.22, 1, 0.36, 1],
                          }}
                          className={cn("absolute inset-y-0 left-0 rounded-full", s.bar)}
                        />
                      </div>
                      <span className={cn("shrink-0 font-mono text-[13px] font-medium", s.value)}>
                        {p.metric}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </Reveal>

        {/* Insight line */}
        <Reveal delay={0.15}>
          <p className="mt-6 max-w-2xl text-[13px] leading-relaxed text-slate-400">
            Based on representative mid-size clinic group (2,400 monthly visits).{" "}
            <span className="text-slate-600">
              Your numbers are calculated from your own systems during the audit.
            </span>
          </p>
        </Reveal>
      </div>
    </section>
  );
}
