"use client";

import { Reveal } from "@/components/ui/Reveal";
import { AnimatedNumber } from "@/components/ui/AnimatedNumber";
import { DuotonePhoto } from "@/components/ui/DuotonePhoto";
import { motion } from "framer-motion";

const TOP_KPIS = [
  { value: 74,  prefix: "",  suffix: "%",    label: "Admin workload reduction",   time: "First 90 days" },
  { value: 38,  prefix: "",  suffix: "%",    label: "Appointment confirm rate up", time: "First 60 days" },
  { value: 61,  prefix: "−", suffix: "%",    label: "Denial rate reduction",      time: "First 120 days" },
] as const;

const BOTTOM_STATS = [
  { value: 9.4, prefix: "",  suffix: "%",    label: "Additional revenue capture",  note: "Eligibility + denial triage" },
  { value: 4.2, prefix: "$", suffix: "M+",   label: "Avg annual recovery found",   note: "2025 audit cohort" },
  { value: 12,  prefix: "",  suffix: " wks", label: "Time to first impact",        note: "Median across engagements" },
] as const;

export function Results() {
  return (
    <section id="results" className="chapter-light py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-6">

        <Reveal>
          <div className="mb-12 max-w-xl">
            <span className="eyebrow">Chapter 05 · The Proof</span>
            <h2 className="display-lg mt-5 text-slate-900">
              The audit found it.{" "}
              <span className="text-gradient-cyan">The agents recovered it.</span>
            </h2>
          </div>
        </Reveal>

        <div className="grid gap-4 sm:grid-cols-3">
          {TOP_KPIS.map((r, i) => (
            <Reveal key={r.label} delay={i * 0.07}>
              <div className="card-elevated rounded-2xl p-6 cursor-default">
                <div className="mb-3 flex items-center gap-2">
                  <span className="relative flex h-2 w-2">
                    <span className="absolute inset-0 rounded-full bg-emerald-500" />
                    <span className="absolute inset-0 animate-ping-slow rounded-full bg-emerald-400" />
                  </span>
                  <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-slate-400">Measured</span>
                </div>

                <div className="text-[48px] font-bold leading-none tracking-[-2px] text-emerald-600">
                  <AnimatedNumber value={r.value} prefix={r.prefix || undefined} suffix={r.suffix} />
                </div>
                <p className="mt-2 text-[14px] font-medium text-slate-800">{r.label}</p>
                <p className="mt-0.5 text-[11px] text-slate-400">{r.time} post-deploy</p>

                <div className="mt-4 h-1.5 overflow-hidden rounded-full bg-slate-100">
                  <motion.div
                    initial={{ width: 0 }}
                    whileInView={{ width: "100%" }}
                    viewport={{ once: true }}
                    transition={{ duration: 1.2, delay: 0.2 + i * 0.1, ease: [0.22, 1, 0.36, 1] }}
                    className="h-full rounded-full bg-gradient-to-r from-[#0891B2] to-emerald-500"
                  />
                </div>
              </div>
            </Reveal>
          ))}
        </div>

        <Reveal delay={0.18}>
          <div className="mt-4 grid gap-4 sm:grid-cols-3">
            {BOTTOM_STATS.map((s) => (
              <div key={s.label} className="flex items-start gap-4 rounded-2xl border border-[rgba(8,145,178,0.10)] bg-[#F8FAFE] p-5">
                <div className="h-8 w-1 shrink-0 rounded-full bg-gradient-to-b from-[#0891B2] to-emerald-500" />
                <div>
                  <div className="text-[26px] font-bold leading-none tracking-tight text-[#0891B2]">
                    <AnimatedNumber value={s.value} prefix={s.prefix || undefined} suffix={s.suffix} />
                  </div>
                  <p className="mt-1 text-[13px] font-medium text-slate-700">{s.label}</p>
                  <p className="mt-0.5 text-[11px] text-slate-400">{s.note}</p>
                </div>
              </div>
            ))}
          </div>
        </Reveal>

        <Reveal delay={0.22}>
          <div className="mt-4 overflow-hidden rounded-2xl border border-emerald-200/60 bg-gradient-to-r from-emerald-50 to-white p-6 md:p-8">
            <div className="flex flex-col gap-6 md:flex-row md:items-center md:gap-8">
              <DuotonePhoto
                src="https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&w=400&q=80"
                alt="Healthcare finance executive"
                className="h-20 w-20 shrink-0"
                rounded="rounded-2xl"
                sizes="80px"
              />
              <p className="flex-1 text-[17px] italic leading-relaxed text-slate-700">
                "We identified $1.1M in leakage in 3 weeks and recovered $800K within Q1.
                The diagnosis paid for itself before a single agent went live."
              </p>
              <div className="shrink-0 rounded-2xl border border-emerald-200/60 bg-white p-4 text-center shadow-sm">
                <div className="text-[28px] font-bold text-emerald-600">$800K</div>
                <div className="mt-0.5 text-[11px] font-medium text-emerald-700">Recovered Q1</div>
                <div className="mt-0.5 text-[10px] text-slate-400">CFO, 180-bed hospital</div>
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
