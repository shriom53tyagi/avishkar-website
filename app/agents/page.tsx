import type { Metadata } from "next";
import { buildMetadata } from "@/lib/seo";
import { AgentsPage } from "@/components/av/AgentsPage";
import { JsonLd } from "@/components/ui/JsonLd";
import { agentLibrarySchema } from "@/lib/schema";

export const metadata: Metadata = buildMetadata({
  title: "Agents for Medspa Teams",
  description:
    "See the agents Avishkar, a technology partner for medspas, has built for practice teams, alongside integrations, automation and internal tools.",
  path: "/agents",
});

export default function Page() {
  return (
    <>
      <JsonLd data={agentLibrarySchema} />
      <AgentsPage />
    </>
  );
}
