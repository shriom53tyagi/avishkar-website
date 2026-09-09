import type { Metadata } from "next";
import { WhatWeDo } from "@/components/sections/WhatWeDo";
import { PageHeader } from "@/components/ui/PageHeader";

export const metadata: Metadata = {
  title: "What We Do",
  description:
    "Avishkar's operational audit, AI agents, and revenue recovery for healthcare EMR, billing, and scheduling.",
  openGraph: {
    title: "What We Do — Avishkar AI",
    description:
      "A structured operational audit followed by AI agents deployed only where the numbers prove it pays.",
    url: "https://avishkar.app/what-we-do",
  },
};

export default function WhatWeDoPage() {
  return (
    <>
      <PageHeader
        eyebrow="What we do"
        title="Diagnose first. Deploy only where it pays."
        description="Every engagement starts with a structured audit — not a sales pitch for automation. Agents are switched on only once the numbers prove they're worth it."
      />
      <WhatWeDo showHeading={false} />
    </>
  );
}
