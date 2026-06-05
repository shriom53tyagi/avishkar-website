import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowLeft, ArrowRight, Clock, Calendar,
  TrendingUp, AlertTriangle, Lightbulb,
} from "lucide-react";
import { Reveal } from "@/components/ui/Reveal";
import { RESOURCES, getResource } from "@/lib/resources";
import { cn } from "@/lib/utils";

export function generateStaticParams() {
  return RESOURCES.map((r) => ({ slug: r.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const resource = getResource(slug);
  if (!resource) return {};
  return {
    title: resource.metaTitle,
    description: resource.metaDescription,
    openGraph: {
      title: resource.metaTitle,
      description: resource.metaDescription,
      url: `https://avishkar.app/resources/${resource.slug}`,
      type: "article",
      publishedTime: resource.publishedAt,
    },
  };
}

const ACCENT_COLORS = {
  cyan:    { text: "text-cyan-700",    bg: "bg-cyan-50",    border: "border-cyan-200"    },
  emerald: { text: "text-emerald-700", bg: "bg-emerald-50", border: "border-emerald-200" },
  violet:  { text: "text-violet-700",  bg: "bg-violet-50",  border: "border-violet-200"  },
  amber:   { text: "text-amber-700",   bg: "bg-amber-50",   border: "border-amber-200"   },
} as const;

export default async function ResourcePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const resource = getResource(slug);
  if (!resource) notFound();

  return (
    <>
      {/* Article header */}
      <section className="relative overflow-hidden pb-8 pt-36 sm:pt-44">
        <div
          className="pointer-events-none absolute inset-0 -z-10"
          aria-hidden
        >
          <div className="absolute inset-0 bg-[radial-gradient(60%_40%_at_50%_0%,rgba(21,112,239,0.05)_0%,transparent_100%)]" />
        </div>

        <div className="mx-auto max-w-3xl px-6">
          {/* Back link */}
          <Link
            href="/resources"
            className="mb-8 inline-flex items-center gap-1.5 text-[13px] text-slate-400 transition-colors hover:text-slate-900"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            All resources
          </Link>

          {/* Meta row */}
          <div className="mb-4 flex flex-wrap items-center gap-3 text-[12px] text-slate-400">
            <span className="inline-flex items-center gap-1.5">
              <Calendar className="h-3.5 w-3.5" />
              {new Date(resource.publishedAt).toLocaleDateString("en-US", {
                year: "numeric", month: "long", day: "numeric",
              })}
            </span>
            <span className="h-1 w-1 rounded-full bg-slate-300" />
            <span className="inline-flex items-center gap-1.5">
              <Clock className="h-3.5 w-3.5" />
              {resource.readingTime}
            </span>
          </div>

          {/* Headline */}
          <h1 className="font-display text-3xl font-medium leading-tight tracking-tight text-gradient sm:text-4xl md:text-5xl">
            {resource.headline}
          </h1>

          {/* Intro */}
          <p className="mt-6 text-[16px] leading-relaxed text-slate-500">
            {resource.intro}
          </p>

          {/* Divider */}
          <div className="mt-10 h-px bg-gradient-to-r from-transparent via-slate-900/10 to-transparent" />
        </div>
      </section>

      {/* Article body */}
      <section className="pb-24">
        <div className="mx-auto max-w-3xl px-6">
          <div className="space-y-14">
            {resource.sections.map((section, si) => (
              <Reveal key={section.heading} delay={si * 0.03}>
                <div>
                  {/* Section heading */}
                  <h2 className="mb-4 font-display text-xl font-medium tracking-tight text-slate-900 sm:text-2xl">
                    {section.heading}
                  </h2>

                  {/* Body text */}
                  {section.body && (
                    <p className="mb-5 text-[15px] leading-relaxed text-slate-500">
                      {section.body}
                    </p>
                  )}

                  {/* Stats grid */}
                  {section.stats && section.stats.length > 0 && (
                    <div
                      className={cn(
                        "mb-6 grid gap-4",
                        section.stats.length <= 2
                          ? "grid-cols-2"
                          : section.stats.length === 3
                          ? "grid-cols-3"
                          : "grid-cols-2 sm:grid-cols-4"
                      )}
                    >
                      {section.stats.map((s) => {
                        const a = ACCENT_COLORS[s.accent ?? "cyan"];
                        return (
                          <div
                            key={s.label}
                            className={cn(
                              "rounded-2xl border p-4 text-center",
                              a.bg, a.border
                            )}
                          >
                            <div className={cn("font-display text-2xl font-medium", a.text)}>
                              {s.value}
                            </div>
                            <div className="mt-1 text-[12px] text-slate-500">{s.label}</div>
                            {s.note && (
                              <div className="mt-1 text-[11px] text-slate-400">{s.note}</div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  )}

                  {/* Data table */}
                  {section.table && (
                    <div className="mb-6 overflow-x-auto rounded-2xl border border-slate-900/[0.08]">
                      <table className="w-full border-collapse text-[13.5px]">
                        <thead>
                          <tr className="border-b border-slate-900/[0.08] bg-slate-50">
                            {section.table.headers.map((h) => (
                              <th
                                key={h}
                                className="px-4 py-3 text-left font-medium text-slate-600"
                              >
                                {h}
                              </th>
                            ))}
                          </tr>
                        </thead>
                        <tbody>
                          {section.table.rows.map((row, ri) => (
                            <tr
                              key={ri}
                              className="border-b border-slate-900/[0.05] transition-colors hover:bg-slate-50"
                            >
                              <td className="px-4 py-3 font-medium text-slate-700">
                                {row.label}
                              </td>
                              <td className="px-4 py-3 text-cyan-700 font-medium">
                                {row.value}
                              </td>
                              {row.note && (
                                <td className="px-4 py-3 text-slate-500">{row.note}</td>
                              )}
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}

                  {/* Bullet list */}
                  {section.list && section.list.length > 0 && (
                    <ul className="mb-5 space-y-2">
                      {section.list.map((item) => (
                        <li
                          key={item}
                          className="flex items-start gap-3 text-[14.5px] leading-relaxed text-slate-500"
                        >
                          <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-cyan-500" />
                          {item}
                        </li>
                      ))}
                    </ul>
                  )}

                  {/* Callout */}
                  {section.callout && (
                    <div
                      className={cn(
                        "flex gap-3 rounded-2xl border p-4",
                        section.callout.type === "insight"
                          ? "border-cyan-200 bg-cyan-50"
                          : section.callout.type === "warning"
                          ? "border-amber-200 bg-amber-50"
                          : "border-emerald-200 bg-emerald-50"
                      )}
                    >
                      {section.callout.type === "insight" && (
                        <Lightbulb className="mt-0.5 h-4 w-4 shrink-0 text-cyan-700" />
                      )}
                      {section.callout.type === "warning" && (
                        <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-amber-700" />
                      )}
                      {section.callout.type === "cta" && (
                        <TrendingUp className="mt-0.5 h-4 w-4 shrink-0 text-emerald-700" />
                      )}
                      <p
                        className={cn(
                          "text-[13.5px] leading-relaxed",
                          section.callout.type === "insight"
                            ? "text-cyan-700"
                            : section.callout.type === "warning"
                            ? "text-amber-700"
                            : "text-emerald-700"
                        )}
                      >
                        {section.callout.text}
                      </p>
                    </div>
                  )}
                </div>
              </Reveal>
            ))}
          </div>

          {/* CTA block */}
          <Reveal delay={0.1}>
            <div className="surface mt-16 rounded-2xl p-8">
              <h3 className="font-display text-2xl font-medium tracking-tight text-gradient">
                {resource.cta.heading}
              </h3>
              <p className="mt-3 text-[15px] leading-relaxed text-slate-500">
                {resource.cta.body}
              </p>
              <div className="mt-6 flex flex-wrap gap-3">
                <Link
                  href={resource.cta.primaryHref}
                  className="inline-flex items-center gap-2 rounded-full bg-blue-600 px-5 py-2.5 text-sm font-medium text-white shadow-[0_1px_3px_rgba(23,70,219,0.28),0_4px_12px_rgba(23,70,219,0.30),0_16px_48px_-8px_rgba(23,70,219,0.42)] transition-transform hover:-translate-y-px hover:bg-blue-700"
                >
                  {resource.cta.primaryLabel}
                  <ArrowRight className="h-4 w-4" />
                </Link>
                {resource.cta.secondaryLabel && resource.cta.secondaryHref && (
                  <Link
                    href={resource.cta.secondaryHref}
                    className="inline-flex items-center gap-2 rounded-full border border-slate-900/15 bg-slate-50 px-5 py-2.5 text-sm font-medium text-slate-700 transition-colors hover:border-slate-900/30 hover:text-slate-900"
                  >
                    {resource.cta.secondaryLabel}
                  </Link>
                )}
              </div>
            </div>
          </Reveal>

          {/* Related links */}
          {resource.relatedLinks.length > 0 && (
            <Reveal delay={0.1}>
              <div className="mt-10">
                <div className="mb-4 font-mono text-[11px] uppercase tracking-[0.16em] text-slate-400">
                  Related resources
                </div>
                <div className="space-y-2">
                  {resource.relatedLinks.map((l) => (
                    <Link
                      key={l.href}
                      href={l.href}
                      className="flex items-center gap-2 text-[14px] text-slate-500 transition-colors hover:text-blue-600"
                    >
                      <ArrowRight className="h-3.5 w-3.5 shrink-0" />
                      {l.label}
                    </Link>
                  ))}
                </div>
              </div>
            </Reveal>
          )}
        </div>
      </section>
    </>
  );
}
