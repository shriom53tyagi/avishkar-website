import type { Metadata } from "next";
import { buildMetadata } from "@/lib/seo";
import { HowWeWorkPage } from "@/components/av/HowWeWorkPage";
import { JsonLd } from "@/components/ui/JsonLd";
import { ENGAGEMENT_FAQS } from "@/lib/content";
import { faqPageSchema, serviceSchema } from "@/lib/schema";

export const metadata: Metadata = buildMetadata({
  title: "How We Work",
  description:
    "How Avishkar, a technology partner for medspas, works with practices: a 30-minute conversation, one scoped build on your current tools, then measurement.",
  path: "/how-we-work",
});

export default function Page() {
  return (
    <>
      <JsonLd data={serviceSchema} />
      <JsonLd data={faqPageSchema(ENGAGEMENT_FAQS)} />
      <HowWeWorkPage />
    </>
  );
}
