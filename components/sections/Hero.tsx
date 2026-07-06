"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { LiveCounter } from "@/components/ui/LiveCounter";
import { NeuralLayer } from "@/components/visuals/NeuralLayer";

/** The screen recording is slow-paced; play it back accelerated. */
const DEMO_PLAYBACK_RATE = 1.75;

const STATS = [
  { label: "Claims processed",     start: 1720542, step: 6 },
  { label: "EMR fields reconciled", start: 1492931, step: 5 },
  { label: "Agent interactions",   start: 10293,   step: 3 },
  { label: "Charts reviewed",      start: 113371,  step: 4 },
  { label: "Slots rebooked",       start: 16654,   step: 2 },
  { label: "Denials triaged",      start: 48219,   step: 3 },
] as const;

export function Hero() {
  const router = useRouter();
  const [email, setEmail] = useState("");

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    router.push(`/contact${email ? `?email=${encodeURIComponent(email)}` : ""}`);
  };

  return (
    <section id="hero" className="relative overflow-hidden bg-white pt-28 sm:pt-32">
      {/* Neural network backdrop */}
      <NeuralLayer className="opacity-[0.55] [mask-image:linear-gradient(to_bottom,black,transparent_85%)]" />
      {/* Dotted backdrop */}
      <div aria-hidden className="pointer-events-none absolute inset-0 bg-dots opacity-[0.35]" />
      <div aria-hidden className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-slate-200 to-transparent" />

      <div className="relative mx-auto max-w-7xl px-6">
        {/* Live ticker eyebrow */}
        <motion.div
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45 }}
          className="flex items-center gap-2 pt-6"
        >
          <span className="font-mono text-[11px] uppercase tracking-[0.16em] text-slate-400">
            Revenue recovered by Avishkar
          </span>
          <span className="rounded-md border border-slate-200 bg-slate-50 px-2 py-0.5 font-mono text-[11px] font-medium tabular-nums text-slate-700">
            <LiveCounter start={4218704} step={9} intervalMs={1800} prefix="$" />
          </span>
        </motion.div>

        {/* Headline */}
        <motion.h1
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="display-xl mt-5 max-w-3xl text-slate-900"
        >
          Find the leak. <span className="text-gradient-cyan">Recover the revenue.</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="mt-5 max-w-xl text-[18px] leading-[1.55] text-slate-500"
        >
          Audits, AI agents, and revenue recovery for your EMR, billing &amp; scheduling
          — in the blink of an audit.
        </motion.p>

        {/* Inline email capture */}
        <motion.form
          onSubmit={submit}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.18 }}
          className="mt-8 flex w-full max-w-md items-center gap-1.5 rounded-2xl border border-slate-200 bg-white p-1.5 shadow-sm focus-within:border-[rgba(8,145,178,0.4)] focus-within:ring-2 focus-within:ring-[rgba(8,145,178,0.12)]"
        >
          <label htmlFor="hero-email" className="sr-only">
            Your work email
          </label>
          <input
            id="hero-email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="What's your work email?"
            className="min-w-0 flex-1 bg-transparent px-3.5 py-2.5 text-[14px] text-slate-800 placeholder:text-slate-400 focus:outline-none"
          />
          <button
            type="submit"
            className="inline-flex shrink-0 cursor-pointer items-center gap-1.5 rounded-xl bg-[#0891B2] px-4 py-2.5 text-[14px] font-semibold text-white transition-all duration-200 hover:-translate-y-px hover:bg-[#0E7490] shadow-[0_1px_4px_rgba(8,145,178,0.35)]"
          >
            Book an Audit
            <ArrowRight className="h-4 w-4" />
          </button>
        </motion.form>

        {/* Product demo canvas */}
        <motion.div
          initial={{ opacity: 0, y: 28, scale: 0.985 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.28, ease: [0.22, 1, 0.36, 1] }}
          className="relative mt-14"
        >
          <div className="relative overflow-hidden rounded-[28px] border border-slate-200/80 bg-canvas-alt p-3 sm:p-5 lg:p-6">
            <div aria-hidden className="pointer-events-none absolute inset-0 bg-dots opacity-60" />
            <div className="relative mx-auto max-w-5xl overflow-hidden rounded-2xl border border-slate-200/70 shadow-[0_30px_80px_-24px_rgba(8,16,30,0.30)]">
              <video
                className="block h-auto w-full"
                autoPlay
                muted
                loop
                playsInline
                preload="metadata"
                aria-label="Avishkar AI product demo"
                onLoadedMetadata={(e) => {
                  e.currentTarget.playbackRate = DEMO_PLAYBACK_RATE;
                }}
              >
                <source src="/hero-demo.mp4" type="video/mp4" />
              </video>
            </div>
          </div>
        </motion.div>

        {/* Live stats bar */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.7, delay: 0.5 }}
          className="mt-8 border-t border-slate-100 py-6"
        >
          <div className="flex flex-wrap items-center gap-x-8 gap-y-4">
            <span className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.16em] text-slate-500">
              <span className="relative flex h-1.5 w-1.5">
                <span className="absolute inset-0 rounded-full bg-emerald-500" />
                <span className="absolute inset-0 animate-ping-slow rounded-full bg-emerald-400" />
              </span>
              Agents at work today
            </span>
            {STATS.map((s) => (
              <div key={s.label} className="flex flex-col">
                <span className="font-mono text-[9px] uppercase tracking-[0.13em] text-slate-400">
                  {s.label}
                </span>
                <LiveCounter
                  start={s.start}
                  step={s.step}
                  className="font-mono text-[15px] font-semibold tabular-nums text-slate-800"
                />
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
