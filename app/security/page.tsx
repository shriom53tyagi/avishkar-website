import type { Metadata } from "next";
import { buildMetadata } from "@/lib/seo";
import { SecurityPage } from "@/components/av/SecurityPage";

export const metadata: Metadata = buildMetadata({
  title: "Security",
  description:
    "How Avishkar, a technology partner for medspas, handles practice and patient data: least-privilege access, data minimization and HIPAA-aligned practices.",
  path: "/security",
});

export default function Page() {
  return <SecurityPage />;
}
