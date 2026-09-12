import type { Metadata } from "next";
import { CareersPage } from "@/components/av/CareersPage";

export const metadata: Metadata = {
  title: "Careers",
  description:
    "Work at Avishkar: we build technology for medspas, aesthetic practices and clinics — integrations, automation, internal tools, and AI agents.",
  alternates: { canonical: "/careers" },
};

export default function Page() {
  return <CareersPage />;
}
