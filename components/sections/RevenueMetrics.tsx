"use client";

import {
  TrendingUp,
  CalendarX2,
  FileX2,
  PhoneOff,
  Droplets,
  Timer,
  AlertTriangle,
} from "lucide-react";
import { motion } from "framer-motion";
import { GridBackground } from "@/components/ui/GridBackground";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { AnimatedNumber } from "@/components/ui/AnimatedNumber";
import { Reveal } from "@/components/ui/Reveal";
import { REVENUE_METRICS, PROBLEMS } from "@/lib/data";
import { cn } from "@/lib/utils";

/**
 * "Hidden Revenue Is Already Flowing Through Your Organization."
 *
 * Merged section: premium KPI cards quantifying recoverable revenue, followed by
 * a compact "Where Revenue Leaks" breakdown. (Combines the former Revenue
 * Recovery + Problems sections to cut repetition.)
 */

const ICONS = [TrendingUp, CalendarX2, FileX2, PhoneOff, Droplets, Timer];

const ACCENTS = {
  cyan: {
    text: "text-cyan-300",
    ring: "border-cyan-400/20",
    glow: "from-cyan-400/15",
    chip: "bg-cyan-400/10 text-cyan-200",
  },
  emerald: {
    text: "text-emerald-300",
    ring: "border-emerald-400/20",
    glow: "from-emerald-400/15",
    chip: "bg-emerald-400/10 text-emerald-200",
  },
  violet: {
    text: "text-violet-300",
    ring: "border-violet-400/20",
    glow: "from-violet-400/15",
    chip: "bg-violet-400/10 text-violet-200",
  },
} as const;

export function RevenueMetrics() {
  return (
    <section id="revenue" className="relative py-24 sm:py-32">
      <GridBackground />

      <div className="mx-auto max-w-7xl px-6">
        <SectionHeading
          eyebrow="Revenue recovery"
          title={
            <>
              Hidden revenue is already{" "}
              <span className="text-gradient-cyan">flowing through your organization.</span>
            </>
          }
          description="A representative leakage profile from an Operational Intelligence Audit across a mid-size clinic group. Every figure is tied to a specific workflow — and a recovery plan."
        />

        <div className="mt-16 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {REVENUE_METRICS.map((m, i) => {
            const Icon = ICONS[i] ?? TrendingUp;
            const a = ACCENTS[m.accent as keyof typeof ACCENTS] ?? ACCENTS.cyan;
            return (
              <Reveal key={m.note} delay={i * 0.06}>
                <div
                  className={cn(
                    "surface group relative h-full overflow-hidden rounded-2xl p-6 transition-transform duration-300 hover:-translate-y-1",
                    a.ring
                  )}
                >
                  {/* corner glow */}
                  <div
                    className={cn(
                      "pointer-events-none absolute -right-10 -top-10 h-32 w-32 rounded-full bg-gradient-to-br to-transparent opacity-60 blur-2xl transition-opacity duration-500 group-hover:opacity-100",
                      a.glow
                    )}
                  />
                  <div className="flex items-start justify-between">
                    <span
                      className={cn(
                        "inline-flex h-10 w-10 items-center justify-center rounded-full border bg-white/[0.03]",
                        a.ring
                      )}
                    >
                      <Icon className={cn("h-4.5 w-4.5", a.text)} />
                    </span>
                    <span className="font-mono text-[10px] uppercase tracking-[0.16em] text-white/35">
                      recoverable
                    </span>
                  </div>

                  <div className="mt-6 font-display text-4xl font-medium tracking-tight text-white sm:text-[44px]">
                    <AnimatedNumber
                      value={m.value}
                      prefix={"prefix" in m ? m.prefix : undefined}
                      suffix={m.suffix}
                      decimals={m.decimals}
                      className={a.text}
                    />
                  </div>
                  <div className="mt-2 text-[15px] text-white/60">{m.note}</div>
                </div>
              </Reveal>
            );
          })}
        </div>

        <Reveal delay={0.2}>
          <p className="mx-auto mt-10 max-w-2xl text-center text-[13px] text-white/40">
            Figures illustrate a typical audit outcome. Your numbers are quantified against your own
            systems before any agent is deployed.
          </p>
        </Reveal>

        {/* Where Revenue Leaks */}
        <div className="mt-20">
          <Reveal>
            <div className="flex items-center gap-3">
              <span className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-amber-400/25 bg-amber-400/10">
                <AlertTriangle className="h-4 w-4 text-amber-300" />
              </span>
              <div>
                <h3 className="font-display text-2xl font-medium tracking-tight text-gradient">
                  Where revenue leaks
                </h3>
                <p className="text-[13px] text-white/45">
                  The friction between your systems and your people — quantified.
                </p>
              </div>
            </div>
          </Reveal>

          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {PROBLEMS.map((p, i) => (
              <Reveal key={p.code} delay={i * 0.05}>
                <motion.div
                  whileHover={{ y: -4 }}
                  transition={{ duration: 0.4 }}
                  className="group relative h-full overflow-hidden rounded-2xl border border-white/[0.06] bg-gradient-to-b from-white/[0.04] to-white/[0.01] p-5 backdrop-blur"
                >
                  <div className="flex items-start justify-between">
                    <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-white/40">
                      {p.code}
                    </span>
                    <span
                      className={cn(
                        "rounded-full border px-2 py-0.5 font-mono text-[9px] uppercase tracking-[0.16em]",
                        p.severity === "critical" &&
                          "border-rose-400/30 bg-rose-400/[0.06] text-rose-300",
                        p.severity === "high" &&
                          "border-amber-400/30 bg-amber-400/[0.06] text-amber-300",
                        p.severity === "medium" &&
                          "border-cyan-400/30 bg-cyan-400/[0.06] text-cyan-300"
                      )}
                    >
                      {p.severity}
                    </span>
                  </div>
                  <h4 className="mt-4 font-display text-lg font-medium tracking-tight text-white">
                    {p.title}
                  </h4>
                  <p className="mt-2 text-[13.5px] leading-relaxed text-white/55">{p.detail}</p>
                  <div className="mt-4 border-t border-white/[0.05] pt-3">
                    <div className="font-mono text-[10px] uppercase tracking-[0.16em] text-white/40">
                      Estimated impact
                    </div>
                    <div
                      className={cn(
                        "font-display text-xl font-medium tracking-tight",
                        p.severity === "critical"
                          ? "text-rose-300"
                          : p.severity === "high"
                          ? "text-amber-300"
                          : "text-cyan-300"
                      )}
                    >
                      {p.metric}
                    </div>
                  </div>
                </motion.div>
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
