"use client";

import { Lock, ShieldCheck, FileCheck2, Users2, BadgeCheck } from "lucide-react";
import { Reveal } from "@/components/ui/Reveal";
import { COMPLIANCE_CHIPS, SECURITY_PILLARS } from "@/lib/data";
import { cn } from "@/lib/utils";

/** Resolves the icon keys stored in lib/data.ts to lucide components. */
const PILLAR_ICONS = {
  lock: Lock,
  shield: ShieldCheck,
  file: FileCheck2,
  users: Users2,
} as const;

export function Security() {
  return (
    <section id="security" className="chapter-light-alt py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-6">

        <Reveal>
          <div className="mb-12 max-w-xl">
            <span className="eyebrow">Chapter 06 · Trust &amp; Compliance</span>
            <h2 className="display-lg mt-5 text-slate-900">
              Healthcare-grade by default.
            </h2>
            <p className="mt-3 text-[15px] text-slate-500">
              Your data stays yours. Read-only during the audit. Humans in the loop always.
            </p>
          </div>
        </Reveal>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {SECURITY_PILLARS.map((p, i) => {
            const Icon = PILLAR_ICONS[p.icon as keyof typeof PILLAR_ICONS];
            return (
              <Reveal key={p.title} delay={i * 0.06}>
                <div className="card-elevated flex h-full flex-col rounded-2xl p-5 cursor-default">
                  <span className="mb-3 inline-flex h-10 w-10 items-center justify-center rounded-xl border border-[rgba(8,145,178,0.2)] bg-[#F0F9FF]">
                    <Icon className="h-4.5 w-4.5 text-[#0891B2]" />
                  </span>
                  <h3 className="text-[15px] font-semibold text-slate-900">{p.title}</h3>
                  <p className="mt-1.5 flex-1 text-[13px] leading-relaxed text-slate-500">{p.detail}</p>
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
            {COMPLIANCE_CHIPS.map((c) => (
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
