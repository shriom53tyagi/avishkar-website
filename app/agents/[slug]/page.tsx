import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { AgentDetailPage } from "@/components/av/AgentDetailPage";
import { AGENTS, getAgent, getRelated } from "@/lib/agents";
import { JsonLd } from "@/components/ui/JsonLd";
import { breadcrumbSchema } from "@/lib/schema";
import { buildMetadata } from "@/lib/seo";

const TAILS = [
  " See how Avishkar, a technology partner for medspas, approaches this for practice teams.",
  " Avishkar is a technology partner for medspas, working around your existing tools.",
  " Avishkar, a technology partner for medspas, works around the tools you already use.",
  " Avishkar is a technology partner for medspas.",
];

/** 120-155 characters: the one-liner plus the first brand tail that fits. */
function agentDescription(oneLiner: string): string {
  const fit = TAILS.map((t) => oneLiner + t).find((d) => d.length >= 120 && d.length <= 155);
  return fit ?? oneLiner + TAILS[TAILS.length - 1];
}

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

  return buildMetadata({
    title: agent.name,
    description: agentDescription(agent.oneLiner),
    path: `/agents/${agent.slug}`,
  });
}

export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const agent = getAgent(slug);
  if (!agent) notFound();

  const related = getRelated(agent);

  return (
    <>
      <JsonLd
        data={breadcrumbSchema([
          { name: "Home", path: "/" },
          { name: "Agents", path: "/agents" },
          { name: agent.name, path: `/agents/${agent.slug}` },
        ])}
      />
      <AgentDetailPage agent={agent} related={related} />
    </>
  );
}
