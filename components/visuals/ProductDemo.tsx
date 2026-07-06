"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import {
  Activity,
  Brain,
  CheckCircle2,
  HeartPulse,
  Network,
  Stethoscope,
  TrendingUp,
  Wifi,
} from "lucide-react";

/* ──────────────────────────────────────────────────────────────────────────
   ProductDemo — a self-playing, looping "screen recording" built in code.
   Four staged scenes cycle automatically to read like a real product walkthrough:
     0. SCAN     — audit command types out, systems connect
     1. DETECT   — revenue leaks surface one-by-one, total counts up
     2. DEPLOY   — agents go live
     3. RECOVER  — revenue line climbs, result lands
   Respects prefers-reduced-motion (renders the final RECOVER frame statically).
   ────────────────────────────────────────────────────────────────────────── */

const SCENES = ["SCAN", "DETECT", "DEPLOY", "RECOVER"] as const;
type Scene = (typeof SCENES)[number];
const SCENE_MS = 3200;

const NODES = [
  { id: "intake", x: 14, y: 24, label: "Intake", icon: Stethoscope },
  { id: "scheduler", x: 50, y: 14, label: "Scheduler", icon: Network },
  { id: "voice", x: 86, y: 26, label: "Voice AI", icon: Wifi },
  { id: "emr", x: 24, y: 62, label: "EMR", icon: HeartPulse },
  { id: "agent", x: 50, y: 52, label: "Agent Core", icon: Brain },
  { id: "billing", x: 80, y: 64, label: "Billing", icon: Activity },
] as const;

const EDGES: [string, string][] = [
  ["intake", "agent"],
  ["scheduler", "agent"],
  ["voice", "agent"],
  ["emr", "agent"],
  ["billing", "agent"],
];

const LEAKS = [
  { label: "No-show leakage", value: "$1.84M" },
  { label: "Claim denials", value: "$1.12M" },
  { label: "Call drop-off", value: "$0.61M" },
  { label: "Documentation", value: "$0.63M" },
];

const AGENTS = [
  ["Voice AI", "answering · 3 calls"],
  ["Scheduler", "rebooking · 6 slots"],
  ["Billing", "denial triage · 14"],
  ["Follow-up", "queued · 1.2k SMS"],
];

function node(id: string) {
  return NODES.find((n) => n.id === id)!;
}

export function ProductDemo({ large = false }: { large?: boolean }) {
  const reduce = useReducedMotion();
  const [scene, setScene] = useState<Scene>("SCAN");
  const idx = SCENES.indexOf(scene);

  useEffect(() => {
    if (reduce) {
      setScene("RECOVER");
      return;
    }
    const t = setInterval(() => {
      setScene((s) => SCENES[(SCENES.indexOf(s) + 1) % SCENES.length]);
    }, SCENE_MS);
    return () => clearInterval(t);
  }, [reduce]);

  return (
    <div className="relative">
      <div
        aria-hidden
        className="pointer-events-none absolute -inset-8 -z-10 rounded-[40px] bg-[radial-gradient(60%_60%_at_50%_30%,rgba(8,145,178,0.18),transparent_70%)]"
      />

      <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-[#0B1018] shadow-[0_30px_80px_-20px_rgba(8,16,30,0.65)]">
        {/* Window chrome */}
        <div className="flex items-center justify-between border-b border-white/[0.07] px-4 py-2.5">
          <div className="flex items-center gap-2">
            <span className="h-2.5 w-2.5 rounded-full bg-rose-400/70" />
            <span className="h-2.5 w-2.5 rounded-full bg-amber-400/70" />
            <span className="h-2.5 w-2.5 rounded-full bg-emerald-400/70" />
          </div>
          <div className="font-mono text-[10px] uppercase tracking-[0.18em] text-slate-500">
            avishkar.console / live
          </div>
          <div className="flex items-center gap-1.5">
            <span className="relative flex h-1.5 w-1.5">
              <span className="absolute inset-0 rounded-full bg-emerald-500" />
              <span className="absolute inset-0 animate-ping-slow rounded-full bg-emerald-400" />
            </span>
            <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-emerald-400">rec</span>
          </div>
        </div>

        {/* Scene tabs (progress) */}
        <div className="flex items-center gap-1 border-b border-white/[0.07] px-4 py-2">
          {SCENES.map((s, i) => (
            <div key={s} className="flex flex-1 items-center gap-1">
              <span
                className={`font-mono text-[9px] uppercase tracking-[0.14em] transition-colors ${
                  i === idx ? "text-cyan-300" : "text-slate-600"
                }`}
              >
                {s}
              </span>
              <div className="h-px flex-1 overflow-hidden rounded-full bg-white/[0.06]">
                <motion.div
                  key={`${s}-${scene}`}
                  className="h-full bg-cyan-400/80"
                  initial={{ width: i < idx ? "100%" : "0%" }}
                  animate={{ width: i <= idx ? "100%" : "0%" }}
                  transition={{ duration: i === idx && !reduce ? SCENE_MS / 1000 : 0.3, ease: "linear" }}
                />
              </div>
            </div>
          ))}
        </div>

        <div className={`grid gap-3 p-3 sm:p-4 md:grid-cols-[1.35fr_1fr] ${large ? "md:gap-4" : ""}`}>
          {/* Left: network map */}
          <div
            className={`relative overflow-hidden rounded-xl border border-white/[0.06] bg-[radial-gradient(80%_80%_at_50%_40%,rgba(8,145,178,0.10),transparent_60%)] ${
              large ? "h-[300px] sm:h-[420px]" : "h-[260px] sm:h-[340px]"
            }`}
          >
            <div
              aria-hidden
              className="absolute inset-0 opacity-[0.12]"
              style={{
                backgroundImage:
                  "linear-gradient(rgba(255,255,255,0.5) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,0.5) 1px,transparent 1px)",
                backgroundSize: "26px 26px",
              }}
            />
            {!reduce && scene === "SCAN" && (
              <div className="pointer-events-none absolute inset-x-0 h-24 animate-scan-y bg-[linear-gradient(180deg,transparent,rgba(8,145,178,0.22),transparent)]" />
            )}

            <svg className="absolute inset-0 h-full w-full" viewBox="0 0 100 100" preserveAspectRatio="none">
              <defs>
                <linearGradient id="pd-edge" x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0%" stopColor="rgba(8,145,178,0)" />
                  <stop offset="50%" stopColor="rgba(8,145,178,0.6)" />
                  <stop offset="100%" stopColor="rgba(5,150,105,0)" />
                </linearGradient>
              </defs>
              {EDGES.map(([a, b], i) => {
                const A = node(a);
                const B = node(b);
                const active = idx >= 1;
                return (
                  <line
                    key={`${a}-${b}`}
                    x1={A.x}
                    y1={A.y}
                    x2={B.x}
                    y2={B.y}
                    stroke={active ? "url(#pd-edge)" : "rgba(255,255,255,0.12)"}
                    strokeWidth={active ? "0.7" : "0.3"}
                    strokeDasharray="3 3"
                    vectorEffect="non-scaling-stroke"
                    style={{
                      animation: active && !reduce ? `dash 1.2s linear ${i * 0.2}s infinite` : undefined,
                    }}
                  />
                );
              })}
            </svg>

            {NODES.map((n, i) => {
              const Icon = n.icon;
              const isCore = n.id === "agent";
              return (
                <motion.div
                  key={n.id}
                  initial={{ opacity: 0, scale: 0.6 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5, delay: 0.15 + i * 0.06 }}
                  className="absolute -translate-x-1/2 -translate-y-1/2"
                  style={{ left: `${n.x}%`, top: `${n.y}%` }}
                >
                  <div className="relative">
                    <div
                      className={
                        isCore
                          ? "flex h-12 w-12 items-center justify-center rounded-xl border border-cyan-400/40 bg-cyan-500/10 shadow-[0_0_28px_-4px_rgba(8,145,178,0.6)]"
                          : "flex h-9 w-9 items-center justify-center rounded-lg border border-white/10 bg-white/[0.04] backdrop-blur"
                      }
                    >
                      <Icon className={isCore ? "h-5 w-5 text-cyan-300" : "h-3.5 w-3.5 text-cyan-300/80"} />
                      {isCore && <span className="absolute -inset-2 -z-10 rounded-2xl bg-cyan-500/15 blur-xl" />}
                    </div>
                    <span className="absolute left-1/2 top-[calc(100%+5px)] -translate-x-1/2 whitespace-nowrap font-mono text-[9px] uppercase tracking-[0.13em] text-slate-500">
                      {n.label}
                    </span>
                  </div>
                </motion.div>
              );
            })}

            {/* Scene chip top-right */}
            <div className="absolute right-3 top-3">
              <AnimatePresence mode="wait">
                <motion.div
                  key={scene}
                  initial={{ opacity: 0, y: -6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 6 }}
                  transition={{ duration: 0.3 }}
                  className="rounded-md border border-emerald-400/30 bg-emerald-500/10 px-2 py-1 font-mono text-[10px] uppercase tracking-[0.13em] text-emerald-300"
                >
                  {scene === "SCAN" && "scanning · 6 systems"}
                  {scene === "DETECT" && "7 leaks found"}
                  {scene === "DEPLOY" && "12 agents live"}
                  {scene === "RECOVER" && "health · 98.6%"}
                </motion.div>
              </AnimatePresence>
            </div>
          </div>

          {/* Right: scene-driven panel */}
          <div className="grid content-start gap-3">
            {/* Headline metric */}
            <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-4">
              <div className="mb-1 font-mono text-[10px] uppercase tracking-[0.16em] text-slate-500">
                {idx <= 1 ? "Revenue at risk (annualized)" : "Revenue recovered (90d)"}
              </div>
              <CountingValue scene={scene} reduce={!!reduce} />
              <div className="mt-1 text-xs text-emerald-400">
                {idx <= 1 ? "across 7 workflows" : "+9.4% capture · 412 denials triaged"}
              </div>
            </div>

            {/* Scene body */}
            <div className="relative min-h-[150px] rounded-xl border border-white/[0.06] bg-white/[0.02] p-4">
              <AnimatePresence mode="wait">
                <motion.div
                  key={scene}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.35 }}
                >
                  {(scene === "SCAN" || scene === "DETECT") && (
                    <ul className="space-y-2">
                      {LEAKS.map((l, i) => (
                        <motion.li
                          key={l.label}
                          initial={{ opacity: 0.25 }}
                          animate={{ opacity: scene === "DETECT" ? 1 : 0.35 }}
                          transition={{ delay: scene === "DETECT" ? i * 0.35 : 0 }}
                          className="flex items-center justify-between text-xs"
                        >
                          <span className="flex items-center gap-2 text-slate-300">
                            <span className="h-1.5 w-1.5 rounded-full bg-rose-400" />
                            {l.label}
                          </span>
                          <span className="font-mono text-slate-400">{l.value}</span>
                        </motion.li>
                      ))}
                    </ul>
                  )}

                  {(scene === "DEPLOY" || scene === "RECOVER") && (
                    <ul className="space-y-2">
                      {AGENTS.map(([name, sub], i) => (
                        <motion.li
                          key={name}
                          initial={{ opacity: 0, x: -6 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: i * 0.2 }}
                          className="flex items-center gap-2.5 text-xs"
                        >
                          <CheckCircle2 className="h-3.5 w-3.5 shrink-0 text-emerald-400" />
                          <span className="min-w-0 flex-1">
                            <span className="text-slate-200">{name}</span>{" "}
                            <span className="text-slate-500">{sub}</span>
                          </span>
                          <span className="font-mono text-[10px] text-emerald-400">OK</span>
                        </motion.li>
                      ))}
                    </ul>
                  )}
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </div>

        {/* Terminal strip */}
        <div className="flex items-center gap-2 border-t border-white/[0.07] bg-black/30 px-4 py-2 font-mono text-[11px]">
          <span className="text-emerald-400">$</span>
          <span className="text-slate-300">avishkar audit --org riveroak-clinic</span>
          <span className="hidden text-slate-500 sm:inline">
            {scene === "SCAN" && "› connecting read-only…"}
            {scene === "DETECT" && "› 7 leaks · est. $4.2M / yr"}
            {scene === "DEPLOY" && "› deploying agents…"}
            {scene === "RECOVER" && "› recovered $4.2M annualized"}
          </span>
          <span className="ml-auto inline-block h-3 w-1.5 animate-blink bg-emerald-400 align-middle" />
        </div>
      </div>

      {/* Floating accent chip */}
      <div className="absolute -bottom-4 -right-3 hidden rounded-xl border border-white/10 bg-[#0B1018]/90 px-3.5 py-2 shadow-[0_12px_32px_-8px_rgba(8,16,30,0.6)] backdrop-blur md:block">
        <div className="flex items-center gap-2">
          <span className="flex h-7 w-7 items-center justify-center rounded-md bg-emerald-500/15 text-emerald-300">
            <TrendingUp className="h-3.5 w-3.5" />
          </span>
          <div>
            <div className="font-mono text-[9px] uppercase tracking-[0.13em] text-slate-500">First impact</div>
            <div className="text-sm text-white">12 weeks</div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* Headline counter that swaps target by scene */
function CountingValue({ scene, reduce }: { scene: Scene; reduce: boolean }) {
  const target = scene === "SCAN" || scene === "DETECT" ? 4.2 : 4218704;
  const isBig = target > 1000;
  const [n, setN] = useState(reduce ? target : 0);
  const raf = useRef(0);

  useEffect(() => {
    if (reduce) {
      setN(target);
      return;
    }
    const from = 0;
    const start = performance.now();
    const dur = 1400;
    const tick = (t: number) => {
      const p = Math.min(1, (t - start) / dur);
      const eased = 1 - Math.pow(1 - p, 3);
      setN(from + (target - from) * eased);
      if (p < 1) raf.current = requestAnimationFrame(tick);
    };
    raf.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf.current);
  }, [scene, target, reduce]);

  return (
    <div className="font-display text-3xl font-semibold tracking-tight text-white tabular-nums">
      {isBig ? `$${Math.round(n).toLocaleString()}` : `$${n.toFixed(1)}M`}
    </div>
  );
}
