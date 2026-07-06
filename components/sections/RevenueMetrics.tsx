"use client";

import { motion } from "framer-motion";
import { CalendarX, FileX, PhoneOff, FileSignature } from "lucide-react";
import { Reveal } from "@/components/ui/Reveal";
import { DuotonePhoto } from "@/components/ui/DuotonePhoto";
import { cn } from "@/lib/utils";

const PROBLEMS = [
  { code: "OPS-001", icon: CalendarX,     title: "Missed appointments",         value: "$1.84M /yr", pct: 82, sev: "critical" },
  { code: "OPS-002", icon: FileX,         title: "Claim denials & undercoding", value: "$1.12M /yr", pct: 58, sev: "high" },
  { code: "OPS-003", icon: PhoneOff,      title: "Call center drop-off",        value: "$612K /yr",  pct: 34, sev: "high" },
  { code: "OPS-004", icon: FileSignature, title: "Documentation overhead",      value: "$388K /yr",  pct: 22, sev: "medium" },
] as const;

const SEV = {
  critical: { bar: "bg-rose-400",  badge: "bg-rose-50 text-rose-600 border-rose-200",   icon: "bg-rose-50 text-rose-500" },
  high:     { bar: "bg-amber-400", badge: "bg-amber-50 text-amber-700 border-amber-200", icon: "bg-amber-50 text-amber-500" },
  medium:   { bar: "bg-[#0891B2]", badge: "bg-cyan-50 text-[#0891B2] border-cyan-200",  icon: "bg-cyan-50 text-[#0891B2]" },
} as const;

export function RevenueMetrics() {
  return (
    <section id="diagnosis" className="chapter-light-alt py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-6">
        <div className="grid items-start gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:gap-16">

          {/* LEFT — narrative + photo */}
          <div className="lg:sticky lg:top-28">
            <Reveal>
              <span className="eyebrow">Chapter 01 · The Problem</span>
              <h2 className="display-lg mt-5 text-slate-900">
                Revenue leaks where{" "}
                <span className="text-gradient-cyan">no one is looking.</span>
              </h2>
              <p className="mt-4 max-w-md text-[16px] leading-[1.65] text-slate-500">
                Ranked by financial impact. Every number comes from your own systems —
                no benchmarks, no estimates.
              </p>
            </Reveal>

            <Reveal delay={0.1}>
              <DuotonePhoto
                src="https://images.unsplash.com/photo-1551601651-2a8555f1a136?auto=format&fit=crop&w=900&q=80"
                alt="Clinician reviewing operational and billing data"
                className="mt-8 h-[260px] w-full lg:h-[320px]"
              />
            </Reveal>
          </div>

          {/* RIGHT — leak cards */}
          <div className="grid gap-4">
            {PROBLEMS.map((p, i) => {
              const s = SEV[p.sev];
              const Icon = p.icon;
              return (
                <Reveal key={p.code} delay={i * 0.06}>
                  <div className="card-elevated flex items-start gap-4 rounded-2xl p-5">
                    <span className={cn("mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl", s.icon)}>
                      <Icon className="h-[18px] w-[18px]" />
                    </span>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between gap-2">
                        <h3 className="text-[15px] font-semibold text-slate-900">{p.title}</h3>
                        <span className={cn("shrink-0 rounded-full border px-2 py-0.5 font-mono text-[9px] uppercase tracking-[0.12em]", s.badge)}>
                          {p.sev}
                        </span>
                      </div>
                      <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-slate-100">
                        <motion.div
                          initial={{ width: 0 }}
                          whileInView={{ width: `${p.pct}%` }}
                          viewport={{ once: true, margin: "-10% 0px" }}
                          transition={{ duration: 0.85, delay: i * 0.07, ease: [0.22, 1, 0.36, 1] }}
                          className={cn("h-full rounded-full", s.bar)}
                        />
                      </div>
                      <p className="mt-2 font-mono text-[14px] font-semibold text-slate-700">{p.value}</p>
                    </div>
                  </div>
                </Reveal>
              );
            })}

            <Reveal delay={0.3}>
              <div className="mt-2 flex items-center justify-between rounded-2xl border border-[rgba(8,145,178,0.18)] bg-white px-5 py-4">
                <span className="text-[14px] font-medium text-slate-500">Total identified leakage</span>
                <span className="font-mono text-[20px] font-bold text-slate-900">$4.2M /yr</span>
              </div>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}
