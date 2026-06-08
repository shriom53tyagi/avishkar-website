"use client";

import { ShieldCheck, Lock, FileCheck2, Users2 } from "lucide-react";
import { GridBackground } from "@/components/ui/GridBackground";
import { Reveal } from "@/components/ui/Reveal";
import { SECURITY_PILLARS } from "@/lib/data";

const SECURITY_ICONS = {
  lock: Lock,
  shield: ShieldCheck,
  file: FileCheck2,
  users: Users2,
} as const;

const COMPLIANCE_PILLS = [
  { label: "HIPAA-aligned", active: true },
  { label: "BAA available", active: true },
  { label: "SOC 2 Type II in progress", active: false },
  { label: "Read-only by default", active: true },
  { label: "Encrypted in transit (TLS 1.2+)", active: true },
  { label: "Encrypted at rest (AES-256)", active: true },
  { label: "SSO integration available", active: true },
] as const;

export function Security() {
  return (
    <section id="security" className="relative scroll-mt-28 py-24 sm:py-32">
      <GridBackground variant="dots" />

      <div className="mx-auto max-w-7xl px-6">
        {/* Header */}
        <Reveal>
          <span className="font-mono text-[11px] uppercase tracking-[0.14em] text-blue-700">
            Trust &amp; Compliance
          </span>
        </Reveal>
        <Reveal delay={0.05}>
          <h2 className="mt-3 max-w-3xl text-[32px] font-semibold leading-[1.15] tracking-[-0.5px] text-gradient sm:text-4xl">
            Healthcare-grade by default. Read-only during the audit. Your data stays yours.
          </h2>
        </Reveal>

        {/* Pillars — dense 4-column grid */}
        <div className="mt-10 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {SECURITY_PILLARS.map((p, i) => {
            const Icon = SECURITY_ICONS[p.icon];
            return (
              <Reveal key={p.title} delay={i * 0.04}>
                <div className="surface h-full rounded-2xl p-5">
                  <span className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-cyan-200 bg-cyan-50">
                    <Icon className="h-4 w-4 text-cyan-700" />
                  </span>
                  <div className="mt-3 text-[14px] font-medium text-slate-900">{p.title}</div>
                  <p className="mt-1.5 text-[12.5px] leading-relaxed text-slate-500">{p.detail}</p>
                </div>
              </Reveal>
            );
          })}
        </div>

        {/* Compliance pills row */}
        <Reveal delay={0.18}>
          <div className="mt-8 flex flex-wrap items-center gap-2">
            {COMPLIANCE_PILLS.map((pill) => (
              <span
                key={pill.label}
                className={
                  pill.active
                    ? "rounded-full border border-cyan-200 bg-cyan-50 px-3 py-1 font-mono text-[10px] uppercase tracking-[0.14em] text-cyan-700"
                    : "rounded-full border border-slate-200 bg-slate-50 px-3 py-1 font-mono text-[10px] uppercase tracking-[0.14em] text-slate-400"
                }
              >
                {pill.label}
              </span>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  );
}
