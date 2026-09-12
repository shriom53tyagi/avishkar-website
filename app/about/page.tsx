import type { Metadata } from "next";
import { AboutPage } from "@/components/av/AboutPage";

export const metadata: Metadata = {
  title: "About",
  description:
    "Avishkar is a technology company that builds around how practices already work — integrations, automation, internal tools, reporting, and AI agents.",
  alternates: { canonical: "/about" },
};

export default function Page() {
  return <AboutPage />;
}
