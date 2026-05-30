"use client";

import { motion } from "framer-motion";
import { GridBackground } from "@/components/ui/GridBackground";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { PROCESS } from "@/lib/data";

export function Process() {
  return (
    <section id="process" className="relative py-24 sm:py-32">
      <GridBackground variant="dots" />

      <div className="mx-auto max-w-7xl px-6">
        <SectionHeading
          eyebrow="The process"
          title={
            <>
              From audit to{" "}
              <span className="text-gradient-cyan">running infrastructure</span> in weeks, not years.
            </>
          }
          description="A premium, predictable engagement designed for healthcare leaders who need speed, safety and accountability."
        />

        <div className="mt-16">
          {/* desktop horizontal */}
          <div className="relative hidden md:block">
            <motion.div
              initial={{ scaleX: 0 }}
              whileInView={{ scaleX: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 1.6, ease: [0.22, 1, 0.36, 1] }}
              style={{ transformOrigin: "0% 50%" }}
              className="absolute left-0 right-0 top-9 h-px bg-gradient-to-r from-cyan-400/60 via-violet-400/60 to-emerald-400/60"
            />
            <div className="grid grid-cols-4 gap-8">
              {PROCESS.map((p, i) => (
                <motion.div
                  key={p.n}
                  initial={{ opacity: 0, y: 14 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: 0.15 + i * 0.12 }}
                  className="relative"
                >
                  <div className="relative mx-auto flex h-[72px] w-[72px] items-center justify-center">
                    <div className="absolute inset-0 rounded-full border border-white/10" />
                    <div className="absolute inset-1 rounded-full border border-white/[0.06]" />
                    <div className="absolute inset-2 rounded-full border border-cyan-400/30 bg-ink-900 shadow-[0_0_30px_-6px_rgba(34,211,238,0.6)]" />
                    <span className="relative font-mono text-[12px] tracking-[0.2em] text-cyan-200">
                      {p.n}
                    </span>
                    {i < PROCESS.length - 1 && (
                      <span className="absolute -right-1 top-1/2 h-2 w-2 -translate-y-1/2 rotate-45 border-r border-t border-cyan-400/40" />
                    )}
                  </div>
                  <div className="mt-6 text-center">
                    <div className="font-display text-[18px] font-medium tracking-tight text-white">
                      {p.title}
                    </div>
                    <div className="mt-1 font-mono text-[10px] uppercase tracking-[0.18em] text-cyan-300/80">
                      {p.duration}
                    </div>
                    <p className="mx-auto mt-3 max-w-[260px] text-sm leading-relaxed text-white/55">
                      {p.body}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* mobile vertical */}
          <div className="relative md:hidden">
            <div className="absolute left-[27px] top-0 h-full w-px bg-gradient-to-b from-cyan-400/40 via-violet-400/40 to-emerald-400/40" />
            <div className="space-y-6">
              {PROCESS.map((p, i) => (
                <motion.div
                  key={p.n}
                  initial={{ opacity: 0, x: -8 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: i * 0.1 }}
                  className="relative pl-16"
                >
                  <div className="absolute left-0 top-0 flex h-[54px] w-[54px] items-center justify-center rounded-full border border-cyan-400/30 bg-ink-900 font-mono text-[12px] tracking-[0.2em] text-cyan-200 shadow-[0_0_30px_-6px_rgba(34,211,238,0.55)]">
                    {p.n}
                  </div>
                  <div className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-4">
                    <div className="flex items-center justify-between">
                      <div className="font-display text-[17px] font-medium text-white">
                        {p.title}
                      </div>
                      <div className="font-mono text-[10px] uppercase tracking-[0.18em] text-cyan-300/80">
                        {p.duration}
                      </div>
                    </div>
                    <p className="mt-2 text-sm leading-relaxed text-white/55">{p.body}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
