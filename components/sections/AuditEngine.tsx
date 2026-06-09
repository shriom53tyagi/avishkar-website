"use client";

import { motion } from "framer-motion";
import { Reveal } from "@/components/ui/Reveal";
import { AUDIT_STEPS } from "@/lib/data";
import { cn } from "@/lib/utils";

export function AuditEngine() {
  return (
    <section id="audit" className="bg-white py-20 sm:py-28">
      <div className="mx-auto max-w-7xl px-6">

        <Reveal>
          <div className="mb-12 max-w-xl">
            <span className="eyebrow">The Process</span>
            <h2 className="mt-4 text-[34px] font-bold leading-[1.1] tracking-[-1px] text-gradient sm:text-4xl">
              4-Stage Recovery Lifecycle
            </h2>
            <p className="mt-3 text-[15px] text-slate-500">
              Fixed scope. Read-only. No automation until the audit proves it.
            </p>
          </div>
        </Reveal>

        <div className="grid gap-10 lg:grid-cols-[1fr_380px]">

          {/* Timeline */}
          <div className="relative">
            <div className="absolute left-[19px] top-5 h-[calc(100%-2rem)] w-px bg-gradient-to-b from-[#0891B2]/40 to-emerald-400/60" />
            <ol className="space-y-4">
              {AUDIT_STEPS.map((step, i) => {
                const last = i === AUDIT_STEPS.length - 1;
                return (
                  <motion.li
                    key={step.id}
                    initial={{ opacity: 0, x: -10 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true, margin: "-5% 0px" }}
                    transition={{ duration: 0.45, delay: i * 0.08, ease: [0.22, 1, 0.36, 1] }}
                    className="relative pl-12"
                  >
                    <span className={cn(
                      "absolute left-0 top-3 flex h-9 w-9 items-center justify-center rounded-full border font-mono text-[11px] font-bold",
                      last
                        ? "border-emerald-300 bg-emerald-50 text-emerald-700"
                        : "border-[rgba(8,145,178,0.3)] bg-[#F0F9FF] text-[#0891B2]"
                    )}>
                      {step.id}
                    </span>

                    <div className={cn(
                      "rounded-2xl border p-4",
                      last ? "border-emerald-200/60 bg-emerald-50/40" : "border-[rgba(8,145,178,0.10)] bg-[#F8FAFE]"
                    )}>
                      <div className="flex items-center gap-2">
                        <span className={cn("font-mono text-[10px] uppercase tracking-[0.14em]", last ? "text-emerald-600" : "text-[#0891B2]")}>
                          {step.heading}
                        </span>
                        <span className={cn(
                          "ml-auto rounded-full border px-2 py-0.5 font-mono text-[9px] uppercase tracking-[0.11em]",
                          last ? "border-emerald-200 bg-emerald-50 text-emerald-700" : "border-[rgba(8,145,178,0.2)] bg-[#F0F9FF] text-[#0891B2]"
                        )}>
                          {step.tag}
                        </span>
                      </div>
                      <h3 className="mt-1.5 text-[15px] font-semibold text-slate-900">{step.label}</h3>
                    </div>
                  </motion.li>
                );
              })}
            </ol>
          </div>

          {/* Right panel */}
          <div className="flex flex-col gap-4 lg:sticky lg:top-28 lg:self-start">
            {/* Testimonial */}
            <Reveal delay={0.1}>
              <div className="rounded-2xl border border-[rgba(8,145,178,0.15)] bg-[#F0F9FF] p-5">
                <blockquote className="text-[14px] italic leading-relaxed text-slate-700">
                  "We identified $1.1M in leakage in 3 weeks and recovered $800K in Q1."
                </blockquote>
                <p className="mt-3 text-[12px] font-semibold text-slate-500">— CFO, 180-bed regional hospital</p>
              </div>
            </Reveal>

            {/* KPIs */}
            <Reveal delay={0.14}>
              <div className="card rounded-2xl p-5">
                <p className="mb-4 font-mono text-[9px] uppercase tracking-[0.14em] text-slate-400">Post-deployment</p>
                <div className="grid grid-cols-3 divide-x divide-slate-100 text-center">
                  {[["74%","Admin ↓"],["38%","Confirms ↑"],["−61%","Denials"]].map(([v,l]) => (
                    <div key={l} className="px-3">
                      <div className="text-[20px] font-bold text-emerald-600">{v}</div>
                      <div className="mt-0.5 text-[10px] text-slate-400">{l}</div>
                    </div>
                  ))}
                </div>
              </div>
            </Reveal>

            {/* Integrations */}
            <Reveal delay={0.17}>
              <div className="card rounded-2xl p-4">
                <p className="mb-2.5 font-mono text-[9px] uppercase tracking-[0.14em] text-slate-400">Integrates with</p>
                <div className="flex flex-wrap gap-1.5">
                  {["Epic","Cerner","Athena","eCW","Meditech","Waystar","RingCentral"].map((s) => (
                    <span key={s} className="badge-cyan font-mono text-[10px]">{s}</span>
                  ))}
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}
