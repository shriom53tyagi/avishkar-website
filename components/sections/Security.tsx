"use client";

import { Lock, ShieldCheck, FileCheck2, Users2, BadgeCheck } from "lucide-react";
import { Reveal } from "@/components/ui/Reveal";
import { cn } from "@/lib/utils";

const PILLARS = [
  { icon: Lock,        title: "PHI Minimization",         body: "Read-only by default. Only data elements needed for the audit are accessed.", badge: "Read-only" },
  { icon: ShieldCheck, title: "HIPAA-Aligned",             body: "BAA before any access. TLS 1.2+ in transit, AES-256 at rest.", badge: "BAA available" },
  { icon: FileCheck2,  title: "Full Audit Trail",          body: "Every agent action is logged and reviewable. Full chain of custody.", badge: "100% traceable" },
  { icon: Users2,      title: "Human-in-the-Loop",         body: "No workflow changes without human review. You stay in control.", badge: "Always supervised" },
] as const;

const COMPLIANCE = [
  { label: "HIPAA-aligned",             active: true },
  { label: "BAA available",             active: true },
  { label: "SOC 2 Type II in progress", active: false },
  { label: "Read-only by default",      active: true },
  { label: "TLS 1.2+ in transit",       active: true },
  { label: "AES-256 at rest",           active: true },
] as const;

export function Security() {
  return (
    <section id="security" className="bg-[#F0F9FF] py-20 sm:py-28">
      <div className="mx-auto max-w-7xl px-6">

        <Reveal>
          <div className="mb-12 max-w-xl">
            <span className="eyebrow">Trust &amp; Compliance</span>
            <h2 className="mt-4 text-[34px] font-bold leading-[1.1] tracking-[-1px] text-gradient sm:text-4xl">
              Healthcare-grade by default.
            </h2>
            <p className="mt-3 text-[15px] text-slate-500">
              Your data stays yours. Read-only during the audit. Humans in the loop always.
            </p>
          </div>
        </Reveal>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {PILLARS.map((p, i) => {
            const Icon = p.icon;
            return (
              <Reveal key={p.title} delay={i * 0.06}>
                <div className="card-elevated flex h-full flex-col rounded-2xl p-5 cursor-default">
                  <span className="mb-3 inline-flex h-10 w-10 items-center justify-center rounded-xl border border-[rgba(8,145,178,0.2)] bg-[#F0F9FF]">
                    <Icon className="h-4.5 w-4.5 text-[#0891B2]" />
                  </span>
                  <h3 className="text-[15px] font-semibold text-slate-900">{p.title}</h3>
                  <p className="mt-1.5 flex-1 text-[13px] leading-relaxed text-slate-500">{p.body}</p>
                  <div className="mt-3">
                    <span className="badge-cyan font-mono text-[10px]">
                      <BadgeCheck className="h-3 w-3" />
                      {p.badge}
                    </span>
                  </div>
                </div>
              </Reveal>
            );
          })}
        </div>

        <Reveal delay={0.2}>
          <div className="mt-6 flex flex-wrap items-center gap-2">
            {COMPLIANCE.map((c) => (
              <span
                key={c.label}
                className={cn(
                  "rounded-full border px-3 py-1 font-mono text-[10px] uppercase tracking-[0.12em]",
                  c.active
                    ? "border-[rgba(8,145,178,0.25)] bg-white text-[#0891B2]"
                    : "border-slate-200 bg-white text-slate-400"
                )}
              >
                {c.label}
              </span>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  );
}
