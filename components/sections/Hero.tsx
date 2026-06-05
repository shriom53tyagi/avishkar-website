"use client";

import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { ParticleField } from "@/components/ui/ParticleField";
import { NeuralBackground } from "@/components/visuals/NeuralBackground";
import { HeroDashboard } from "@/components/visuals/HeroDashboard";
import { TICKER, TRUST_LOGOS } from "@/lib/data";

export function Hero() {
  return (
    <section className="relative isolate overflow-hidden pb-12 pt-32 sm:pt-36 md:pb-20 md:pt-44">
      {/* Neural network backdrop */}
      <div className="absolute inset-0 -z-10">
        <NeuralBackground className="absolute inset-0 h-full w-full opacity-70" />
        <div className="absolute inset-0 bg-[radial-gradient(60%_55%_at_50%_40%,transparent_0%,rgba(236,242,250,0.88)_75%,#ECF2FA_100%)]" />
        <div className="absolute inset-0 bg-grid opacity-[0.25] mix-blend-multiply" />
      </div>
      <ParticleField className="pointer-events-none absolute inset-0 -z-10 opacity-40" />

      <div className="mx-auto max-w-7xl px-6">
        {/* Top eyebrow */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="mx-auto flex w-fit items-center gap-2 rounded-full border border-slate-900/10 bg-slate-900/[0.03] px-3 py-1 backdrop-blur"
        >
          <span className="relative inline-flex h-1.5 w-1.5">
            <span className="absolute inset-0 rounded-full bg-emerald-400" />
            <span className="absolute inset-0 animate-ping rounded-full bg-emerald-400/60" />
          </span>
          <span className="font-mono text-[11px] uppercase tracking-[0.18em] text-slate-600">
            Operational intelligence for healthcare
          </span>
        </motion.div>

        {/* Headline */}
        <div className="mx-auto mt-8 max-w-5xl text-center">
          <h1
            className="font-display text-balance text-[42px] font-medium leading-[1.02] tracking-tight sm:text-6xl md:text-7xl lg:text-[88px]"
          >
            <span className="text-gradient block">Stop losing revenue to</span>
            <span className="mt-2 block text-gradient-cyan">operational blind spots.</span>
          </h1>

          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
            className="mx-auto mt-6 max-w-2xl text-pretty text-[15px] leading-relaxed text-slate-500 md:text-base"
          >
            Avishkar audits your healthcare operations, identifies hidden sources of revenue
            leakage, and deploys targeted AI agents to recover lost value, reduce administrative
            burden, and improve financial performance.
          </motion.p>

          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.22, ease: [0.22, 1, 0.36, 1] }}
            className="mt-4 font-mono text-[12px] uppercase tracking-[0.2em] text-cyan-600"
          >
            Find the Leak · Quantify the Impact · Deploy the Fix
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row"
          >
            <Button href="/contact" variant="primary" showArrow>
              Book an Operational Audit
            </Button>
            <Button
              href="#revenue"
              variant="secondary"
              icon={<Sparkles className="h-4 w-4 text-cyan-600" />}
            >
              See Sample Leakage Report
            </Button>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.55 }}
            className="mt-6 flex flex-wrap items-center justify-center gap-x-5 gap-y-2 text-[11px] uppercase tracking-[0.16em] text-slate-400 font-mono"
          >
            <span>HIPAA-aligned</span>
            <span className="h-1 w-1 rounded-full bg-slate-300" />
            <span>BAA available</span>
            <span className="h-1 w-1 rounded-full bg-slate-300" />
            <span>Read-only by default</span>
            <span className="h-1 w-1 rounded-full bg-slate-300" />
            <span>Human-in-the-loop</span>
          </motion.div>
        </div>

        {/* Dashboard */}
        <div className="relative mx-auto mt-16 max-w-6xl">
          <HeroDashboard />
        </div>

        {/* Live ticker */}
        <Ticker />

        {/* Trusted-by row */}
        <div className="mx-auto mt-14 max-w-5xl">
          <div className="text-center font-mono text-[11px] uppercase tracking-[0.18em] text-slate-400">
            Built with operators from
          </div>
          <div className="mt-5 grid grid-cols-2 items-center gap-x-10 gap-y-6 sm:grid-cols-3 md:grid-cols-6">
            {TRUST_LOGOS.map((b) => (
              <div
                key={b}
                className="text-center font-display text-[15px] tracking-tight text-slate-400 grayscale transition-all duration-300 hover:text-slate-700 hover:grayscale-0"
              >
                {b}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function Ticker() {
  const items = [...TICKER, ...TICKER];
  return (
    <div className="relative mx-auto mt-10 max-w-6xl overflow-hidden rounded-full border border-slate-900/[0.08] bg-slate-900/[0.02] py-2.5 backdrop-blur">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-y-0 left-0 w-24 bg-gradient-to-r from-[#ECF2FA] to-transparent"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-y-0 right-0 w-24 bg-gradient-to-l from-[#ECF2FA] to-transparent"
      />
      <div className="flex w-max animate-ticker gap-10 whitespace-nowrap px-6 font-mono text-[11px] text-slate-500">
        {items.map((t, i) => (
          <span key={i} className="inline-flex items-center gap-2">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400/80" />
            {t}
          </span>
        ))}
      </div>
    </div>
  );
}
