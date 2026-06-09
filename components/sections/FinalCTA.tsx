"use client";

import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { NeuralBackground } from "@/components/visuals/NeuralBackground";

export function FinalCTA() {
  return (
    <section id="cta" className="relative overflow-hidden bg-[#F8FAFE] py-28 sm:py-36">
      {/* Neural network background */}
      <div aria-hidden className="pointer-events-none absolute inset-0 opacity-30">
        <NeuralBackground className="h-full w-full" />
      </div>

      {/* Subtle gradient overlays */}
      <div aria-hidden className="pointer-events-none absolute inset-0">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_50%_120%,rgba(8,145,178,0.10),transparent_70%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_50%_at_0%_50%,rgba(5,150,105,0.06),transparent_60%)]" />
      </div>

      <div className="relative mx-auto max-w-4xl px-6 text-center">
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mb-6 inline-flex"
        >
          <span className="eyebrow">
            <span className="relative flex h-1.5 w-1.5 shrink-0">
              <span className="absolute inset-0 rounded-full bg-emerald-500" />
              <span className="absolute inset-0 animate-ping-slow rounded-full bg-emerald-400" />
            </span>
            Now booking Q3 2025 audit cohort
          </span>
        </motion.div>

        <motion.h2
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, delay: 0.08, ease: [0.22, 1, 0.36, 1] }}
          className="text-[44px] font-bold leading-[1.06] tracking-[-2px] text-slate-900 sm:text-5xl lg:text-[60px]"
        >
          Ready to{" "}
          <span className="text-gradient-cyan">find the leak?</span>
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, delay: 0.15 }}
          className="mx-auto mt-5 max-w-md text-[17px] leading-[1.7] text-slate-500"
        >
          Diagnosis first. Deployment only where the numbers prove it.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, delay: 0.22 }}
          className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row"
        >
          <Link href="/contact" className="cursor-pointer">
            <span className="btn-primary px-7 py-3.5 text-[15px]">
              Book an Operational Audit
              <ArrowRight className="h-4 w-4" />
            </span>
          </Link>
          <Link href="/contact" className="cursor-pointer">
            <span className="btn-secondary px-7 py-3.5 text-[15px]">
              Talk to the team
            </span>
          </Link>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.34 }}
          className="mt-10 flex flex-wrap items-center justify-center gap-x-5 gap-y-2"
        >
          {["HIPAA-aligned", "BAA available", "Read-only audit", "Diagnosis before automation"].map((t, i) => (
            <span key={t} className="flex items-center gap-4">
              {i > 0 && <span className="h-1 w-1 rounded-full bg-slate-300" />}
              <span className="font-mono text-[11px] uppercase tracking-[0.14em] text-slate-400">{t}</span>
            </span>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
