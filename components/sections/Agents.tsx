"use client";

import { CalendarClock, Receipt, ClipboardList, Repeat2, ShieldCheck } from "lucide-react";
import { Reveal } from "@/components/ui/Reveal";
import { cn } from "@/lib/utils";

const AGENTS = [
  {
    icon: CalendarClock,
    name: "Patient Access Agent",
    tag: "Scheduling + Voice AI",
    metric: "38% fewer no-shows",
    accent: "cyan",
    span: "md:col-span-1",
  },
  {
    icon: Receipt,
    name: "Revenue Recovery Agent",
    tag: "Billing + Insurance",
    metric: "−61% denial rate",
    accent: "emerald",
    span: "md:col-span-1",
  },
  {
    icon: ClipboardList,
    name: "Clinical Operations Agent",
    tag: "EMR + Documentation",
    metric: "74% less admin work",
    accent: "emerald",
    span: "md:col-span-2",
  },
  {
    icon: Repeat2,
    name: "Patient Engagement Agent",
    tag: "Follow-Up + Care Plans",
    metric: "22% adherence lift",
    accent: "cyan",
    span: "md:col-span-1",
  },
] as const;

const ACCENT = {
  cyan:    { border: "border-l-[#0891B2]", icon: "bg-[#F0F9FF] text-[#0891B2]", metric: "bg-cyan-50 text-[#0E7490] ring-cyan-200" },
  emerald: { border: "border-l-emerald-500", icon: "bg-emerald-50 text-emerald-600", metric: "bg-emerald-50 text-emerald-700 ring-emerald-200" },
} as const;

export function Agents() {
  return (
    <section id="agents" className="bg-[#F0F9FF] py-20 sm:py-28">
      <div className="mx-auto max-w-7xl px-6">

        <Reveal>
          <div className="mb-12 max-w-xl">
            <span className="eyebrow">The Agents</span>
            <h2 className="mt-4 text-[34px] font-bold leading-[1.1] tracking-[-1px] text-gradient sm:text-4xl">
              Four modules. Deployed only after the audit.
            </h2>
            <p className="mt-3 text-[15px] text-slate-500">
              Each agent is built for your EMR, your payer mix, your workflows.
            </p>
          </div>
        </Reveal>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {AGENTS.map((a, i) => {
            const s = ACCENT[a.accent];
            const Icon = a.icon;
            return (
              <Reveal key={a.name} delay={i * 0.06}>
                <div className={cn(
                  "card-elevated flex h-full flex-col rounded-2xl border-l-[3px] p-5 cursor-default",
                  s.border, a.span
                )}>
                  <div className="flex items-center gap-3">
                    <span className={cn("flex h-9 w-9 shrink-0 items-center justify-center rounded-xl", s.icon)}>
                      <Icon className="h-4 w-4" />
                    </span>
                    <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-slate-400">{a.tag}</span>
                  </div>

                  <h3 className="mt-3 text-[16px] font-semibold text-slate-900">{a.name}</h3>

                  <div className="mt-4">
                    <span className={cn("inline-flex items-center rounded-full px-3 py-1 text-[12px] font-semibold ring-1", s.metric)}>
                      {a.metric}
                    </span>
                  </div>
                </div>
              </Reveal>
            );
          })}
        </div>

        <Reveal delay={0.22}>
          <div className="mt-8 flex justify-center">
            <div className="inline-flex items-center gap-2 rounded-full border border-[rgba(8,145,178,0.2)] bg-white px-5 py-2.5 shadow-sm">
              <ShieldCheck className="h-4 w-4 text-emerald-600" />
              <span className="font-mono text-[11px] uppercase tracking-[0.13em] text-slate-500">
                HIPAA-aligned · Read-only by default · Human-in-the-loop
              </span>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
