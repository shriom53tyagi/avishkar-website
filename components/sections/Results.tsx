"use client";

import { GridBackground } from "@/components/ui/GridBackground";
import { AnimatedNumber } from "@/components/ui/AnimatedNumber";
import { Reveal } from "@/components/ui/Reveal";

const TOP_KPIS = [
  { value: 74, suffix: "%", label: "Reduction in administrative workload", timeframe: "First 90 days post-deploy", color: "text-emerald-700" },
  { value: 38, suffix: "%", label: "Increase in appointment confirmations", timeframe: "First 60 days post-deploy", color: "text-emerald-700" },
  { value: 61, prefix: "−", suffix: "%", label: "Denial rate reduction", timeframe: "First 120 days post-deploy", color: "text-emerald-700" },
] as const;

const BOTTOM_STATS = [
  { value: 9.4, prefix: "", suffix: "%", label: "Additional revenue capture", note: "Eligibility + denial triage" },
  { value: 4.2, prefix: "$", suffix: "M+", label: "Avg annual recovery identified", note: "2025 audit cohort" },
  { value: 12, prefix: "", suffix: " wks", label: "Time to first measurable impact", note: "Median across engagements" },
] as const;

export function Results() {
  return (
    <section id="results" className="relative bg-slate-50/60 py-24 sm:py-32">
      <GridBackground />

      <div className="mx-auto max-w-7xl px-6">
        {/* Header */}
        <Reveal>
          <span className="font-mono text-[11px] uppercase tracking-[0.14em] text-blue-700">
            Outcomes — From the Audit-First Model
          </span>
        </Reveal>
        <Reveal delay={0.05}>
          <h2 className="mt-3 max-w-2xl text-[32px] font-semibold leading-[1.15] tracking-[-0.5px] text-gradient sm:text-4xl">
            The audit found it. The agents recovered it.
          </h2>
        </Reveal>
        <Reveal delay={0.08}>
          <p className="mt-4 max-w-2xl text-[15px] leading-relaxed text-slate-500">
            Every number below is a measured result from a real deployment that started with
            diagnosis — not a projection from a demo.
          </p>
        </Reveal>

        {/* Top 3 large KPI cards */}
        <div className="mt-12 grid gap-4 sm:grid-cols-3">
          {TOP_KPIS.map((r, i) => (
            <Reveal key={r.label} delay={i * 0.06}>
              <div className="surface rounded-2xl p-6">
                <div className="text-[48px] font-semibold leading-none tracking-[-0.5px]">
                  <AnimatedNumber
                    value={r.value}
                    prefix={"prefix" in r ? r.prefix : undefined}
                    suffix={r.suffix}
                    className={r.color}
                  />
                </div>
                <div className="mt-3 text-[15px] text-slate-700">{r.label}</div>
                <div className="mt-1 text-[11px] text-slate-400">{r.timeframe}</div>
              </div>
            </Reveal>
          ))}
        </div>

        {/* Bottom 3 smaller stats */}
        <Reveal delay={0.15}>
          <div className="mt-4 grid gap-4 sm:grid-cols-3">
            {BOTTOM_STATS.map((s) => (
              <div
                key={s.label}
                className="rounded-xl border border-slate-900/[0.07] bg-white/80 p-4"
              >
                <div className="text-[28px] font-medium tracking-[-0.5px] text-blue-700">
                  <AnimatedNumber
                    value={s.value}
                    prefix={s.prefix || undefined}
                    suffix={s.suffix}
                  />
                </div>
                <div className="mt-1 text-[13px] text-slate-600">{s.label}</div>
                <div className="mt-0.5 text-[11px] text-slate-400">{s.note}</div>
              </div>
            ))}
          </div>
        </Reveal>

        {/* Testimonial */}
        <Reveal delay={0.2}>
          <div className="mt-8 max-w-3xl rounded-2xl border-l-2 border-l-emerald-400 bg-emerald-50/60 p-6">
            <blockquote className="text-[16px] italic leading-relaxed text-slate-700">
              "We identified $1.1M in leakage in 3 weeks and recovered $800K within the first quarter."
            </blockquote>
            <p className="mt-3 text-[13px] font-medium text-slate-500 not-italic">
              — CFO, 180-bed regional hospital (anonymized)
            </p>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
