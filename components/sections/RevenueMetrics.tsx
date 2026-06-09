"use client";

import { motion } from "framer-motion";
import { CalendarX, FileX, PhoneOff, FileSignature } from "lucide-react";
import { Reveal } from "@/components/ui/Reveal";
import { cn } from "@/lib/utils";

const PROBLEMS = [
  { code: "OPS-001", icon: CalendarX,     title: "Missed appointments",         value: "$1.84M /yr", pct: 82, sev: "critical" },
  { code: "OPS-002", icon: FileX,         title: "Claim denials & undercoding",  value: "$1.12M /yr", pct: 58, sev: "high" },
  { code: "OPS-003", icon: PhoneOff,      title: "Call center drop-off",         value: "$612K /yr",  pct: 34, sev: "high" },
  { code: "OPS-004", icon: FileSignature, title: "Documentation overhead",       value: "$388K /yr",  pct: 22, sev: "medium" },
] as const;

const SEV = {
  critical: { bar: "bg-rose-400",  badge: "bg-rose-50 text-rose-600 border-rose-200",   icon: "bg-rose-50 text-rose-500" },
  high:     { bar: "bg-amber-400", badge: "bg-amber-50 text-amber-700 border-amber-200", icon: "bg-amber-50 text-amber-500" },
  medium:   { bar: "bg-[#0891B2]", badge: "bg-cyan-50 text-[#0891B2] border-cyan-200",  icon: "bg-cyan-50 text-[#0891B2]" },
} as const;

export function RevenueMetrics() {
  return (
    <section id="diagnosis" className="bg-white py-20 sm:py-28">
      <div className="mx-auto max-w-7xl px-6">
        <Reveal>
          <div className="mb-10 max-w-xl">
            <span className="eyebrow">The Diagnosis</span>
            <h2 className="mt-4 text-[34px] font-bold leading-[1.1] tracking-[-1px] text-gradient sm:text-4xl">
              Where revenue leaks — quantified
            </h2>
            <p className="mt-3 text-[15px] text-slate-500">
              Ranked by financial impact. Your numbers come from your own systems.
            </p>
          </div>
        </Reveal>

        <div className="grid gap-4 sm:grid-cols-2">
          {PROBLEMS.map((p, i) => {
            const s = SEV[p.sev];
            const Icon = p.icon;
            return (
              <Reveal key={p.code} delay={i * 0.06}>
                <div className="card-elevated flex items-start gap-4 rounded-2xl p-5">
                  <span className={cn("mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl", s.icon)}>
                    <Icon className="h-4.5 w-4.5" />
                  </span>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <h3 className="text-[14px] font-semibold text-slate-900">{p.title}</h3>
                      <span className={cn("shrink-0 rounded-full border px-2 py-0.5 font-mono text-[9px] uppercase tracking-[0.12em]", s.badge)}>
                        {p.sev}
                      </span>
                    </div>
                    <div className="mt-2.5 h-1.5 overflow-hidden rounded-full bg-slate-100">
                      <motion.div
                        initial={{ width: 0 }}
                        whileInView={{ width: `${p.pct}%` }}
                        viewport={{ once: true, margin: "-10% 0px" }}
                        transition={{ duration: 0.85, delay: i * 0.07, ease: [0.22, 1, 0.36, 1] }}
                        className={cn("h-full rounded-full", s.bar)}
                      />
                    </div>
                    <p className="mt-1.5 font-mono text-[13px] font-semibold text-slate-700">{p.value}</p>
                  </div>
                </div>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
