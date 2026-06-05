"use client";

import { motion } from "framer-motion";
import type { ReactNode } from "react";
import { GridBackground } from "@/components/ui/GridBackground";

export function PageHeader({
  eyebrow,
  title,
  description,
}: {
  eyebrow: string;
  title: ReactNode;
  description?: ReactNode;
}) {
  return (
    <section className="relative overflow-hidden pb-6 pt-36 sm:pt-44">
      <GridBackground fade="bottom" />
      <div className="mx-auto max-w-4xl px-6 text-center">
        <motion.span
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="inline-flex items-center gap-2 rounded-full border border-slate-900/10 bg-slate-900/[0.03] px-3 py-1 font-mono text-[11px] uppercase tracking-[0.18em] text-slate-500"
        >
          <span className="relative inline-flex h-1.5 w-1.5">
            <span className="absolute inset-0 rounded-full bg-cyan-400" />
            <span className="absolute inset-0 animate-ping rounded-full bg-cyan-400/60" />
          </span>
          {eyebrow}
        </motion.span>

        <motion.h1
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="mx-auto mt-6 max-w-3xl text-balance font-display text-4xl font-medium leading-[1.05] tracking-tight text-gradient sm:text-5xl md:text-6xl"
        >
          {title}
        </motion.h1>

        {description && (
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="mx-auto mt-6 max-w-2xl text-pretty text-[15px] leading-relaxed text-slate-500 md:text-base"
          >
            {description}
          </motion.p>
        )}
      </div>
    </section>
  );
}
