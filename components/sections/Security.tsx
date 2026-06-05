"use client";

import { ShieldCheck, Lock, FileCheck2, Users2 } from "lucide-react";
import { GridBackground } from "@/components/ui/GridBackground";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal } from "@/components/ui/Reveal";
import { SECURITY_PILLARS } from "@/lib/data";

const SECURITY_ICONS = {
  lock: Lock,
  shield: ShieldCheck,
  file: FileCheck2,
  users: Users2,
} as const;

export function Security() {
  return (
    <section id="security" className="relative scroll-mt-28 py-24 sm:py-32">
      <GridBackground variant="dots" />

      <div className="mx-auto max-w-7xl px-6">
        <SectionHeading
          eyebrow="Security & compliance"
          title={
            <>
              Healthcare-grade by default.{" "}
              <span className="text-gradient-cyan">Your data stays yours.</span>
            </>
          }
          description="We connect read-only during the audit, minimize the data we touch, and keep clinicians and staff in control of every deployed workflow."
        />

        <div className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {SECURITY_PILLARS.map((p, i) => {
            const Icon = SECURITY_ICONS[p.icon];
            return (
              <Reveal key={p.title} delay={i * 0.05}>
                <div className="surface h-full rounded-2xl p-5">
                  <span className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-cyan-200 bg-cyan-50">
                    <Icon className="h-4 w-4 text-cyan-700" />
                  </span>
                  <div className="mt-4 text-sm font-medium text-slate-900">{p.title}</div>
                  <p className="mt-1.5 text-[13px] leading-relaxed text-slate-500">{p.detail}</p>
                </div>
              </Reveal>
            );
          })}
        </div>

        <Reveal delay={0.2}>
          <div className="mt-10 flex flex-wrap items-center justify-center gap-x-5 gap-y-2 font-mono text-[11px] uppercase tracking-[0.16em] text-slate-400">
            <span>HIPAA-aligned</span>
            <span className="h-1 w-1 rounded-full bg-slate-300" />
            <span>BAA available</span>
            <span className="h-1 w-1 rounded-full bg-slate-300" />
            <span>Read-only by default</span>
            <span className="h-1 w-1 rounded-full bg-slate-300" />
            <span>SOC 2 in progress</span>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
