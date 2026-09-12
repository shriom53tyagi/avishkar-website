import type { Metadata } from "next";
import { AgentsPage } from "@/components/av/AgentsPage";
import { JsonLd } from "@/components/ui/JsonLd";
import { agentLibrarySchema } from "@/lib/schema";

export const metadata: Metadata = {
  title: "Agents we've built for practice teams",
  description:
    "A current look at Avishkar's work for medspas, aesthetic practices and clinics. Agents are one of the things we build — alongside integrations, automation, internal tools and custom software.",
  alternates: { canonical: "/agents" },
};

export default function Page() {
  return (
    <>
      <JsonLd data={agentLibrarySchema} />
      <AgentsPage />
    </>
  );
}
