import type { Metadata } from "next";
import { TermsPage } from "@/components/av/TermsPage";

export const metadata: Metadata = {
  title: "Terms of Service",
  description: "Terms governing access to and use of the Avishkar website.",
  alternates: { canonical: "/terms" },
};

export default function Page() {
  return <TermsPage />;
}
