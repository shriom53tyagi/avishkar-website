import type { Metadata } from "next";
import { buildMetadata } from "@/lib/seo";
import { PrivacyPage } from "@/components/av/PrivacyPage";

export const metadata: Metadata = buildMetadata({
  title: "Privacy Policy",
  description:
    "How Avishkar, a technology partner for medspas, collects, uses and protects personal information submitted through this website.",
  path: "/privacy",
});

export default function Page() {
  return <PrivacyPage />;
}
