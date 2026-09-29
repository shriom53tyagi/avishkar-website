import type { Metadata } from "next";
import { WhatWeDoPage } from "@/components/av/WhatWeDoPage";

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

export default function Page() {
  return <WhatWeDoPage />;
}
