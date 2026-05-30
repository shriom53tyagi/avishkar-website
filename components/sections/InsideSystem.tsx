"use client";

import { motion } from "framer-motion";
import { Lock, ScanLine, Layers, Cpu } from "lucide-react";
import { GridBackground } from "@/components/ui/GridBackground";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { StatusDot } from "@/components/ui/StatusDot";

const PILLARS = [
  {
    icon: Layers,
    title: "Workflow archaeology",
    body: "We don't take org charts at face value. We rebuild how patients, clinicians and data actually flow — to the second.",
  },
  {
    icon: Cpu,
    title: "Environment-specific agents",
    body: "Every agent is shaped to your EMR fields, your phone trees, your billing rules and your team's escalation paths.",
  },
  {
    icon: ScanLine,
    title: "Continuous diagnosis",
    body: "Live scanners watch for drift, regression and new revenue leaks. The audit never really stops — it operates.",
  },
  {
    icon: Lock,
    title: "Healthcare-grade trust",
    body: "BAAs, SOC2-track controls, role-scoped access, full audit trail, opt-in PHI minimization. Trust is the product.",
  },
];

export function InsideSystem() {
  return (
    <section id="system" className="relative py-24 sm:py-32">
      <GridBackground variant="fine" />

      <div className="mx-auto max-w-7xl px-6">
        <SectionHeading
          eyebrow="We go inside your system"
          title={
            <>
              We don't sell generic AI.{" "}
              <span className="text-gradient-cyan">We embed inside your operations.</span>
            </>
          }
          description="Every healthcare org is a unique combination of legacy systems, human routines and clinical realities. Our agents are built for that — not for a brochure."
        />

        <div className="mt-14 grid gap-8 lg:grid-cols-[1.05fr_1fr] lg:items-stretch">
          {/* Architecture visual */}
          <div className="relative">
            <div className="surface relative h-full overflow-hidden rounded-2xl p-5">
              <div className="mb-4 flex items-center justify-between">
                <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-white/45">
                  system / architecture map
                </span>
                <StatusDot tone="live" label="introspection" />
              </div>

              <Architecture />

              <div className="mt-4 grid grid-cols-3 gap-3 text-center">
                {[
                  ["RBAC", "scoped"],
                  ["PHI", "minimized"],
                  ["Logs", "tamper-evident"],
                ].map(([k, v]) => (
                  <div
                    key={k}
                    className="rounded-lg border border-white/[0.06] bg-white/[0.02] p-3"
                  >
                    <div className="font-mono text-[10px] uppercase tracking-[0.16em] text-white/45">
                      {k}
                    </div>
                    <div className="mt-1 text-sm text-white">{v}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Pillars */}
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-1">
            {PILLARS.map((p, i) => {
              const Icon = p.icon;
              return (
                <motion.div
                  key={p.title}
                  initial={{ opacity: 0, y: 12 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-10% 0px" }}
                  transition={{ duration: 0.5, delay: i * 0.07 }}
                  className="group relative overflow-hidden rounded-2xl border border-white/[0.06] bg-white/[0.02] p-5 backdrop-blur transition-colors hover:border-cyan-400/15"
                >
                  <div className="flex items-start gap-4">
                    <div className="relative">
                      <div className="flex h-10 w-10 items-center justify-center rounded-lg border border-cyan-400/20 bg-cyan-400/[0.06] text-cyan-300">
                        <Icon className="h-4 w-4" />
                      </div>
                    </div>
                    <div>
                      <h3 className="font-display text-[17px] font-medium tracking-tight text-white">
                        {p.title}
                      </h3>
                      <p className="mt-1.5 text-sm leading-relaxed text-white/55">{p.body}</p>
                    </div>
                  </div>
                  <div className="pointer-events-none absolute inset-x-0 -bottom-px h-px bg-gradient-to-r from-transparent via-cyan-400/40 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}

function Architecture() {
  const layers = [
    {
      label: "Patient surface",
      detail: "Phones · SMS · Portal · Voice",
      tone: "from-cyan-400/30 to-cyan-400/0",
    },
    {
      label: "Agent fabric",
      detail: "Scheduler · Voice · Follow-up · Billing · Docs",
      tone: "from-violet-400/40 to-violet-400/0",
    },
    {
      label: "Avishkar core",
      detail: "Workflow graph · Memory · Policy · Eval",
      tone: "from-emerald-400/30 to-emerald-400/0",
    },
    {
      label: "Your systems",
      detail: "EMR · Telephony · Billing · Data warehouse",
      tone: "from-white/15 to-white/0",
    },
  ];

  return (
    <div className="relative">
      <div className="pointer-events-none absolute inset-0">
        {/* connecting beams */}
        <svg className="h-full w-full" viewBox="0 0 100 100" preserveAspectRatio="none">
          <defs>
            <linearGradient id="beam" x1="0" x2="0" y1="0" y2="1">
              <stop offset="0%" stopColor="rgba(34,211,238,0.0)" />
              <stop offset="50%" stopColor="rgba(34,211,238,0.45)" />
              <stop offset="100%" stopColor="rgba(34,211,238,0.0)" />
            </linearGradient>
          </defs>
          {[20, 50, 80].map((x) => (
            <line
              key={x}
              x1={x}
              x2={x}
              y1="0"
              y2="100"
              stroke="url(#beam)"
              strokeWidth="0.6"
              strokeDasharray="2 4"
              vectorEffect="non-scaling-stroke"
              className="dash-flow"
            />
          ))}
        </svg>
      </div>

      <div className="relative space-y-3">
        {layers.map((l, i) => (
          <motion.div
            key={l.label}
            initial={{ opacity: 0, scale: 0.98 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: i * 0.12 }}
            className="relative rounded-xl border border-white/[0.08] bg-ink-900/60 p-4 backdrop-blur"
          >
            <div
              className={`pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r ${l.tone}`}
            />
            <div className="flex items-center justify-between">
              <div>
                <div className="font-mono text-[10px] uppercase tracking-[0.18em] text-white/45">
                  Layer {i + 1}
                </div>
                <div className="mt-0.5 font-display text-[15px] font-medium tracking-tight text-white">
                  {l.label}
                </div>
              </div>
              <div className="text-right">
                <div className="text-[12px] text-white/55">{l.detail}</div>
                <div className="mt-1 font-mono text-[10px] uppercase tracking-[0.16em] text-emerald-400/85">
                  scan ok
                </div>
              </div>
            </div>
            {/* mini activity row */}
            <div className="mt-3 flex h-1.5 gap-1">
              {Array.from({ length: 30 }).map((_, j) => (
                <span
                  key={j}
                  className="flex-1 rounded-sm"
                  style={{
                    background:
                      j % 7 === i
                        ? "rgba(34,211,238,0.7)"
                        : j % 5 === 0
                          ? "rgba(167,139,250,0.45)"
                          : "rgba(255,255,255,0.08)",
                  }}
                />
              ))}
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
