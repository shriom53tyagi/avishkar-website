import type { Metadata } from "next";
import { AuditsPage } from "@/components/av/AuditsPage";
import { SITE_URL } from "@/lib/site";

const description =
  "Teardowns of practices' stacks, graded on booking, follow-ups, phones, reviews and data flow, with exactly what we'd fix.";

export const metadata: Metadata = {
  title: "Practice Audits",
  description,
  alternates: { canonical: "/audits" },
  openGraph: {
    title: "Practice Audits · Avishkar",
    description,
    url: `${SITE_URL}/audits`,
    type: "website",
  },
};

export default function Page() {
  return <AuditsPage />;
}
