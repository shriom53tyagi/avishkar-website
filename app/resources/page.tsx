import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, BookOpen, BarChart2, FileText } from "lucide-react";
import { PageHeader } from "@/components/ui/PageHeader";
import { Reveal } from "@/components/ui/Reveal";
import { RESOURCES, CATEGORY_LABELS } from "@/lib/resources";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Healthcare Operations Resources",
  description:
    "Free guides and benchmark data on healthcare revenue leakage, claim denials, patient no-shows, and operational intelligence. Built for hospital CFOs and clinic operators.",
  openGraph: {
    title: "Healthcare Operations Resources — Avishkar AI",
    description:
      "Benchmarks, guides and calculators covering healthcare revenue leakage, claim denials and patient no-shows.",
    url: "https://avishkar.app/resources",
  },
};

const CATEGORY_ICONS = {
  data: BarChart2,
  guide: FileText,
  pillar: BookOpen,
} as const;

const CATEGORY_COLORS = {
  data: "border-cyan-400/20 bg-cyan-400/[0.06] text-cyan-300",
  guide: "border-violet-400/20 bg-violet-400/[0.06] text-violet-300",
  pillar: "border-emerald-400/20 bg-emerald-400/[0.06] text-emerald-300",
} as const;

export default function ResourcesPage() {
  return (
    <>
      <PageHeader
        eyebrow="Resources"
        title={
          <>
            Healthcare operations{" "}
            <span className="text-gradient-cyan">guides and benchmarks</span>
          </>
        }
        description="Free, data-backed guides covering the operational and financial challenges that drive revenue leakage in hospitals and clinics."
      />

      <section className="relative pb-24 pt-8 sm:pb-32">
        <div className="mx-auto max-w-7xl px-6">

          {/* Category legend */}
          <div className="mb-10 flex flex-wrap gap-3">
            {(Object.entries(CATEGORY_LABELS) as [keyof typeof CATEGORY_LABELS, string][]).map(
              ([key, label]) => {
                const Icon = CATEGORY_ICONS[key];
                return (
                  <span
                    key={key}
                    className={cn(
                      "inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-[12px] font-medium",
                      CATEGORY_COLORS[key]
                    )}
                  >
                    <Icon className="h-3.5 w-3.5" />
                    {label}
                  </span>
                );
              }
            )}
          </div>

          {/* Resource cards grid */}
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {RESOURCES.map((r, i) => {
              const Icon = CATEGORY_ICONS[r.category];
              const colors = CATEGORY_COLORS[r.category];
              return (
                <Reveal key={r.slug} delay={i * 0.04}>
                  <Link
                    href={`/resources/${r.slug}`}
                    className="surface group flex h-full flex-col rounded-2xl p-6 transition-transform duration-300 hover:-translate-y-1"
                  >
                    <div className="mb-4 flex items-center justify-between">
                      <span
                        className={cn(
                          "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[11px] font-medium",
                          colors
                        )}
                      >
                        <Icon className="h-3 w-3" />
                        {CATEGORY_LABELS[r.category]}
                      </span>
                      <span className="text-[11px] text-white/35">{r.readingTime}</span>
                    </div>

                    <h2 className="mb-2 flex-1 text-[15px] font-medium leading-snug text-white group-hover:text-cyan-200 transition-colors">
                      {r.title}
                    </h2>

                    <p className="mb-4 text-[13px] leading-relaxed text-white/50 line-clamp-3">
                      {r.metaDescription}
                    </p>

                    <div className="flex items-center gap-1.5 text-[12px] font-medium text-white/45 group-hover:text-cyan-300 transition-colors">
                      Read guide
                      <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
                    </div>
                  </Link>
                </Reveal>
              );
            })}
          </div>

          {/* Bottom CTA */}
          <Reveal delay={0.15}>
            <div className="surface mt-12 rounded-2xl p-8 text-center">
              <h3 className="font-display text-2xl font-medium tracking-tight text-gradient">
                Ready to quantify your own leakage?
              </h3>
              <p className="mx-auto mt-3 max-w-lg text-[15px] text-white/55">
                The benchmarks above describe typical organizations. An Operational Intelligence Audit
                gives you the exact numbers from your own systems.
              </p>
              <Link
                href="/contact"
                className="mt-6 inline-flex items-center gap-2 rounded-full bg-white px-6 py-2.5 text-sm font-medium text-ink-950 shadow-[0_0_0_1px_rgba(255,255,255,0.5),0_10px_40px_-10px_rgba(34,211,238,0.6)] transition-transform hover:-translate-y-px"
              >
                Book a free operational audit
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}
