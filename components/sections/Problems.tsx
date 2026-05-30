"use client";

import { AlertTriangle, FileWarning, ShieldAlert } from "lucide-react";
import { motion } from "framer-motion";
import { GridBackground } from "@/components/ui/GridBackground";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal } from "@/components/ui/Reveal";
import { PROBLEMS } from "@/lib/data";
import { cn } from "@/lib/utils";

const severityMap = {
  critical: { ring: "ring-rose-400/30", text: "text-rose-300", icon: ShieldAlert, label: "CRITICAL" },
  high: { ring: "ring-amber-400/30", text: "text-amber-300", icon: AlertTriangle, label: "HIGH" },
  medium: { ring: "ring-cyan-400/30", text: "text-cyan-300", icon: FileWarning, label: "MEDIUM" },
} as const;

export function Problems() {
  return (
    <section id="problems" className="relative py-24 sm:py-32">
      <GridBackground variant="dots" />

      <div className="mx-auto max-w-7xl px-6">
        <SectionHeading
          eyebrow="The signal beneath the noise"
          title={
            <>
              Healthcare operations are quietly{" "}
              <span className="text-gradient-cyan">leaking value</span> every minute.
            </>
          }
          description="Every clinic, hospital and provider group runs on a stack of EMRs, schedulers, phones, portals and humans. The friction between them is where the money goes."
        />

        <div className="mt-14 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {PROBLEMS.map((p, i) => {
            const sev = severityMap[p.severity as keyof typeof severityMap];
            const Icon = sev.icon;
            return (
              <Reveal key={p.code} delay={i * 0.06}>
                <motion.div
                  whileHover={{ y: -4 }}
                  transition={{ duration: 0.4 }}
                  className="group relative h-full overflow-hidden rounded-2xl border border-white/[0.06] bg-gradient-to-b from-white/[0.04] to-white/[0.01] p-5 backdrop-blur"
                >
                  <div className="pointer-events-none absolute inset-0 -z-10 opacity-0 transition-opacity duration-500 group-hover:opacity-100">
                    <div className="absolute inset-0 bg-[radial-gradient(60%_60%_at_50%_0%,rgba(34,211,238,0.10),transparent_70%)]" />
                  </div>

                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-2">
                      <div
                        className={cn(
                          "flex h-9 w-9 items-center justify-center rounded-lg ring-1",
                          sev.ring,
                          "bg-white/[0.04]"
                        )}
                      >
                        <Icon className={cn("h-4 w-4", sev.text)} />
                      </div>
                      <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-white/40">
                        {p.code}
                      </span>
                    </div>
                    <span
                      className={cn(
                        "rounded-full border px-2 py-0.5 font-mono text-[9px] uppercase tracking-[0.16em]",
                        p.severity === "critical" &&
                          "border-rose-400/30 bg-rose-400/[0.06] text-rose-300",
                        p.severity === "high" &&
                          "border-amber-400/30 bg-amber-400/[0.06] text-amber-300",
                        p.severity === "medium" &&
                          "border-cyan-400/30 bg-cyan-400/[0.06] text-cyan-300"
                      )}
                    >
                      {sev.label}
                    </span>
                  </div>

                  <div className="mt-5">
                    <h3 className="font-display text-lg font-medium tracking-tight text-white">
                      {p.title}
                    </h3>
                    <p className="mt-2 text-sm leading-relaxed text-white/55">{p.detail}</p>
                  </div>

                  <div className="mt-5 flex items-end justify-between">
                    <div>
                      <div className="font-mono text-[10px] uppercase tracking-[0.16em] text-white/40">
                        Estimated impact
                      </div>
                      <div className={cn("font-display text-2xl font-medium tracking-tight", sev.text)}>
                        {p.metric}
                      </div>
                    </div>
                    <ImpactBars severity={p.severity} />
                  </div>

                  <div className="pointer-events-none absolute -right-px -top-px h-px w-24 bg-gradient-to-l from-cyan-400/40 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
                </motion.div>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}

function ImpactBars({ severity }: { severity: "critical" | "high" | "medium" }) {
  const fill = severity === "critical" ? 9 : severity === "high" ? 7 : 5;
  const color =
    severity === "critical"
      ? "bg-rose-400"
      : severity === "high"
        ? "bg-amber-400"
        : "bg-cyan-400";
  return (
    <div className="flex items-end gap-[2px]">
      {Array.from({ length: 10 }).map((_, i) => (
        <span
          key={i}
          className={cn(
            "w-[3px] rounded-sm transition-all",
            i < fill ? color : "bg-white/10"
          )}
          style={{ height: `${6 + i * 1.6}px` }}
        />
      ))}
    </div>
  );
}
