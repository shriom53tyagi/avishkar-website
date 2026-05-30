"use client";

import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { GridBackground } from "@/components/ui/GridBackground";
import { ParticleField } from "@/components/ui/ParticleField";
import { HeroDashboard } from "@/components/visuals/HeroDashboard";
import { TICKER } from "@/lib/data";

export function Hero() {
  return (
    <section className="relative overflow-hidden pb-12 pt-32 sm:pt-36 md:pb-20 md:pt-44">
      <GridBackground />
      <ParticleField className="pointer-events-none absolute inset-0 -z-10 opacity-70" />

      <div className="mx-auto max-w-7xl px-6">
        {/* Top eyebrow */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="mx-auto flex w-fit items-center gap-2 rounded-full border border-white/10 bg-white/[0.03] px-3 py-1 backdrop-blur"
        >
          <span className="relative inline-flex h-1.5 w-1.5">
            <span className="absolute inset-0 rounded-full bg-emerald-400" />
            <span className="absolute inset-0 animate-ping rounded-full bg-emerald-400/60" />
          </span>
          <span className="font-mono text-[11px] uppercase tracking-[0.18em] text-white/65">
            Avishkar v2 · agentic OS for healthcare
          </span>
        </motion.div>

        {/* Headline */}
        <div className="mx-auto mt-8 max-w-5xl text-center">
          <motion.h1
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
            className="font-display text-balance text-[42px] font-medium leading-[1.02] tracking-tight sm:text-6xl md:text-7xl lg:text-[88px]"
          >
            <span className="text-gradient block">Your healthcare system</span>
            <span className="text-gradient block">has hidden revenue.</span>
            <span className="mt-2 block text-gradient-cyan">AI agents can find it.</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
            className="mx-auto mt-6 max-w-2xl text-pretty text-[15px] leading-relaxed text-white/60 md:text-base"
          >
            Avishkar audits hospitals and clinics with AI, surfaces the workflows quietly leaking
            revenue, and deploys agentic systems engineered for your environment — your EMR, your
            phones, your team. Not consulting. Real, running infrastructure.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row"
          >
            <Button href="#audit" variant="primary" showArrow>
              Book AI Audit
            </Button>
            <Button
              href="#agents"
              variant="secondary"
              icon={<Sparkles className="h-4 w-4 text-cyan-300" />}
            >
              See Agent Demo
            </Button>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.55 }}
            className="mt-6 flex flex-wrap items-center justify-center gap-x-5 gap-y-2 text-[11px] uppercase tracking-[0.16em] text-white/40 font-mono"
          >
            <span>HIPAA-aligned</span>
            <span className="h-1 w-1 rounded-full bg-white/15" />
            <span>BAA available</span>
            <span className="h-1 w-1 rounded-full bg-white/15" />
            <span>Read-only by default</span>
            <span className="h-1 w-1 rounded-full bg-white/15" />
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
          <div className="text-center font-mono text-[11px] uppercase tracking-[0.18em] text-white/35">
            Built with operators from
          </div>
          <div className="mt-5 grid grid-cols-2 items-center gap-x-10 gap-y-6 opacity-70 sm:grid-cols-3 md:grid-cols-6">
            {["Mayo", "Stanford Health", "Apollo", "Cleveland", "Kaiser", "MedStar"].map((b) => (
              <div
                key={b}
                className="text-center font-display text-[15px] tracking-tight text-white/50"
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
    <div className="relative mx-auto mt-10 max-w-6xl overflow-hidden rounded-full border border-white/[0.06] bg-white/[0.02] py-2.5 backdrop-blur">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-y-0 left-0 w-24 bg-gradient-to-r from-ink-950 to-transparent"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-y-0 right-0 w-24 bg-gradient-to-l from-ink-950 to-transparent"
      />
      <div className="flex w-max animate-ticker gap-10 whitespace-nowrap px-6 font-mono text-[11px] text-white/55">
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
