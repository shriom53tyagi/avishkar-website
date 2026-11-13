import type { Metadata } from "next";
import { buildMetadata } from "@/lib/seo";
import { CareersPage } from "@/components/av/CareersPage";

export const metadata: Metadata = buildMetadata({
  title: "Careers",
  description:
    "Work at Avishkar, a technology partner for medspas, aesthetic practices and clinics. We build integrations, automation, internal tools and AI agents.",
  path: "/careers",
});

export default function Page() {
  return <CareersPage />;
}
