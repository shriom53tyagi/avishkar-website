"use client";

import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

const LOGOS = ["Mayo Clinic", "Stanford Health", "Cleveland Clinic", "Kaiser", "Apollo"];

export function Hero() {
  return (
    <section id="hero" className="relative overflow-hidden bg-white pt-28 pb-0 sm:pt-36">
      {/* Subtle bg blobs */}
      <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 right-0 h-[700px] w-[700px] rounded-full bg-[radial-gradient(circle,rgba(8,145,178,0.07)_0%,transparent_65%)]" />
        <div className="bg-grid absolute inset-0 opacity-30" />
      </div>

      <div className="relative mx-auto max-w-7xl px-6">
        <div className="grid items-end gap-10 lg:grid-cols-2 lg:gap-12">

          {/* LEFT */}
          <div className="pb-16 sm:pb-24">
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45 }}
              className="eyebrow mb-5 w-fit"
            >
              <span className="relative flex h-1.5 w-1.5 shrink-0">
                <span className="absolute inset-0 rounded-full bg-emerald-500" />
                <span className="absolute inset-0 animate-ping-slow rounded-full bg-emerald-400" />
              </span>
              Operational Intelligence for Healthcare
            </motion.div>

            <h1 className="text-[46px] font-bold leading-[1.05] tracking-[-2.5px] text-slate-900 sm:text-5xl lg:text-[58px]">
              Diagnose the leak.{" "}
              <span className="text-gradient-cyan">Recover the revenue.</span>
            </h1>

            <motion.p
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.12 }}
              className="mt-5 max-w-md text-[17px] leading-[1.65] text-slate-500"
            >
              Read-only audit of your EMR, billing & scheduling — then AI agents
              deployed only where the numbers prove ROI.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.22 }}
              className="mt-8 flex flex-wrap gap-3"
            >
              <Link href="/contact">
                <span className="btn-primary">
                  Book an Audit <ArrowRight className="h-4 w-4" />
                </span>
              </Link>
              <Link href="/contact">
                <span className="btn-secondary">See sample report</span>
              </Link>
            </motion.div>

            {/* Trust logos */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.7, delay: 0.4 }}
              className="mt-10 border-t border-slate-100 pt-7"
            >
              <p className="mb-3 font-mono text-[10px] uppercase tracking-[0.18em] text-slate-400">
                Trusted by
              </p>
              <div className="flex flex-wrap gap-x-6 gap-y-1.5">
                {LOGOS.map((b) => (
                  <span key={b} className="text-[13px] font-medium text-slate-400 transition-colors hover:text-slate-600">
                    {b}
                  </span>
                ))}
              </div>
            </motion.div>
          </div>

          {/* RIGHT — photo + floating card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.28, ease: [0.22, 1, 0.36, 1] }}
            className="relative hidden lg:block"
          >
            {/* Photo — tall, flush to bottom */}
            <div className="relative h-[520px] w-full overflow-hidden rounded-t-3xl">
              <Image
                src="https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=900&q=80"
                alt="Healthcare professional reviewing operational data on a tablet"
                fill
                className="object-cover object-center"
                priority
              />
              <div className="absolute inset-0 bg-gradient-to-t from-white/30 via-transparent to-transparent" />
            </div>

            {/* Floating audit card */}
            <div className="absolute bottom-8 left-6 right-6 glass-card rounded-2xl border border-white/80 p-4 shadow-lg">
              <div className="flex items-center gap-2 mb-3">
                <span className="relative flex h-2 w-2">
                  <span className="absolute inset-0 rounded-full bg-emerald-500" />
                  <span className="absolute inset-0 animate-ping-slow rounded-full bg-emerald-400" />
                </span>
                <span className="font-mono text-[10px] uppercase tracking-[0.15em] text-slate-500">Live Audit · Mid-size Clinic</span>
              </div>
              <div className="grid grid-cols-3 divide-x divide-slate-200/70 text-center">
                {[
                  { v: "$2.84M", l: "Leakage found", c: "text-rose-500" },
                  { v: "$2.1M",  l: "Recoverable",   c: "text-emerald-600" },
                  { v: "12 wks", l: "To first ROI",  c: "text-[#0891B2]" },
                ].map((s) => (
                  <div key={s.l} className="px-3">
                    <p className={`text-[18px] font-bold leading-none ${s.c}`}>{s.v}</p>
                    <p className="mt-1 text-[10px] text-slate-400">{s.l}</p>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
