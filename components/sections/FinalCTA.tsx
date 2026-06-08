"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/Button";
import { NeuralBackground } from "@/components/visuals/NeuralBackground";

export function FinalCTA() {
  return (
    <section
      id="cta"
      className="relative isolate overflow-hidden py-28 sm:py-36"
    >
      <div className="absolute inset-0 -z-10">
        <NeuralBackground className="absolute inset-0 h-full w-full opacity-70" />
        <div className="absolute inset-0 bg-[radial-gradient(60%_50%_at_50%_50%,transparent_0%,rgba(236,242,250,0.88)_75%,#ECF2FA_100%)]" />
        <div className="absolute inset-0 bg-grid opacity-[0.25] mix-blend-multiply" />
      </div>

      <div className="mx-auto max-w-5xl px-6 text-center">
        {/* Scarcity signal */}
        <motion.span
          initial={{ opacity: 0, y: 8 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="inline-flex items-center gap-2 rounded-full border border-slate-900/10 bg-slate-900/[0.03] px-3 py-1 backdrop-blur"
        >
          <span className="relative inline-flex h-1.5 w-1.5">
            <span className="absolute inset-0 rounded-full bg-emerald-400" />
            <span className="absolute inset-0 animate-ping rounded-full bg-emerald-400/60" />
          </span>
          <span className="font-mono text-[11px] uppercase tracking-[0.18em] text-slate-600">
            now booking · Q3 audit cohort
          </span>
        </motion.span>

        {/* Headline */}
        <motion.h2
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
          className="mx-auto mt-6 max-w-4xl text-balance font-display text-4xl font-medium leading-[1.05] tracking-tight sm:text-5xl md:text-6xl lg:text-[72px]"
        >
          <span className="text-gradient">Ready to</span>
          <span className="text-gradient block">find the leak?</span>
        </motion.h2>

        {/* Body */}
        <motion.p
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.9, delay: 0.1 }}
          className="mx-auto mt-6 max-w-xl text-pretty text-[15px] leading-relaxed text-slate-500"
        >
          The audit comes first. Always.
          A fixed-scope diagnosis. A quantified leakage map. A ranked recovery plan.
          Then — and only then — deployment.
        </motion.p>

        {/* CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.9, delay: 0.2 }}
          className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row"
        >
          <Button href="/contact" variant="primary" showArrow>
            Book an Operational Audit
          </Button>
          <Button href="/contact" variant="secondary">
            Talk to the team
          </Button>
        </motion.div>

        {/* Trust strip */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1, delay: 0.4 }}
          className="mt-10 flex flex-wrap items-center justify-center gap-x-5 gap-y-2 font-mono text-[11px] uppercase tracking-[0.16em] text-slate-400"
        >
          <span>HIPAA-aligned</span>
          <span className="h-1 w-1 rounded-full bg-slate-300" />
          <span>BAA available</span>
          <span className="h-1 w-1 rounded-full bg-slate-300" />
          <span>Read-only by default</span>
          <span className="h-1 w-1 rounded-full bg-slate-300" />
          <span>Diagnosis before automation</span>
        </motion.div>
      </div>
    </section>
  );
}
