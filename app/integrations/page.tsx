import type { Metadata } from "next";
import { IntegrationsPage } from "@/components/av/IntegrationsPage";
import { SITE_URL } from "@/lib/site";

const description = "Avishkar connects the systems your practice already pays for: EMRs, CRMs, booking, phones, payments and marketing.";

export const metadata: Metadata = {
  title: "Integrations",
  description,
  alternates: { canonical: "/integrations" },
  openGraph: { title: "Integrations · Avishkar", description, url: `${SITE_URL}/integrations`, type: "website" },
};

export default function Page() {
  return <IntegrationsPage />;
}
