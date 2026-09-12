import type { Metadata } from "next";
import { SecurityPage } from "@/components/av/SecurityPage";

export const metadata: Metadata = {
  title: "Security",
  description:
    "How Avishkar handles practice and patient data: least-privilege access, data minimization, HIPAA-aligned practices, BAA on request, and human oversight.",
  alternates: { canonical: "/security" },
};

export default function Page() {
  return <SecurityPage />;
}
