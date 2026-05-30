"use client";

import { motion } from "framer-motion";
import { Activity, Brain, HeartPulse, Network, Stethoscope, Wifi } from "lucide-react";
import { StatusDot } from "@/components/ui/StatusDot";

const NODES = [
  { id: "intake", x: 12, y: 20, label: "Intake" },
  { id: "scheduler", x: 50, y: 12, label: "Scheduler" },
  { id: "voice", x: 86, y: 22, label: "Voice AI" },
  { id: "emr", x: 22, y: 58, label: "EMR" },
  { id: "agent", x: 50, y: 50, label: "Agent Core" },
  { id: "billing", x: 80, y: 60, label: "Billing" },
  { id: "followup", x: 36, y: 86, label: "Follow-up" },
  { id: "ops", x: 70, y: 86, label: "Ops" },
];

const EDGES: [string, string][] = [
  ["intake", "agent"],
  ["scheduler", "agent"],
  ["voice", "agent"],
  ["emr", "agent"],
  ["billing", "agent"],
  ["agent", "followup"],
  ["agent", "ops"],
  ["scheduler", "voice"],
  ["intake", "scheduler"],
  ["billing", "ops"],
];

function nodeById(id: string) {
  return NODES.find((n) => n.id === id)!;
}

export function HeroDashboard() {
  return (
    <div className="relative">
      <div
        aria-hidden
        className="pointer-events-none absolute -inset-10 -z-10 rounded-[40px] bg-[radial-gradient(60%_60%_at_50%_30%,rgba(34,211,238,0.16),transparent_70%)]"
      />
      <motion.div
        initial={{ opacity: 0, y: 30, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.9, delay: 0.25, ease: [0.22, 1, 0.36, 1] }}
        className="surface relative overflow-hidden rounded-2xl"
      >
        {/* Window chrome */}
        <div className="flex items-center justify-between border-b border-white/[0.06] px-4 py-2.5">
          <div className="flex items-center gap-2">
            <span className="h-2.5 w-2.5 rounded-full bg-rose-400/70" />
            <span className="h-2.5 w-2.5 rounded-full bg-amber-400/70" />
            <span className="h-2.5 w-2.5 rounded-full bg-emerald-400/70" />
          </div>
          <div className="font-mono text-[10px] uppercase tracking-[0.18em] text-white/40">
            avishkar.console / live
          </div>
          <StatusDot tone="live" label="online" />
        </div>

        {/* Body */}
        <div className="grid gap-4 p-4 md:grid-cols-[1.4fr_1fr]">
          {/* Network map */}
          <div className="relative h-[360px] overflow-hidden rounded-xl border border-white/[0.06] bg-[radial-gradient(80%_80%_at_50%_50%,rgba(255,255,255,0.03),transparent_60%)]">
            <div className="absolute inset-0 bg-grid-fine opacity-30" />
            {/* Sweep line */}
            <div className="pointer-events-none absolute inset-x-0 h-24 animate-scan-y bg-[linear-gradient(180deg,transparent,rgba(34,211,238,0.18),transparent)]" />

            <svg className="absolute inset-0 h-full w-full" viewBox="0 0 100 100" preserveAspectRatio="none">
              <defs>
                <linearGradient id="edge" x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0%" stopColor="rgba(34,211,238,0.0)" />
                  <stop offset="50%" stopColor="rgba(34,211,238,0.6)" />
                  <stop offset="100%" stopColor="rgba(167,139,250,0.0)" />
                </linearGradient>
              </defs>
              {EDGES.map(([a, b], i) => {
                const A = nodeById(a);
                const B = nodeById(b);
                return (
                  <g key={`${a}-${b}`}>
                    <line
                      x1={A.x}
                      y1={A.y}
                      x2={B.x}
                      y2={B.y}
                      stroke="rgba(255,255,255,0.10)"
                      strokeWidth="0.25"
                      vectorEffect="non-scaling-stroke"
                    />
                    <line
                      x1={A.x}
                      y1={A.y}
                      x2={B.x}
                      y2={B.y}
                      stroke="url(#edge)"
                      strokeWidth="0.6"
                      strokeDasharray="3 3"
                      vectorEffect="non-scaling-stroke"
                      className="dash-flow"
                      style={{ animationDelay: `${i * 0.4}s` }}
                    />
                  </g>
                );
              })}
            </svg>

            {NODES.map((n, i) => (
              <motion.div
                key={n.id}
                initial={{ opacity: 0, scale: 0.6 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: 0.35 + i * 0.05 }}
                className="absolute -translate-x-1/2 -translate-y-1/2"
                style={{ left: `${n.x}%`, top: `${n.y}%` }}
              >
                <div className="relative">
                  {n.id === "agent" ? (
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-cyan-400/40 bg-cyan-400/[0.08] shadow-[0_0_30px_-6px_rgba(34,211,238,0.6)]">
                      <Brain className="h-5 w-5 text-cyan-300" />
                      <span className="absolute -inset-2 -z-10 rounded-2xl bg-cyan-400/20 blur-xl" />
                    </div>
                  ) : (
                    <div className="flex h-9 w-9 items-center justify-center rounded-lg border border-white/10 bg-white/[0.04] backdrop-blur">
                      {n.id === "voice" && <Wifi className="h-3.5 w-3.5 text-cyan-300/90" />}
                      {n.id === "emr" && <HeartPulse className="h-3.5 w-3.5 text-emerald-300/90" />}
                      {n.id === "billing" && <Activity className="h-3.5 w-3.5 text-violet-300/90" />}
                      {n.id === "scheduler" && <Network className="h-3.5 w-3.5 text-cyan-300/90" />}
                      {n.id === "intake" && <Stethoscope className="h-3.5 w-3.5 text-emerald-300/90" />}
                      {n.id === "followup" && <Activity className="h-3.5 w-3.5 text-cyan-300/90" />}
                      {n.id === "ops" && <Network className="h-3.5 w-3.5 text-violet-300/90" />}
                    </div>
                  )}
                  <span className="absolute left-1/2 top-[calc(100%+6px)] -translate-x-1/2 whitespace-nowrap font-mono text-[10px] uppercase tracking-[0.14em] text-white/55">
                    {n.label}
                  </span>
                </div>
              </motion.div>
            ))}

            {/* Floating chips */}
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.9, duration: 0.6 }}
              className="absolute left-3 top-3 rounded-md border border-white/10 bg-ink-900/70 px-2 py-1 font-mono text-[10px] uppercase tracking-[0.14em] text-white/60 backdrop-blur"
            >
              graph · 312 nodes
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.05, duration: 0.6 }}
              className="absolute right-3 top-3 rounded-md border border-emerald-400/20 bg-emerald-400/[0.06] px-2 py-1 font-mono text-[10px] uppercase tracking-[0.14em] text-emerald-300/90 backdrop-blur"
            >
              health · 98.6%
            </motion.div>
          </div>

          {/* Side panel */}
          <div className="grid gap-4">
            {/* Revenue card */}
            <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-4">
              <div className="mb-3 flex items-center justify-between">
                <span className="font-mono text-[10px] uppercase tracking-[0.16em] text-white/45">
                  Revenue Recovered (90d)
                </span>
                <StatusDot tone="live" />
              </div>
              <div className="font-display text-3xl font-medium tracking-tight text-white">
                $4,218,704
              </div>
              <div className="mt-1 text-xs text-emerald-400/90">+9.4% capture · 412 denials triaged</div>
              <Sparkline className="mt-3 h-10 w-full" />
            </div>

            {/* Live ops */}
            <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-4">
              <div className="mb-3 flex items-center justify-between">
                <span className="font-mono text-[10px] uppercase tracking-[0.16em] text-white/45">
                  Live Agents
                </span>
                <span className="font-mono text-[10px] text-white/45">12 active</span>
              </div>
              <ul className="space-y-2 text-xs">
                {[
                  ["Voice AI", "answering · 3 calls", "live"],
                  ["Scheduler", "rebooking · 6 slots", "live"],
                  ["Billing", "denial triage · 14", "live"],
                  ["Follow-up", "queued · 1.2k SMS", "live"],
                ].map(([name, sub, tone]) => (
                  <li key={name} className="flex items-center gap-3">
                    <StatusDot tone={tone as "live"} />
                    <div className="min-w-0 flex-1">
                      <div className="text-white/85">{name}</div>
                      <div className="truncate text-white/45">{sub}</div>
                    </div>
                    <span className="font-mono text-[10px] text-emerald-400/90">OK</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Bottom strip / terminal */}
        <div className="border-t border-white/[0.06] bg-black/30 px-4 py-2 font-mono text-[11px] text-white/55">
          <span className="text-emerald-400/80">$</span>
          <span className="ml-2 text-white/75">avishkar audit --org riveroak-clinic</span>
          <span className="ml-2 text-white/35">› detected 7 revenue leaks · est. $4.2M / yr</span>
          <span className="ml-2 inline-block h-3 w-1.5 align-middle bg-emerald-400 animate-blink" />
        </div>
      </motion.div>

      {/* Floating metric chips */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.2, duration: 0.6 }}
        className="absolute -left-4 top-12 hidden rounded-xl glass-strong px-3.5 py-2 shadow-glow md:block"
      >
        <div className="flex items-center gap-2">
          <div className="flex h-7 w-7 items-center justify-center rounded-md bg-emerald-400/15 text-emerald-300">
            <HeartPulse className="h-3.5 w-3.5" />
          </div>
          <div>
            <div className="font-mono text-[10px] uppercase tracking-[0.14em] text-white/50">No-show recovery</div>
            <div className="text-sm text-white">+312 / week</div>
          </div>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.35, duration: 0.6 }}
        className="absolute -right-4 bottom-16 hidden rounded-xl glass-strong px-3.5 py-2 shadow-glow md:block"
      >
        <div className="flex items-center gap-2">
          <div className="flex h-7 w-7 items-center justify-center rounded-md bg-cyan-400/15 text-cyan-300">
            <Activity className="h-3.5 w-3.5" />
          </div>
          <div>
            <div className="font-mono text-[10px] uppercase tracking-[0.14em] text-white/50">Avg. agent latency</div>
            <div className="text-sm text-white">184ms</div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

function Sparkline({ className }: { className?: string }) {
  const points = [4, 7, 5, 9, 8, 12, 10, 14, 13, 17, 16, 21, 19, 24];
  const max = Math.max(...points);
  const path = points
    .map((p, i) => {
      const x = (i / (points.length - 1)) * 100;
      const y = 100 - (p / max) * 100;
      return `${i === 0 ? "M" : "L"} ${x} ${y}`;
    })
    .join(" ");
  return (
    <svg viewBox="0 0 100 100" preserveAspectRatio="none" className={className}>
      <defs>
        <linearGradient id="sparkFill" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="rgba(52,211,153,0.45)" />
          <stop offset="100%" stopColor="rgba(52,211,153,0)" />
        </linearGradient>
      </defs>
      <path d={`${path} L 100 100 L 0 100 Z`} fill="url(#sparkFill)" />
      <path d={path} stroke="#34D399" strokeWidth="1.4" fill="none" vectorEffect="non-scaling-stroke" />
    </svg>
  );
}
