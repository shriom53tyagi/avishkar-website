import type { Metadata } from "next";
import { buildMetadata } from "@/lib/seo";
import { AboutPage } from "@/components/av/AboutPage";

export const metadata: Metadata = buildMetadata({
  title: "About Us",
  description:
    "Avishkar is a technology partner for medspas. We build around how practices already work: integrations, automation, internal tools and AI agents.",
  path: "/about",
});

export default function Page() {
  return <AboutPage />;
}
