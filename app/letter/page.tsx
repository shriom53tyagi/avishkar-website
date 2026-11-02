import type { Metadata } from "next";
import { LetterPage } from "@/components/av/LetterPage";
import { SITE_URL } from "@/lib/site";

const description =
  "One short email a month with what we're seeing across practices — from Avishkar.";

export const metadata: Metadata = {
  title: "The Avishkar Letter",
  description,
  alternates: { canonical: "/letter" },
  openGraph: {
    title: "The Avishkar Letter · Avishkar",
    description,
    url: `${SITE_URL}/letter`,
    type: "website",
  },
};

export default function Page() {
  return <LetterPage />;
}
