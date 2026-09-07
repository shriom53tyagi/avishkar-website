import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { PageHeader } from "@/components/ui/PageHeader";
import { Section } from "@/components/ui/Section";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { AGENTS, getAgent, getRelated } from "@/lib/agents";
import { AGENTS_PAGE, CTA } from "@/lib/content";

export function generateStaticParams() {
  return AGENTS.map((agent) => ({ slug: agent.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const agent = getAgent(slug);
  if (!agent) return {};

  return {
    title: agent.name,
    description: agent.oneLiner,
    alternates: { canonical: `/agents/${agent.slug}` },
    openGraph: {
      title: `${agent.name} · Avishkar`,
      description: agent.oneLiner,
      url: `/agents/${agent.slug}`,
    },
  };
}

export default async function AgentPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const agent = getAgent(slug);
  if (!agent) notFound();

  const live = agent.status === "live";
  const related = getRelated(agent);

  return (
    <>
      <PageHeader
        eyebrow={`${agent.category} · ${live ? "Available to explore" : "In development"}`}
        title={agent.name}
        description={agent.oneLiner}
      >
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-4">
          {live && agent.demoUrl ? (
            <>
              <Button href={agent.demoUrl}>{CTA.tryAgent}</Button>
              <Button href="/contact" variant="secondary">
                {CTA.book}
              </Button>
            </>
          ) : (
            <Button href="/contact">{CTA.book}</Button>
          )}
        </div>
        {live && !agent.demoUrl && (
          <p className="mt-4 text-small text-ink-subtle">
            This agent is running today. We walk you through it live on a call while the
            self-serve version is being finished.
          </p>
        )}
      </PageHeader>

      <Section tone="canvas">
        <div className="grid gap-12 lg:grid-cols-[minmax(0,7fr)_minmax(0,5fr)] lg:gap-20">
          <div>
            <h2 className="text-h3 text-ink">What it does</h2>
            <p className="mt-3 max-w-measure text-body text-ink-muted">{agent.what}</p>

            <h2 className="mt-12 text-h3 text-ink">What you get</h2>
            <dl className="mt-5 space-y-6">
              {agent.outputs.map((output) => (
                <div key={output.label} className="border-t border-line pt-4">
                  <dt className="text-small font-semibold text-ink">{output.label}</dt>
                  <dd className="mt-1.5 max-w-measure text-small text-ink-muted">
                    {output.detail}
                  </dd>
                </div>
              ))}
            </dl>
          </div>

          <div>
            <h2 className="text-h3 text-ink">What it analyzes</h2>
            <ul className="mt-5 space-y-3">
              {agent.analyzes.map((item) => (
                <li key={item} className="border-t border-line pt-3 text-small text-ink-muted">
                  {item}
                </li>
              ))}
            </ul>
            <p className="mt-6 text-small text-ink-subtle">
              We work with the systems that already hold this data, and only the fields the
              analysis needs.
            </p>
          </div>
        </div>
      </Section>

      <div className="border-t border-line bg-alt py-16 md:py-20">
        <Container>
          <div className="max-w-measure">
            <h2 className="text-h2 text-ink">
              {live
                ? "Want this connected to your practice?"
                : `Need the ${agent.name} sooner?`}
            </h2>
            <p className="mt-4 text-lead text-ink-muted">
              {live
                ? "We'll walk you through it on a live call, then look at what it would take to run on your own data. If this isn't quite the problem, that's useful too — most of what we build starts from a conversation, not a catalogue."
                : "This one is in development. If it's the problem you're trying to solve, tell us — that's how work gets prioritized."}
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-4">
              <Button href="/contact">{CTA.book}</Button>
              <Button href="/agents" variant="secondary">
                {CTA.explore}
              </Button>
            </div>

            {/* Social posts link straight here, so this page carries the
                positioning too: an agent is a sample, not the offering. */}
            <p className="mt-10 border-t border-line pt-6 text-small text-ink-subtle">
              {AGENTS_PAGE.detailNote}{" "}
              <Link
                href="/how-we-work"
                className="text-ink-muted underline underline-offset-4 transition-colors hover:text-ink"
              >
                See how we work
              </Link>
              .
            </p>
          </div>
        </Container>
      </div>

      {related.length > 0 && (
        <Section tone="canvas">
          <p className="eyebrow">Related agents</p>
          <ul className="mt-5 flex flex-col gap-3 sm:flex-row sm:gap-10">
            {related.map((item) => (
              <li key={item.slug}>
                <Link
                  href={`/agents/${item.slug}`}
                  className="text-small text-ink-muted transition-colors hover:text-ink"
                >
                  {item.name} <span aria-hidden>&rarr;</span>
                </Link>
              </li>
            ))}
          </ul>
        </Section>
      )}
    </>
  );
}
