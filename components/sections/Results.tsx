"use client";

import { motion } from "framer-motion";
import { GridBackground } from "@/components/ui/GridBackground";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { AnimatedNumber } from "@/components/ui/AnimatedNumber";
import { RESULTS } from "@/lib/data";
import { Reveal } from "@/components/ui/Reveal";

export function Results() {
  return (
    <section id="results" className="relative py-24 sm:py-32">
      <GridBackground />

      <div className="mx-auto max-w-7xl px-6">
        <SectionHeading
          eyebrow="Outcomes, not adjectives"
          title={
            <>
              Real measurable change.{" "}
              <span className="text-gradient-cyan">From the very first quarter.</span>
            </>
          }
          description="A composite of pilot deployments across multi-specialty clinics and provider groups in the first 90 days post-deploy."
        />

        <div className="mt-14 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {RESULTS.map((r, i) => (
            <Reveal key={r.label} delay={i * 0.05}>
              <motion.div
                whileHover={{ y: -3 }}
                transition={{ duration: 0.4 }}
                className="group relative overflow-hidden rounded-2xl border border-white/[0.06] bg-gradient-to-b from-white/[0.04] to-white/[0.01] p-6"
              >
                <div className="pointer-events-none absolute -right-16 -top-16 h-44 w-44 rounded-full bg-cyan-400/[0.06] blur-3xl" />
                <div className="font-mono text-[10px] uppercase tracking-[0.18em] text-white/45">
                  metric · {String(i + 1).padStart(2, "0")}
                </div>
                <div className="mt-3 font-display text-5xl font-medium leading-none tracking-tight text-white sm:text-6xl">
                  <AnimatedNumber
                    value={r.value}
                    prefix={"prefix" in r ? (r as { prefix: string }).prefix : undefined}
                    suffix={r.suffix}
                  />
                </div>
                <div className="mt-3 text-[15px] text-white/75">{r.label}</div>
                <div className="mt-1 text-xs text-white/45">{r.hint}</div>

                {/* tiny live bar */}
                <div className="mt-5 h-1 w-full overflow-hidden rounded-full bg-white/[0.06]">
                  <motion.div
                    initial={{ width: 0 }}
                    whileInView={{ width: "100%" }}
                    viewport={{ once: true }}
                    transition={{ duration: 1.4, delay: 0.2 + i * 0.07, ease: [0.22, 1, 0.36, 1] }}
                    className="h-full bg-gradient-to-r from-cyan-400 via-violet-400 to-emerald-400"
                  />
                </div>
              </motion.div>
            </Reveal>
          ))}
        </div>

        {/* benchmark strip */}
        <div className="mt-10 grid gap-3 rounded-2xl border border-white/[0.06] bg-white/[0.02] p-6 md:grid-cols-3">
          {[
            ["12 weeks", "average time-to-first-impact"],
            ["0", "rip-and-replace required"],
            ["24/7", "human-in-the-loop oversight"],
          ].map(([k, v]) => (
            <div key={k} className="flex items-baseline justify-center gap-3 text-center">
              <div className="font-display text-2xl font-medium text-white">{k}</div>
              <div className="text-sm text-white/55">{v}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
