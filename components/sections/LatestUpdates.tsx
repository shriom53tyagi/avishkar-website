"use client";

import { Reveal } from "@/components/ui/Reveal";
import { AnimatedNumber } from "@/components/ui/AnimatedNumber";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { DuotonePhoto } from "@/components/ui/DuotonePhoto";

const UPDATES = [
  {
    id: "denial-rate",
    value: 61,
    prefix: "−",
    suffix: "%",
    label: "Denial rate reduction",
    note: "Within the first 120 days of deployment",
  },
  {
    id: "admin-workload",
    value: 74,
    prefix: "",
    suffix: "%",
    label: "Admin workload reduction",
    note: "Measured across the 2025 audit cohort",
  },
  {
    id: "annual-recovery",
    value: 4.2,
    prefix: "$",
    suffix: "M+",
    label: "Average annual recovery identified",
    note: "Every figure comes from the client's own systems",
  },
  {
    id: "time-to-impact",
    value: 12,
    prefix: "",
    suffix: " wks",
    label: "Time to first measurable impact",
    note: "Median across engagements to date",
  },
] as const;

export function LatestUpdates({ showHeading = true }: { showHeading?: boolean }) {
  return (
    <section id="results" className="bg-canvas py-28 sm:py-36 lg:py-44">
      <div className="mx-auto max-w-6xl px-6">
        {showHeading && (
          <SectionHeading
            eyebrow="Latest results"
            align="left"
            title="The audit found it. The agents recovered it."
            description="Real outcomes from engagements to date — no benchmarks, no estimates."
            className="mb-16 max-w-2xl"
          />
        )}

        <div className="grid gap-5 sm:grid-cols-2">
          {UPDATES.map((u, i) => (
            <Reveal key={u.label} delay={i * 0.07}>
              <div id={u.id} className="h-full scroll-mt-28 rounded-lg border border-line bg-surface p-7">
                <div className="text-h1 font-bold leading-none tracking-tight text-accent">
                  <AnimatedNumber value={u.value} prefix={u.prefix || undefined} suffix={u.suffix} />
                </div>
                <p className="mt-3 text-small font-medium text-ink">{u.label}</p>
                <p className="mt-1 text-small text-ink-subtle">{u.note}</p>
              </div>
            </Reveal>
          ))}
        </div>

        <Reveal delay={0.3}>
          <div className="mt-5 overflow-hidden rounded-lg border border-line bg-surface p-6 md:p-8">
            <div className="flex flex-col gap-6 md:flex-row md:items-center md:gap-8">
              <DuotonePhoto
                src="https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&w=400&q=80"
                alt="Healthcare finance executive"
                className="h-20 w-20 shrink-0"
                rounded="rounded-lg"
                sizes="80px"
              />
              <p className="flex-1 text-body italic leading-relaxed text-ink-muted">
                "We identified $1.1M in leakage in 3 weeks and recovered $800K within Q1.
                The diagnosis paid for itself before a single agent went live."
              </p>
              <div className="shrink-0 rounded-lg border border-line bg-alt p-4 text-center">
                <div className="text-h2 font-bold text-accent">$800K</div>
                <div className="mt-0.5 text-small font-medium text-ink-muted">Recovered Q1</div>
                <div className="mt-0.5 text-label text-ink-subtle">CFO, 180-bed hospital</div>
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
