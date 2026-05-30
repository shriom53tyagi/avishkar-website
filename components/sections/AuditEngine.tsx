"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import {
  Cable,
  Search,
  Workflow,
  TrendingDown,
  Wand2,
  Rocket,
} from "lucide-react";
import { GridBackground } from "@/components/ui/GridBackground";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { StatusDot } from "@/components/ui/StatusDot";
import { AUDIT_STEPS } from "@/lib/data";
import { cn } from "@/lib/utils";

const ICONS = [Cable, Workflow, Search, TrendingDown, Wand2, Rocket];

const TERMINAL_LINES: string[] = [
  "› avishkar audit init --org riveroak-clinic",
  "↻ connecting [Athena, Twilio, Stripe, Salesforce, Epic]...",
  "✔ ingest 2.4M events · 412k patient records · 198k calls",
  "↻ reconstructing operational graph...",
  "✔ 312 nodes · 1,184 edges · 27 hand-off seams",
  "↻ scanning for inefficiencies...",
  "⚠  no-show recovery: 31% gap vs benchmark",
  "⚠  voice queue: P95 hold = 4m 38s · drop-off 47%",
  "⚠  denial triage: 412 unworked · est. $612k",
  "↻ predicting revenue impact...",
  "✔ leakage map · 7 priorities · est. $4,218,704 / yr",
  "↻ proposing agent map...",
  "✔ 6 agents · staging plan · 21d to first deploy",
  "› ready to deploy · awaiting your approval _",
];

export function AuditEngine() {
  return (
    <section id="engine" className="relative py-24 sm:py-32">
      <GridBackground />

      <div className="mx-auto max-w-7xl px-6">
        <SectionHeading
          eyebrow="The audit engine"
          title={
            <>
              We don't deliver decks.{" "}
              <span className="text-gradient-cyan">We deliver a live model</span> of your operations.
            </>
          }
          description="The Avishkar audit engine connects to your systems, reconstructs how your organization actually runs, and quantifies every dollar leaking through it — before we propose a single line of automation."
        />

        <div className="mt-14 grid gap-8 lg:grid-cols-[1fr_1.05fr]">
          {/* Left: pipeline */}
          <div className="relative">
            <div className="surface relative overflow-hidden rounded-2xl p-5">
              {/* scanning beam */}
              <div className="pointer-events-none absolute inset-x-0 top-0 h-full overflow-hidden">
                <div className="absolute inset-x-0 h-32 animate-scan-y bg-[linear-gradient(180deg,transparent,rgba(34,211,238,0.10),transparent)]" />
              </div>

              <div className="mb-4 flex items-center justify-between">
                <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-white/45">
                  audit.pipeline / step-flow
                </span>
                <StatusDot tone="live" label="scanning" />
              </div>

              <ol className="relative space-y-3 pl-8">
                {/* connecting line */}
                <div className="absolute left-[15px] top-2 h-[calc(100%-1rem)] w-px bg-gradient-to-b from-cyan-400/60 via-white/10 to-violet-400/40" />
                {AUDIT_STEPS.map((s, i) => {
                  const Icon = ICONS[i] ?? Workflow;
                  return (
                    <motion.li
                      key={s.id}
                      initial={{ opacity: 0, x: -8 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true, margin: "-10% 0px" }}
                      transition={{ duration: 0.5, delay: 0.05 * i }}
                      className="group relative rounded-xl border border-white/[0.06] bg-white/[0.02] p-3.5 transition-colors hover:border-cyan-400/20 hover:bg-cyan-400/[0.03]"
                    >
                      <span className="absolute -left-8 top-3 flex h-7 w-7 items-center justify-center rounded-full border border-white/10 bg-ink-900 text-cyan-300 shadow-[0_0_0_4px_var(--bg)]">
                        <Icon className="h-3.5 w-3.5" />
                      </span>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <span className="font-mono text-[10px] uppercase tracking-[0.16em] text-white/40">
                            STEP {s.id}
                          </span>
                          <h3 className="text-[15px] font-medium tracking-tight text-white">
                            {s.label}
                          </h3>
                        </div>
                        <span className="font-mono text-[10px] uppercase tracking-[0.16em] text-emerald-400/85">
                          OK
                        </span>
                      </div>
                      <p className="mt-1 text-sm leading-relaxed text-white/55">{s.detail}</p>
                    </motion.li>
                  );
                })}
              </ol>
            </div>

            {/* small chips below */}
            <div className="mt-4 flex flex-wrap gap-2">
              {[
                "Athena",
                "Epic",
                "Cerner",
                "Twilio",
                "Salesforce Health",
                "Salesforce",
                "Snowflake",
                "Stripe",
                "Slack",
              ].map((s) => (
                <span
                  key={s}
                  className="rounded-full border border-white/[0.08] bg-white/[0.02] px-2.5 py-1 font-mono text-[10px] uppercase tracking-[0.14em] text-white/55"
                >
                  {s}
                </span>
              ))}
              <span className="rounded-full border border-cyan-400/20 bg-cyan-400/[0.06] px-2.5 py-1 font-mono text-[10px] uppercase tracking-[0.14em] text-cyan-300">
                + 80 more
              </span>
            </div>
          </div>

          {/* Right: terminal + cards */}
          <div className="grid gap-5">
            <Terminal />
            <RevenueLeakCard />
          </div>
        </div>
      </div>
    </section>
  );
}

function Terminal() {
  const [printed, setPrinted] = useState<string[]>([]);

  useEffect(() => {
    let alive = true;
    let i = 0;
    let buf = "";
    let charIdx = 0;
    const tick = () => {
      if (!alive) return;
      const line = TERMINAL_LINES[i];
      if (!line) {
        setTimeout(() => {
          if (!alive) return;
          i = 0;
          buf = "";
          charIdx = 0;
          setPrinted([]);
          tick();
        }, 3500);
        return;
      }
      if (charIdx < line.length) {
        buf += line[charIdx];
        charIdx++;
        setPrinted((p) => {
          const next = [...p];
          next[i] = buf;
          return next;
        });
        setTimeout(tick, 18 + Math.random() * 30);
      } else {
        i++;
        buf = "";
        charIdx = 0;
        setTimeout(tick, 220);
      }
    };
    tick();
    return () => {
      alive = false;
    };
  }, []);

  return (
    <div className="surface relative overflow-hidden rounded-2xl">
      <div className="flex items-center justify-between border-b border-white/[0.06] px-4 py-2.5">
        <div className="flex items-center gap-2">
          <span className="h-2.5 w-2.5 rounded-full bg-rose-400/70" />
          <span className="h-2.5 w-2.5 rounded-full bg-amber-400/70" />
          <span className="h-2.5 w-2.5 rounded-full bg-emerald-400/70" />
        </div>
        <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-white/40">
          ~/avishkar/audit.run
        </span>
        <span />
      </div>
      <div className="max-h-[360px] overflow-hidden p-4">
        <pre className="whitespace-pre-wrap break-words font-mono text-[12.5px] leading-[1.7]">
          {printed.map((line, i) => (
            <div key={i}>
              <Line line={line} />
            </div>
          ))}
          <span className="inline-block h-3 w-1.5 align-middle bg-cyan-400 animate-blink" />
        </pre>
      </div>
    </div>
  );
}

function Line({ line }: { line: string }) {
  if (line.startsWith("✔"))
    return <span className="text-emerald-400/90">{line}</span>;
  if (line.startsWith("⚠"))
    return <span className="text-amber-300/90">{line}</span>;
  if (line.startsWith("↻"))
    return <span className="text-cyan-300/90">{line}</span>;
  if (line.startsWith("›"))
    return <span className="text-white/85">{line}</span>;
  return <span className="text-white/65">{line}</span>;
}

function RevenueLeakCard() {
  const leaks = [
    { name: "No-show & late-cancel", value: 1_840_000, pct: 44 },
    { name: "Denials & undercoding", value: 1_120_000, pct: 27 },
    { name: "Voice drop-off", value: 612_000, pct: 14 },
    { name: "Eligibility gaps", value: 396_000, pct: 9 },
    { name: "Documentation rework", value: 250_704, pct: 6 },
  ];
  const total = leaks.reduce((s, l) => s + l.value, 0);

  return (
    <div className="surface relative overflow-hidden rounded-2xl p-5">
      <div className="mb-3 flex items-center justify-between">
        <div>
          <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-white/45">
            leakage map
          </span>
          <div className="mt-1 font-display text-2xl font-medium tracking-tight text-white">
            ${(total / 1_000_000).toFixed(2)}M
            <span className="ml-2 text-sm font-normal text-emerald-400/90">/ yr recovery</span>
          </div>
        </div>
        <span className="rounded-full border border-emerald-400/25 bg-emerald-400/[0.06] px-2.5 py-1 font-mono text-[10px] uppercase tracking-[0.16em] text-emerald-300">
          7 priorities
        </span>
      </div>

      <div className="space-y-3">
        {leaks.map((l, i) => (
          <div key={l.name} className="space-y-1.5">
            <div className="flex items-center justify-between text-xs">
              <span className="text-white/75">{l.name}</span>
              <span className="font-mono text-white/55">${l.value.toLocaleString()}</span>
            </div>
            <div className="relative h-1.5 overflow-hidden rounded-full bg-white/[0.05]">
              <motion.div
                initial={{ width: 0 }}
                whileInView={{ width: `${l.pct}%` }}
                viewport={{ once: true }}
                transition={{ duration: 1.1, delay: i * 0.1, ease: [0.22, 1, 0.36, 1] }}
                className={cn(
                  "absolute inset-y-0 left-0 rounded-full",
                  i === 0 && "bg-gradient-to-r from-rose-400/80 to-rose-300",
                  i === 1 && "bg-gradient-to-r from-amber-400/80 to-amber-300",
                  i === 2 && "bg-gradient-to-r from-cyan-400/80 to-cyan-300",
                  i === 3 && "bg-gradient-to-r from-violet-400/80 to-violet-300",
                  i === 4 && "bg-gradient-to-r from-emerald-400/80 to-emerald-300"
                )}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
