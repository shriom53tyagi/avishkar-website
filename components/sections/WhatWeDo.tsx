"use client";

import { ClipboardList, CalendarClock, Receipt, ShieldCheck } from "lucide-react";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { cn } from "@/lib/utils";

const CARDS = [
  {
    id: "operational-audit",
    icon: ClipboardList,
    title: "Operational audit",
    description:
      "A fixed-scope, read-only review of your EMR, billing, and scheduling that quantifies exactly where revenue is leaking — before anything is automated.",
    live: false,
  },
  {
    id: "patient-access-agent",
    icon: CalendarClock,
    title: "Patient access agent",
    description:
      "Scheduling and voice AI that reduces no-shows and keeps your calendar full, deployed only where the audit shows it pays off.",
    live: true,
  },
  {
    id: "revenue-recovery-agent",
    icon: Receipt,
    title: "Revenue recovery agent",
    description:
      "Billing and insurance automation that cuts denial rates and captures revenue your team doesn't have time to chase.",
    live: true,
  },
  {
    id: "security-compliance",
    icon: ShieldCheck,
    title: "Security & compliance",
    description:
      "HIPAA-aligned, read-only by default, with a human in the loop at every step. Your data stays yours.",
    live: false,
  },
] as const;

export function WhatWeDo({ showHeading = true }: { showHeading?: boolean }) {
  return (
    <section id="what-we-do" className="bg-canvas py-28 sm:py-36 lg:py-44">
      <div className="mx-auto max-w-6xl px-6">
        {showHeading && (
          <SectionHeading
            eyebrow="What we do"
            align="left"
            title="Diagnose first. Deploy only where it pays."
            description="Every engagement starts with a structured audit — not a sales pitch for automation. Agents are switched on only once the numbers prove they're worth it."
            className="mb-16 max-w-2xl"
          />
        )}

        <div className="grid gap-5 sm:grid-cols-2">
          {CARDS.map((c, i) => {
            const Icon = c.icon;
            return (
              <Reveal key={c.title} delay={i * 0.07}>
                <div id={c.id} className="card flex h-full scroll-mt-28 flex-col p-7">
                  <div className="flex items-center justify-between">
                    <span className="flex h-11 w-11 items-center justify-center rounded-lg border border-line bg-accent-tint text-accent">
                      <Icon className="h-5 w-5" />
                    </span>
                    {c.live && (
                      <span className="flex items-center gap-1.5 text-label font-medium text-ink-subtle">
                        <span className={cn("relative flex h-1.5 w-1.5")}>
                          <span className="absolute inset-0 rounded-full bg-positive" />
                          <span className="absolute inset-0 animate-ping rounded-full bg-positive" />
                        </span>
                        Live
                      </span>
                    )}
                  </div>
                  <h3 className="mt-5 text-h3 font-serif font-normal tracking-[-0.01em] text-ink">{c.title}</h3>
                  <p className="mt-2 flex-1 text-small leading-relaxed text-ink-muted">
                    {c.description}
                  </p>
                </div>
              </Reveal>
            );
          })}
        </div>

        {/* Real product video, quiet frame */}
        <Reveal delay={0.28}>
          <div className="mt-14 overflow-hidden rounded-lg border border-line bg-alt p-3 sm:p-5">
            <div className="mx-auto max-w-4xl overflow-hidden rounded-lg border border-line">
              <video
                className="block h-auto w-full"
                autoPlay
                muted
                loop
                playsInline
                preload="metadata"
                aria-label="Avishkar AI product demo"
              >
                <source src="/hero-demo.mp4" type="video/mp4" />
              </video>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
