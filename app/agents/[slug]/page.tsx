import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { AgentDetailPage } from "@/components/av/AgentDetailPage";
import { AGENTS, getAgent, getRelated } from "@/lib/agents";

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

export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const agent = getAgent(slug);
  if (!agent) notFound();

  const related = getRelated(agent);

  return <AgentDetailPage agent={agent} related={related} />;
}
