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

/**
 * Generates static routes for all resource slugs at build time.
 * Next.js pre-renders every /resources/[slug] page as static HTML.
 * This is important for SEO — crawlers get the full page immediately,
 * not a loading skeleton.
 */
export function generateStaticParams() {
  return RESOURCES.map((r) => ({ slug: r.slug }));
}

/**
 * Per-page metadata — unique title and description for every resource.
 * This is what Google shows in search results for each page.
 */
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
      url: `https://avishkar.ai/resources/${resource.slug}`,
      type: "article",
      publishedTime: resource.publishedAt,
    },
  };
}

const ACCENT_COLORS = {
  cyan:    { text: "text-cyan-300",    bg: "bg-cyan-400/[0.08]",    border: "border-cyan-400/20"    },
  emerald: { text: "text-emerald-300", bg: "bg-emerald-400/[0.08]", border: "border-emerald-400/20" },
  violet:  { text: "text-violet-300",  bg: "bg-violet-400/[0.08]",  border: "border-violet-400/20"  },
  amber:   { text: "text-amber-300",   bg: "bg-amber-400/[0.08]",   border: "border-amber-400/20"   },
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
          <div className="absolute inset-0 bg-[radial-gradient(60%_40%_at_50%_0%,rgba(34,211,238,0.07)_0%,transparent_100%)]" />
        </div>

        <div className="mx-auto max-w-3xl px-6">
          {/* Back link */}
          <Link
            href="/resources"
            className="mb-8 inline-flex items-center gap-1.5 text-[13px] text-white/50 transition-colors hover:text-white"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            All resources
          </Link>

          {/* Meta row */}
          <div className="mb-4 flex flex-wrap items-center gap-3 text-[12px] text-white/40">
            <span className="inline-flex items-center gap-1.5">
              <Calendar className="h-3.5 w-3.5" />
              {new Date(resource.publishedAt).toLocaleDateString("en-US", {
                year: "numeric", month: "long", day: "numeric",
              })}
            </span>
            <span className="h-1 w-1 rounded-full bg-white/20" />
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
          <p className="mt-6 text-[16px] leading-relaxed text-white/65">
            {resource.intro}
          </p>

          {/* Divider */}
          <div className="mt-10 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
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
                  <h2 className="mb-4 font-display text-xl font-medium tracking-tight text-white sm:text-2xl">
                    {section.heading}
                  </h2>

                  {/* Body text */}
                  {section.body && (
                    <p className="mb-5 text-[15px] leading-relaxed text-white/65">
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
                            <div className="mt-1 text-[12px] text-white/55">{s.label}</div>
                            {s.note && (
                              <div className="mt-1 text-[11px] text-white/35">{s.note}</div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  )}

                  {/* Data table */}
                  {section.table && (
                    <div className="mb-6 overflow-x-auto rounded-2xl border border-white/[0.06]">
                      <table className="w-full border-collapse text-[13.5px]">
                        <thead>
                          <tr className="border-b border-white/[0.06] bg-white/[0.03]">
                            {section.table.headers.map((h) => (
                              <th
                                key={h}
                                className="px-4 py-3 text-left font-medium text-white/70"
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
                              className="border-b border-white/[0.04] transition-colors hover:bg-white/[0.02]"
                            >
                              <td className="px-4 py-3 font-medium text-white/85">
                                {row.label}
                              </td>
                              <td className="px-4 py-3 text-cyan-300 font-medium">
                                {row.value}
                              </td>
                              {row.note && (
                                <td className="px-4 py-3 text-white/50">{row.note}</td>
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
                          className="flex items-start gap-3 text-[14.5px] leading-relaxed text-white/65"
                        >
                          <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-cyan-400" />
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
                          ? "border-cyan-400/20 bg-cyan-400/[0.05]"
                          : section.callout.type === "warning"
                          ? "border-amber-400/20 bg-amber-400/[0.05]"
                          : "border-emerald-400/20 bg-emerald-400/[0.05]"
                      )}
                    >
                      {section.callout.type === "insight" && (
                        <Lightbulb className="mt-0.5 h-4 w-4 shrink-0 text-cyan-300" />
                      )}
                      {section.callout.type === "warning" && (
                        <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-amber-300" />
                      )}
                      {section.callout.type === "cta" && (
                        <TrendingUp className="mt-0.5 h-4 w-4 shrink-0 text-emerald-300" />
                      )}
                      <p
                        className={cn(
                          "text-[13.5px] leading-relaxed",
                          section.callout.type === "insight"
                            ? "text-cyan-100/80"
                            : section.callout.type === "warning"
                            ? "text-amber-100/80"
                            : "text-emerald-100/80"
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
              <p className="mt-3 text-[15px] leading-relaxed text-white/60">
                {resource.cta.body}
              </p>
              <div className="mt-6 flex flex-wrap gap-3">
                <Link
                  href={resource.cta.primaryHref}
                  className="inline-flex items-center gap-2 rounded-full bg-white px-5 py-2.5 text-sm font-medium text-ink-950 shadow-[0_0_0_1px_rgba(255,255,255,0.5),0_10px_40px_-10px_rgba(34,211,238,0.6)] transition-transform hover:-translate-y-px"
                >
                  {resource.cta.primaryLabel}
                  <ArrowRight className="h-4 w-4" />
                </Link>
                {resource.cta.secondaryLabel && resource.cta.secondaryHref && (
                  <Link
                    href={resource.cta.secondaryHref}
                    className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/[0.04] px-5 py-2.5 text-sm font-medium text-white transition-colors hover:border-white/30"
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
                <div className="mb-4 font-mono text-[11px] uppercase tracking-[0.16em] text-white/40">
                  Related resources
                </div>
                <div className="space-y-2">
                  {resource.relatedLinks.map((l) => (
                    <Link
                      key={l.href}
                      href={l.href}
                      className="flex items-center gap-2 text-[14px] text-white/60 transition-colors hover:text-cyan-300"
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
