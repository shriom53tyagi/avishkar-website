"use client";

import { motion } from "framer-motion";
import { GridBackground } from "@/components/ui/GridBackground";
import { Reveal } from "@/components/ui/Reveal";
import { AUDIT_STEPS } from "@/lib/data";
import { cn } from "@/lib/utils";

const INTEGRATIONS = [
  "Epic",
  "Cerner",
  "Athena",
  "eCW",
  "Meditech",
  "Waystar",
  "RingCentral",
] as const;

export function AuditEngine() {
  return (
    <section id="audit" className="relative py-24 sm:py-32">
      <GridBackground />

      <div className="mx-auto max-w-7xl px-6">
        {/* Header */}
        <div className="max-w-2xl">
          <Reveal>
            <span className="font-mono text-[11px] uppercase tracking-[0.14em] text-blue-700">
              The Process
            </span>
          </Reveal>
          <Reveal delay={0.05}>
            <h2 className="mt-3 text-[32px] font-semibold leading-[1.15] tracking-[-0.5px] text-gradient sm:text-4xl">
              The 4-Stage Operational Recovery Lifecycle
            </h2>
          </Reveal>
          <Reveal delay={0.08}>
            <p className="mt-4 text-[15px] leading-relaxed text-slate-500">
              The audit comes first. Always. Fixed scope. Read-only access. No automation proposed
              until the diagnosis is complete and the numbers justify it.
            </p>
          </Reveal>
        </div>

        {/* 2-column layout */}
        <div className="mt-14 grid gap-10 lg:grid-cols-[1.2fr_1fr]">
          {/* LEFT — vertical timeline */}
          <div className="relative">
            {/* Connecting line */}
            <div className="absolute left-[19px] top-6 h-[calc(100%-3rem)] w-px bg-gradient-to-b from-blue-400/60 via-blue-300/30 to-emerald-400/60" />

            <ol className="space-y-5">
              {AUDIT_STEPS.map((step, i) => {
                const isLast = i === AUDIT_STEPS.length - 1;
                return (
                  <motion.li
                    key={step.id}
                    initial={{ opacity: 0, x: -10 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true, margin: "-5% 0px" }}
                    transition={{ duration: 0.5, delay: i * 0.07 }}
                    className="relative pl-12"
                  >
                    {/* Step circle */}
                    <span
                      className={cn(
                        "absolute left-0 top-1 flex h-9 w-9 items-center justify-center rounded-full border text-[11px] font-mono font-medium",
                        isLast
                          ? "border-emerald-300 bg-emerald-50 text-emerald-700"
                          : "border-blue-200 bg-blue-50 text-blue-700"
                      )}
                    >
                      {step.id}
                    </span>

                    <div
                      className={cn(
                        "rounded-2xl border p-5 transition-colors",
                        isLast
                          ? "border-emerald-200 bg-emerald-50/40"
                          : "border-slate-900/[0.08] bg-slate-50/50"
                      )}
                    >
                      {/* Heading mono tag + title */}
                      <div className="flex items-center gap-2.5">
                        <span
                          className={cn(
                            "font-mono text-[10px] uppercase tracking-[0.16em]",
                            isLast ? "text-emerald-700" : "text-blue-700"
                          )}
                        >
                          {step.heading}
                        </span>
                        <span className="h-px flex-1 bg-slate-900/[0.06]" />
                      </div>
                      <h3 className="mt-1.5 text-[16px] font-medium text-slate-900">{step.label}</h3>
                      <p className="mt-2 text-[13.5px] leading-relaxed text-slate-500">{step.detail}</p>

                      {/* Tag */}
                      <div className="mt-3">
                        <span
                          className={cn(
                            "inline-block rounded-full border px-2.5 py-0.5 font-mono text-[9px] uppercase tracking-[0.14em]",
                            isLast
                              ? "border-emerald-200 bg-emerald-50 text-emerald-700"
                              : "border-blue-200 bg-blue-50 text-blue-700"
                          )}
                        >
                          {step.tag}
                        </span>
                      </div>
                    </div>
                  </motion.li>
                );
              })}
            </ol>
          </div>

          {/* RIGHT — sticky supporting content */}
          <div className="flex flex-col gap-5 lg:sticky lg:top-24 lg:self-start">
            {/* Testimonial */}
            <Reveal delay={0.1}>
              <div className="rounded-2xl border-l-2 border-l-blue-300 bg-blue-50/60 p-5">
                <blockquote className="text-[14px] italic leading-relaxed text-slate-700">
                  "We identified $1.1M in leakage in 3 weeks and recovered $800K within the first quarter."
                </blockquote>
                <p className="mt-3 text-[12px] font-medium text-slate-500 not-italic">
                  — CFO, 180-bed regional hospital
                </p>
              </div>
            </Reveal>

            {/* Outcome metrics */}
            <Reveal delay={0.12}>
              <div className="surface rounded-2xl p-5">
                <div className="mb-3 font-mono text-[10px] uppercase tracking-[0.16em] text-slate-400">
                  Outcome metrics
                </div>
                <div className="grid grid-cols-3 gap-3 text-center">
                  {[
                    { value: "74%", label: "Admin reduce" },
                    { value: "38%", label: "More confirms" },
                    { value: "−61%", label: "Denial rate" },
                  ].map((m) => (
                    <div key={m.label}>
                      <div className="text-[22px] font-semibold tracking-tight text-emerald-700">
                        {m.value}
                      </div>
                      <div className="mt-0.5 text-[11px] text-slate-400">{m.label}</div>
                    </div>
                  ))}
                </div>
              </div>
            </Reveal>

            {/* Integration compatibility */}
            <Reveal delay={0.14}>
              <div className="surface rounded-2xl p-5">
                <div className="mb-3 font-mono text-[10px] uppercase tracking-[0.16em] text-slate-400">
                  Compatible with your stack
                </div>
                <div className="flex flex-wrap gap-2">
                  {INTEGRATIONS.map((s) => (
                    <span
                      key={s}
                      className="rounded-full border border-blue-200 bg-blue-50 px-2.5 py-1 font-mono text-[10px] text-blue-700"
                    >
                      {s}
                    </span>
                  ))}
                </div>
              </div>
            </Reveal>

            {/* Fixed scope pill */}
            <Reveal delay={0.16}>
              <div className="flex items-center justify-center gap-2 rounded-xl border border-slate-900/[0.08] bg-slate-50/70 py-3 px-4">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                <span className="font-mono text-[11px] uppercase tracking-[0.14em] text-slate-500">
                  Fixed scope · Read-only · BAA
                </span>
              </div>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}
