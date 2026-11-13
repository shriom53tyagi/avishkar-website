import type { Metadata } from "next";
import { buildMetadata } from "@/lib/seo";
import { LetterPage } from "@/components/av/LetterPage";

export const metadata: Metadata = buildMetadata({
  title: "The Avishkar Letter",
  description:
    "One short email a month from Avishkar, a technology partner for medspas, on what we are seeing across practices. Subscribe to The Avishkar Letter.",
  path: "/letter",
});

export default function Page() {
  return <LetterPage />;
}
