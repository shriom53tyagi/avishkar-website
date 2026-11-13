import type { Metadata } from "next";
import { buildMetadata } from "@/lib/seo";
import { TermsPage } from "@/components/av/TermsPage";

export const metadata: Metadata = buildMetadata({
  title: "Terms of Service",
  description:
    "The terms that govern access to and use of the Avishkar website. Avishkar is a technology partner for medspas and aesthetic practices.",
  path: "/terms",
});

export default function Page() {
  return <TermsPage />;
}
