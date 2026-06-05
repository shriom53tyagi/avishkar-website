"use client";

import { motion } from "framer-motion";
import {
  CalendarClock,
  Receipt,
  ClipboardList,
  Repeat2,
} from "lucide-react";
import type { ComponentType, SVGProps } from "react";
import { GridBackground } from "@/components/ui/GridBackground";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal } from "@/components/ui/Reveal";
import { StatusDot } from "@/components/ui/StatusDot";
import { AGENTS } from "@/lib/data";
import { cn } from "@/lib/utils";

const ICON_MAP: Record<string, ComponentType<SVGProps<SVGSVGElement>>> = {
  "Patient Access Agent": CalendarClock,
  "Revenue Recovery Agent": Receipt,
  "Clinical Operations Agent": ClipboardList,
  "Patient Engagement Agent": Repeat2,
};

export function Agents() {
  return (
    <section id="agents" className="relative py-24 sm:py-32">
      <GridBackground variant="dots" />

      <div className="mx-auto max-w-7xl px-6">
        <SectionHeading
          eyebrow="Agent solutions"
          title={
            <>
              Four agents,{" "}
              <span className="text-gradient-cyan">tailored to your environment.</span>
            </>
          }
          description="We deploy across four operational domains — and only where the audit proves measurable ROI. Each agent is a production system that runs inside your stack, talks to your tools, and escalates to your team."
        />

        <div className="mt-14 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {AGENTS.map((a, i) => {
            const Icon = ICON_MAP[a.name] ?? CalendarClock;
            return (
              <Reveal key={a.name} delay={i * 0.04}>
                <motion.div
                  whileHover={{ y: -4 }}
                  transition={{ duration: 0.4 }}
                  className="group relative h-full overflow-hidden rounded-2xl border border-slate-900/[0.08] bg-gradient-to-b from-slate-50 to-white p-5 transition-colors hover:border-cyan-200"
                >
                  <div className="pointer-events-none absolute inset-0 -z-10 opacity-0 transition-opacity duration-500 group-hover:opacity-100">
                    <div className="absolute inset-0 bg-[radial-gradient(70%_60%_at_50%_0%,rgba(23,70,219,0.10),transparent_70%)]" />
                  </div>

                  <div className="flex items-start justify-between">
                    <div className="relative">
                      <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-cyan-200 bg-cyan-50 text-cyan-700">
                        <Icon className="h-4 w-4" />
                      </div>
                      <span className="pointer-events-none absolute -inset-1 -z-10 rounded-2xl bg-blue-50 opacity-0 blur-md transition-opacity duration-500 group-hover:opacity-100" />
                    </div>
                    <span
                      className={cn(
                        "rounded-full border px-2 py-0.5 font-mono text-[9px] uppercase tracking-[0.16em]",
                        a.status === "live"
                          ? "border-emerald-200 bg-emerald-50 text-emerald-700"
                          : "border-violet-200 bg-violet-50 text-violet-700"
                      )}
                    >
                      {a.status}
                    </span>
                  </div>

                  <div className="mt-5">
                    <div className="font-mono text-[10px] uppercase tracking-[0.16em] text-slate-400">
                      {a.tag}
                    </div>
                    <h3 className="mt-1 font-display text-[17px] font-medium tracking-tight text-slate-900">
                      {a.name}
                    </h3>
                    <p className="mt-2 line-clamp-3 text-[13.5px] leading-relaxed text-slate-500">
                      {a.desc}
                    </p>
                  </div>

                  {/* live wave */}
                  <div className="mt-4 h-8 overflow-hidden rounded-md bg-slate-50">
                    <Wave seed={i} />
                  </div>

                  <div className="mt-4 flex flex-wrap gap-1.5">
                    {a.metrics.map((m) => (
                      <span
                        key={m}
                        className="rounded-full border border-slate-900/[0.08] bg-slate-50 px-2 py-0.5 font-mono text-[10px] uppercase tracking-[0.14em] text-slate-500"
                      >
                        {m}
                      </span>
                    ))}
                  </div>

                  <div className="mt-4 flex items-center justify-between border-t border-slate-900/[0.05] pt-3">
                    <StatusDot tone="live" label="Active" />
                    <div className="font-mono text-[10px] uppercase tracking-[0.18em] text-slate-400">
                      v{(2 + (i % 3) * 0.1).toFixed(1)}.{i + 4}
                    </div>
                  </div>
                </motion.div>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}

function Wave({ seed }: { seed: number }) {
  const path = makeWave(seed);
  return (
    <svg viewBox="0 0 200 32" preserveAspectRatio="none" className="h-full w-full">
      <defs>
        <linearGradient id={`wg-${seed}`} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="rgba(23,70,219,0)" />
          <stop offset="50%" stopColor="rgba(23,70,219,0.65)" />
          <stop offset="100%" stopColor="rgba(109,40,217,0.0)" />
        </linearGradient>
      </defs>
      <path
        d={path}
        stroke={`url(#wg-${seed})`}
        strokeWidth="1.4"
        fill="none"
        vectorEffect="non-scaling-stroke"
      >
        <animate
          attributeName="stroke-dashoffset"
          from="0"
          to="-100"
          dur="6s"
          repeatCount="indefinite"
        />
      </path>
    </svg>
  );
}

function makeWave(seed: number): string {
  const pts: string[] = [];
  for (let x = 0; x <= 200; x += 4) {
    const y =
      16 +
      Math.sin((x / 200) * Math.PI * 4 + seed) * 6 +
      Math.sin((x / 200) * Math.PI * 9 + seed * 1.3) * 3;
    pts.push(`${x === 0 ? "M" : "L"} ${x} ${y.toFixed(2)}`);
  }
  return pts.join(" ");
}
