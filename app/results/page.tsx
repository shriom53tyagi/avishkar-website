import type { Metadata } from "next";
import { LatestUpdates } from "@/components/sections/LatestUpdates";
import { PageHeader } from "@/components/ui/PageHeader";

export const metadata: Metadata = {
  title: "Results",
  description:
    "Real outcomes from Avishkar's healthcare operational audits — denial rate reduction, admin workload reduction, and revenue recovered.",
  openGraph: {
    title: "Results — Avishkar AI",
    description:
      "The audit found it. The agents recovered it. Real outcomes from engagements to date.",
    url: "https://avishkar.app/results",
  },
};

export default function ResultsPage() {
  return (
    <>
      <PageHeader
        eyebrow="Latest results"
        title="The audit found it. The agents recovered it."
        description="Real outcomes from engagements to date — no benchmarks, no estimates."
      />
      <LatestUpdates showHeading={false} />
    </>
  );
}
