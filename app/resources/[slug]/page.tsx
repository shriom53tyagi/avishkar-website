import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { RESOURCES, getResource } from "@/lib/resources";
import { CTA } from "@/lib/content";
import { SITE_URL } from "@/lib/site";
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
    alternates: { canonical: `/resources/${resource.slug}` },
    openGraph: {
      title: resource.metaTitle,
      description: resource.metaDescription,
      url: `${SITE_URL}/resources/${resource.slug}`,
      type: "article",
      publishedTime: resource.publishedAt,
    },
  };
}

/** Callout tone maps onto the two state colors — no third accent. */
const CALLOUT_TONES = {
  insight: "border-line-strong bg-surface text-ink-muted",
  warning: "border-attention/30 bg-attention-tint text-attention",
  cta: "border-positive/30 bg-positive-tint text-positive",
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
      <section className="border-b border-line bg-canvas pb-14 pt-14 md:pb-16 md:pt-20">
        <Container>
          <div className="max-w-measure">
            <Link
              href="/resources"
              className="text-small text-ink-subtle transition-colors hover:text-ink"
            >
              <span aria-hidden>&larr;</span> All resources
            </Link>

            <div className="mt-8 flex flex-wrap items-center gap-3 text-label text-ink-subtle">
              <span>
                {new Date(resource.publishedAt).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </span>
              <span aria-hidden>·</span>
              <span>{resource.readingTime}</span>
            </div>

            <h1 className="mt-4 text-h1 font-serif font-light tracking-[-0.02em] text-ink">{resource.headline}</h1>
            <p className="mt-5 text-lead text-ink-muted">{resource.intro}</p>
          </div>
        </Container>
      </section>

      <Container>
        <div className="max-w-measure py-14 md:py-20">
          <div className="space-y-14">
            {resource.sections.map((section) => (
              <section key={section.heading}>
                <h2 className="text-h2 font-serif font-light tracking-[-0.02em] text-ink">{section.heading}</h2>

                {section.body && (
                  <p className="mt-4 text-body text-ink-muted">{section.body}</p>
                )}

                {section.stats && section.stats.length > 0 && (
                  <dl
                    className={cn(
                      "mt-6 grid gap-x-8 gap-y-6",
                      section.stats.length <= 2 ? "grid-cols-2" : "grid-cols-2 sm:grid-cols-4"
                    )}
                  >
                    {section.stats.map((stat) => (
                      <div key={stat.label} className="border-t border-line-strong pt-3">
                        <dt className="text-h3 font-serif font-normal tracking-[-0.01em] text-ink">{stat.value}</dt>
                        <dd className="mt-1 text-small text-ink-muted">
                          {stat.label}
                          {stat.note && (
                            <span className="block text-ink-subtle">{stat.note}</span>
                          )}
                        </dd>
                      </div>
                    ))}
                  </dl>
                )}

                {section.table && (
                  <div className="mt-6 overflow-x-auto rounded border border-line">
                    <table className="w-full border-collapse text-small">
                      <thead>
                        <tr className="border-b border-line bg-alt text-left">
                          {section.table.headers.map((header) => (
                            <th key={header} className="px-4 py-3 font-medium text-ink">
                              {header}
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {section.table.rows.map((row) => (
                          <tr key={row.label} className="border-b border-line last:border-0">
                            <td className="px-4 py-3 font-medium text-ink">{row.label}</td>
                            <td className="px-4 py-3 text-ink-muted">{row.value}</td>
                            {row.note && (
                              <td className="px-4 py-3 text-ink-subtle">{row.note}</td>
                            )}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}

                {section.list && section.list.length > 0 && (
                  <ul className="mt-6 space-y-3">
                    {section.list.map((item) => (
                      <li
                        key={item}
                        className="border-t border-line pt-3 text-small text-ink-muted"
                      >
                        {item}
                      </li>
                    ))}
                  </ul>
                )}

                {section.callout && (
                  <p
                    className={cn(
                      "mt-6 rounded border p-4 text-small",
                      CALLOUT_TONES[section.callout.type]
                    )}
                  >
                    {section.callout.text}
                  </p>
                )}
              </section>
            ))}
          </div>

          <div className="mt-16 rounded border border-line-strong bg-surface p-8">
            <h2 className="text-h3 font-serif font-normal tracking-[-0.01em] text-ink">{resource.cta.heading}</h2>
            <p className="mt-3 text-small text-ink-muted">{resource.cta.body}</p>
            <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-4">
              <Button href="/contact">{CTA.book}</Button>
              <Button href="/agents" variant="secondary">
                {CTA.seeWork}
              </Button>
            </div>
          </div>

          {resource.relatedLinks.length > 0 && (
            <div className="mt-12">
              <p className="eyebrow">Related resources</p>
              <ul className="mt-4 space-y-3">
                {resource.relatedLinks.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-small text-ink-muted transition-colors hover:text-ink"
                    >
                      {link.label} <span aria-hidden>&rarr;</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </Container>
    </>
  );
}
