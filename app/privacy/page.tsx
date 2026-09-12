import type { Metadata } from "next";
import { PrivacyPage } from "@/components/av/PrivacyPage";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description:
    "How Avishkar collects, uses and protects personal information submitted through this website.",
  alternates: { canonical: "/privacy" },
};

export default function Page() {
  return <PrivacyPage />;
}
