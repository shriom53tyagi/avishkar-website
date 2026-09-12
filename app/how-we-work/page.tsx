import type { Metadata } from "next";
import { HowWeWorkPage } from "@/components/av/HowWeWorkPage";
import { JsonLd } from "@/components/ui/JsonLd";
import { ENGAGEMENT_FAQS } from "@/lib/content";
import { faqPageSchema, serviceSchema } from "@/lib/schema";

export const metadata: Metadata = {
  title: "How we work",
  description:
    "How Avishkar works with practices: a 30-minute conversation about the workflow, one scoped build on the systems you already use, then measurement.",
  alternates: { canonical: "/how-we-work" },
};

export default function Page() {
  return (
    <>
      <JsonLd data={serviceSchema} />
      <JsonLd data={faqPageSchema(ENGAGEMENT_FAQS)} />
      <HowWeWorkPage />
    </>
  );
}
