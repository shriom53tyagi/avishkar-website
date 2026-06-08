"use client";

import { X, Check } from "lucide-react";
import { GridBackground } from "@/components/ui/GridBackground";
import { Reveal } from "@/components/ui/Reveal";

const OTHERS = [
  "Deploy automation first, find use cases later",
  "Assume standard workflows apply to your environment",
  "Generic agents with difficult-to-attribute ROI",
  "12-month implementation with uncertain payback",
] as const;

const AVISHKAR = [
  "Structured audit quantifies leakage before anything is deployed",
  "Live Operational Model built from your actual system data",
  "Agents deployed only where the audit proves measurable ROI",
  "First measurable impact within 12 weeks",
] as const;

export function WhyDifferent() {
  return (
    <section id="approach" className="relative py-20 sm:py-24">
      <GridBackground />

      <div className="mx-auto max-w-4xl px-6">
        {/* Header */}
        <Reveal>
          <span className="font-mono text-[11px] uppercase tracking-[0.14em] text-blue-700">
            The Approach
          </span>
        </Reveal>

        <Reveal delay={0.05}>
          <h2 className="mt-3 max-w-2xl text-[32px] font-semibold leading-[1.15] tracking-[-0.5px] text-gradient sm:text-4xl">
            Diagnose first.{" "}
            <span className="block">Automate only where the numbers prove it.</span>
          </h2>
        </Reveal>

        <Reveal delay={0.08}>
          <p className="mt-4 max-w-2xl text-[15px] leading-relaxed text-slate-500">
            Most healthcare AI starts with a solution and searches for a problem. Avishkar starts
            with the problem — quantifies it in dollars — and only then proposes a fix.
          </p>
        </Reveal>

        {/* Comparison */}
        <div className="mt-10 grid gap-4 sm:grid-cols-2">
          {/* Others */}
          <Reveal>
            <div className="h-full rounded-2xl border border-rose-200 bg-rose-50/60 p-6">
              <div className="mb-5 font-mono text-[10px] uppercase tracking-[0.18em] text-rose-400">
                ✗ Others
              </div>
              <ul className="space-y-3">
                {OTHERS.map((p) => (
                  <li key={p} className="flex items-start gap-3 text-[14px] text-rose-800">
                    <span className="mt-0.5 inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-full border border-rose-200 bg-white">
                      <X className="h-3 w-3 text-rose-400" />
                    </span>
                    {p}
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>

          {/* Avishkar */}
          <Reveal delay={0.08}>
            <div className="h-full rounded-2xl border border-emerald-200 bg-emerald-50/60 p-6">
              <div className="mb-5 font-mono text-[10px] uppercase tracking-[0.18em] text-emerald-700">
                ✓ Avishkar
              </div>
              <ul className="space-y-3">
                {AVISHKAR.map((p) => (
                  <li key={p} className="flex items-start gap-3 text-[14px] text-emerald-800">
                    <span className="mt-0.5 inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-full border border-emerald-200 bg-white">
                      <Check className="h-3 w-3 text-emerald-700" />
                    </span>
                    {p}
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
