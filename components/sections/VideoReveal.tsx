"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { Reveal } from "@/components/ui/Reveal";
import { ProductDemo } from "@/components/visuals/ProductDemo";

const CAPTIONS = [
  { k: "01", t: "It connects read-only", d: "EMR, billing, scheduling, telephony — no writes, no disruption." },
  { k: "02", t: "It quantifies every leak", d: "Each gap measured in real dollars from your own systems." },
  { k: "03", t: "It deploys only what pays", d: "Agents go live where — and only where — the ROI is proven." },
];

export function VideoReveal() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const scale = useTransform(scrollYProgress, [0, 0.35], [0.92, 1]);
  const y = useTransform(scrollYProgress, [0, 0.35], [60, 0]);

  return (
    <section id="video" ref={ref} className="chapter-light-alt relative overflow-hidden py-24 sm:py-32">
      <div aria-hidden className="pointer-events-none absolute inset-0 bg-dots opacity-40" />
      <div className="relative z-10 mx-auto max-w-7xl px-6">
        <Reveal>
          <div className="mx-auto max-w-3xl text-center">
            <span className="eyebrow mx-auto">See it work</span>
            <h2 className="display-lg mt-5 text-slate-900">
              Watch the audit find{" "}
              <span className="text-gradient-cyan">$4.2M</span> in 12 weeks.
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-[16px] leading-relaxed text-slate-500">
              No slideware. This is the operational model rebuilding itself in real time —
              scanning, quantifying, and deploying.
            </p>
          </div>
        </Reveal>

        <motion.div style={{ scale, y }} className="mx-auto mt-14 max-w-5xl">
          <div className="rounded-[24px] border border-[rgba(8,145,178,0.14)] bg-white p-2.5 shadow-[0_24px_64px_-20px_rgba(8,16,30,0.18)] sm:p-3">
            <ProductDemo large />
          </div>
        </motion.div>

        {/* Caption rail */}
        <div className="mx-auto mt-14 grid max-w-5xl gap-6 sm:grid-cols-3">
          {CAPTIONS.map((c, i) => (
            <Reveal key={c.k} delay={i * 0.08}>
              <div className="border-t border-[rgba(8,145,178,0.16)] pt-4">
                <span className="font-mono text-[11px] uppercase tracking-[0.16em] text-[#0891B2]">
                  {c.k}
                </span>
                <h3 className="mt-2 text-[16px] font-semibold text-slate-900">{c.t}</h3>
                <p className="mt-1.5 text-[13.5px] leading-relaxed text-slate-500">{c.d}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
