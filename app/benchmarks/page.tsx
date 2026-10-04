import type { Metadata } from "next";
import { BenchmarksPage } from "@/components/av/BenchmarksPage";
import { SITE_URL } from "@/lib/site";

const description = "Compare your no-show rate, rebooking rate and lead response time against industry averages.";

export const metadata: Metadata = {
  title: "Benchmarks",
  description,
  alternates: { canonical: "/benchmarks" },
  openGraph: { title: "Benchmarks · Avishkar", description, url: `${SITE_URL}/benchmarks`, type: "website" },
};

export default function Page() {
  return <BenchmarksPage />;
}
