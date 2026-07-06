"use client";

import { CalendarClock, Receipt, ClipboardList, Repeat2, ShieldCheck } from "lucide-react";
import { Reveal } from "@/components/ui/Reveal";
import { DuotonePhoto } from "@/components/ui/DuotonePhoto";
import { cn } from "@/lib/utils";

const AGENTS = [
  { icon: CalendarClock, name: "Patient Access Agent",      tag: "Scheduling + Voice AI",   metric: "38% fewer no-shows", accent: "cyan" },
  { icon: Receipt,       name: "Revenue Recovery Agent",    tag: "Billing + Insurance",     metric: "−61% denial rate",   accent: "emerald" },
  { icon: ClipboardList, name: "Clinical Operations Agent", tag: "EMR + Documentation",     metric: "74% less admin work", accent: "emerald" },
  { icon: Repeat2,       name: "Patient Engagement Agent",  tag: "Follow-Up + Care Plans",  metric: "22% adherence lift", accent: "cyan" },
] as const;

const ACCENT = {
  cyan: {
    dot: "bg-[#0891B2]",
    icon: "border-[rgba(8,145,178,0.22)] bg-[#F0F9FF] text-[#0891B2]",
    pill: "text-[#0E7490]",
  },
  emerald: {
    dot: "bg-emerald-500",
    icon: "border-emerald-200 bg-emerald-50 text-emerald-600",
    pill: "text-emerald-700",
  },
} as const;

export function Agents() {
  return (
    <section id="agents" className="chapter-light py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-6">

        <Reveal>
          <div className="mb-12 max-w-2xl">
            <span className="eyebrow">Chapter 04 · The Agents</span>
            <h2 className="display-lg mt-5 text-slate-900">
              Four modules.{" "}
              <span className="text-gradient-cyan">Deployed only after the audit.</span>
            </h2>
            <p className="mt-4 max-w-lg text-[16px] leading-relaxed text-slate-500">
              Each agent is built for your EMR, your payer mix, your workflows — and turned on
              only where the diagnosis proved it pays.
            </p>
          </div>
        </Reveal>

        {/* Bento: feature photo card + agent cards */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {/* Feature photo tile */}
          <Reveal className="md:col-span-2 lg:col-span-1 lg:row-span-2">
            <div className="relative h-full min-h-[260px] overflow-hidden rounded-[18px] border border-[rgba(8,145,178,0.14)] shadow-[0_8px_32px_-8px_rgba(8,145,178,0.12)]">
              <DuotonePhoto
                src="https://images.unsplash.com/photo-1559757148-5c350d0d3c56?auto=format&fit=crop&w=900&q=80"
                alt="Clinician collaborating with AI-assisted care tools"
                rounded="rounded-[18px]"
                className="absolute inset-0 h-full w-full"
                sizes="(max-width: 1024px) 100vw, 33vw"
              />
              <div aria-hidden className="absolute inset-x-0 bottom-0 z-10 h-2/3 rounded-b-[18px] bg-gradient-to-t from-white/95 via-white/60 to-transparent" />
              <div className="absolute inset-x-0 bottom-0 z-20 p-6">
                <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-[#0891B2]">Live · supervised</p>
                <p className="mt-1.5 text-[18px] font-semibold leading-snug text-slate-900">
                  Agents that work the way your clinic already does.
                </p>
              </div>
            </div>
          </Reveal>

          {AGENTS.map((a, i) => {
            const s = ACCENT[a.accent];
            const Icon = a.icon;
            return (
              <Reveal key={a.name} delay={i * 0.06}>
                <div className="card-elevated flex h-full flex-col p-6 cursor-default">
                  <div className="flex items-center justify-between">
                    <span className={cn("flex h-10 w-10 items-center justify-center rounded-xl border", s.icon)}>
                      <Icon className="h-[18px] w-[18px]" />
                    </span>
                    <span className="flex items-center gap-1.5 font-mono text-[9px] uppercase tracking-[0.14em] text-slate-400">
                      <span className={cn("h-1.5 w-1.5 rounded-full", s.dot)} /> live
                    </span>
                  </div>
                  <h3 className="mt-4 text-[16px] font-semibold text-slate-900">{a.name}</h3>
                  <p className="mt-1 text-[12px] uppercase tracking-[0.1em] text-slate-400">{a.tag}</p>
                  <p className={cn("mt-auto pt-5 text-[15px] font-semibold", s.pill)}>{a.metric}</p>
                </div>
              </Reveal>
            );
          })}
        </div>

        <Reveal delay={0.2}>
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
