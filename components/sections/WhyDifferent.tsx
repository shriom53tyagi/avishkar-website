"use client";

import { X, Check } from "lucide-react";
import { GridBackground } from "@/components/ui/GridBackground";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal } from "@/components/ui/Reveal";
import { WHY_DIFFERENT } from "@/lib/data";
import { cn } from "@/lib/utils";

export function WhyDifferent() {
  const { traditional, avishkar } = WHY_DIFFERENT;

  return (
    <section id="why" className="relative py-24 sm:py-32">
      <GridBackground />

      <div className="mx-auto max-w-7xl px-6">
        <SectionHeading
          eyebrow="Why Avishkar is different"
          title={
            <>
              Most healthcare AI starts with automation.{" "}
              <span className="text-gradient-cyan">Avishkar starts with diagnosis.</span>
            </>
          }
          description="Most vendors begin with a solution — a voice agent, a documentation assistant, a scheduling bot — then search for problems to solve. We build a live operational model of your organization first."
        />

        {/* Narrative */}
        <Reveal>
          <div className="mx-auto mt-12 max-w-3xl space-y-4 text-center text-[15px] leading-relaxed text-slate-500">
            <p>
              Before deploying a single agent, we map how patients, staff, systems, and workflows
              actually interact. We identify where value is being lost, quantify the financial
              impact, and prioritize opportunities by ROI.
            </p>
            <p className="text-slate-700">
              Only then do we deploy targeted AI agents.
            </p>
          </div>
        </Reveal>

        {/* Comparison */}
        <div className="mt-14 grid gap-4 md:grid-cols-2">
          {/* Traditional */}
          <Reveal>
            <div className="h-full rounded-2xl border border-slate-900/[0.08] bg-slate-50/60 p-7">
              <div className="mb-5 flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.18em] text-slate-400">
                {traditional.label}
              </div>
              <ul className="space-y-3.5">
                {traditional.points.map((p) => (
                  <li key={p} className="flex items-center gap-3 text-[15px] text-slate-500">
                    <span className="inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-full border border-slate-900/10 bg-white">
                      <X className="h-3 w-3 text-slate-400" />
                    </span>
                    {p}
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>

          {/* Avishkar */}
          <Reveal delay={0.1}>
            <div
              className={cn(
                "relative h-full overflow-hidden rounded-2xl p-7",
                "surface border-cyan-200"
              )}
            >
              <div className="pointer-events-none absolute -right-12 -top-12 h-40 w-40 rounded-full bg-gradient-to-br from-cyan-50 to-transparent blur-2xl" />
              <div className="mb-5 flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.18em] text-cyan-700">
                {avishkar.label}
              </div>
              <ul className="space-y-3.5">
                {avishkar.points.map((p) => (
                  <li key={p} className="flex items-center gap-3 text-[15px] text-slate-700">
                    <span className="inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-full border border-emerald-200 bg-emerald-50">
                      <Check className="h-3 w-3 text-emerald-700" />
                    </span>
                    {p}
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>
        </div>

        {/* Closing line */}
        <Reveal delay={0.15}>
          <p className="mx-auto mt-12 max-w-2xl text-center font-display text-xl font-medium tracking-tight text-gradient sm:text-2xl">
            Most companies sell AI. Avishkar identifies where AI creates value before deploying it.
          </p>
        </Reveal>
      </div>
    </section>
  );
}
