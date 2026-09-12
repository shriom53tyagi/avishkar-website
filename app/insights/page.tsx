import type { Metadata } from "next";
import { InsightsPage } from "@/components/av/InsightsPage";

export const metadata: Metadata = {
  title: "Insights",
  description:
    "Field notes on aesthetics, medspa operations, wellness, and the technology underneath — written by the people building it, for the people running the practice.",
  alternates: { canonical: "/insights" },
};

export default function Page() {
  return <InsightsPage />;
}
