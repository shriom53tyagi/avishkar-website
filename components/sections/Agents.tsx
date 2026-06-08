"use client";

import {
  CalendarClock,
  Receipt,
  ClipboardList,
  Repeat2,
  ShieldCheck,
} from "lucide-react";
import type { ComponentType, SVGProps } from "react";
import { GridBackground } from "@/components/ui/GridBackground";
import { Reveal } from "@/components/ui/Reveal";
import { cn } from "@/lib/utils";

interface AgentCard {
  name: string;
  subtitle: string;
  body: string;
  metric: string;
  border: string;
  metricColor: string;
  footnote: string;
  icon: ComponentType<SVGProps<SVGSVGElement>>;
}

const AGENT_CARDS: AgentCard[] = [
  {
    name: "Patient Access Agent",
    subtitle: "Scheduling + Voice AI",
    body: "Automated multi-touch confirmation (SMS + Voice AI) with intelligent overbooking and same-day slot recovery. Answers the phone in your clinic's voice, 24/7. Routes to human staff when clinical judgment is needed.",
    metric: "38% fewer no-shows",
    border: "border-l-blue-600",
    metricColor: "bg-emerald-50 text-emerald-700 ring-emerald-200",
    footnote: "Deployed only after the audit quantifies no-show leakage.",
    icon: CalendarClock,
  },
  {
    name: "Revenue Recovery Agent",
    subtitle: "Billing + Insurance Verification",
    body: "Real-time 271/270 eligibility verification at scheduling. E/M code distribution analysis against specialty benchmarks. Predictive denial scoring per claim before submission. Automated appeal workflows sorted by total financial impact.",
    metric: "−61% denial rate",
    border: "border-l-emerald-600",
    metricColor: "bg-emerald-50 text-emerald-700 ring-emerald-200",
    footnote: "Deployed only after the audit quantifies denial and coding leakage.",
    icon: Receipt,
  },
  {
    name: "Clinical Operations Agent",
    subtitle: "EMR Automation + Documentation",
    body: "Ambient clinical documentation — NLP extraction from visit context, auto-populated into EMR-native note templates, reviewed by clinician before sign-off. Reads, writes, and reconciles EMR fields across systems.",
    metric: "74% less admin work",
    border: "border-l-emerald-600",
    metricColor: "bg-emerald-50 text-emerald-700 ring-emerald-200",
    footnote: "Deployed only after the audit quantifies documentation burden.",
    icon: ClipboardList,
  },
  {
    name: "Patient Engagement Agent",
    subtitle: "Follow-Up + Care Plans",
    body: "Pre-visit prep, post-visit care plans, and proactive follow-up across SMS, voice, and patient portal — intensity scaled automatically by patient risk stratification and engagement response patterns.",
    metric: "22% adherence lift",
    border: "border-l-blue-400",
    metricColor: "bg-emerald-50 text-emerald-700 ring-emerald-200",
    footnote: "Deployed only after the audit quantifies engagement gaps.",
    icon: Repeat2,
  },
] as const;

export function Agents() {
  return (
    <section id="agents" className="relative py-24 sm:py-32">
      <GridBackground variant="dots" />

      <div className="mx-auto max-w-7xl px-6">
        {/* Header */}
        <div className="max-w-2xl">
          <Reveal>
            <span className="font-mono text-[11px] uppercase tracking-[0.14em] text-blue-700">
              The Agents
            </span>
          </Reveal>
          <Reveal delay={0.05}>
            <h2 className="mt-3 text-[32px] font-semibold leading-[1.15] tracking-[-0.5px] text-gradient sm:text-4xl">
              Four modules. Deployed only where the audit proves ROI.
            </h2>
          </Reveal>
          <Reveal delay={0.08}>
            <p className="mt-4 text-[15px] leading-relaxed text-slate-500">
              Each agent is built for your specific environment — your EMR, your payer mix, your workflows.
            </p>
          </Reveal>
        </div>

        {/* 2×2 grid */}
        <div className="mt-12 grid gap-4 md:grid-cols-2">
          {AGENT_CARDS.map((a, i) => {
            const Icon = a.icon;
            return (
              <Reveal key={a.name} delay={i * 0.05}>
                <div
                  className={cn(
                    "surface flex h-full flex-col rounded-2xl border-l-2 p-6",
                    a.border
                  )}
                >
                  {/* Top: icon + subtitle */}
                  <div className="flex items-start gap-3">
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-slate-200 bg-slate-50">
                      <Icon className="h-4 w-4 text-slate-600" />
                    </div>
                    <div>
                      <div className="font-mono text-[10px] uppercase tracking-[0.16em] text-slate-400">
                        {a.subtitle}
                      </div>
                      <h3 className="mt-0.5 text-[17px] font-medium text-slate-900">{a.name}</h3>
                    </div>
                  </div>

                  {/* Body */}
                  <p className="mt-4 flex-1 text-[13.5px] leading-relaxed text-slate-500">{a.body}</p>

                  {/* Metric pill */}
                  <div className="mt-5">
                    <span
                      className={cn(
                        "inline-flex items-center rounded-full px-3 py-1 text-[12px] font-medium ring-1",
                        a.metricColor
                      )}
                    >
                      {a.metric}
                    </span>
                  </div>

                  {/* Footnote */}
                  <p className="mt-3 border-t border-slate-900/[0.06] pt-3 text-[11px] italic text-slate-400">
                    {a.footnote}
                  </p>
                </div>
              </Reveal>
            );
          })}
        </div>

        {/* Trust pill */}
        <Reveal delay={0.2}>
          <div className="mt-8 flex justify-center">
            <div className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white/80 px-5 py-2.5 backdrop-blur">
              <ShieldCheck className="h-3.5 w-3.5 text-emerald-600" />
              <span className="font-mono text-[11px] uppercase tracking-[0.14em] text-slate-500">
                HIPAA-aligned · Read-only by default · Human-in-the-loop
              </span>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
