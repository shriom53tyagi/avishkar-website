import type { Metadata } from "next";
import { buildMetadata } from "@/lib/seo";
import { BenchmarksPage } from "@/components/av/BenchmarksPage";

export const metadata: Metadata = buildMetadata({
  title: "Benchmarks",
  description:
    "Compare your no-show rate, rebooking rate and lead response time with industry averages, from Avishkar, a technology partner for medspas.",
  path: "/benchmarks",
});

export default function Page() {
  return <BenchmarksPage />;
}
