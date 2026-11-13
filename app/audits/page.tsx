import type { Metadata } from "next";
import { buildMetadata } from "@/lib/seo";
import { AuditsPage } from "@/components/av/AuditsPage";

export const metadata: Metadata = buildMetadata({
  title: "Practice Audits",
  description:
    "Practice audits from Avishkar, a technology partner for medspas: how booking, follow-ups, phones, reviews and data flow hold up, and what we would fix.",
  path: "/audits",
});

export default function Page() {
  return <AuditsPage />;
}
