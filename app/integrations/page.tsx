import type { Metadata } from "next";
import { buildMetadata } from "@/lib/seo";
import { IntegrationsPage } from "@/components/av/IntegrationsPage";

export const metadata: Metadata = buildMetadata({
  title: "Integrations",
  description:
    "Avishkar, a technology partner for medspas, connects the systems your practice already pays for: EMRs, CRMs, booking, phones, payments and marketing.",
  path: "/integrations",
});

export default function Page() {
  return <IntegrationsPage />;
}
