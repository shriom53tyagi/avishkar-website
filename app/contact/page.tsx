import type { Metadata } from "next";
import { ContactPage } from "@/components/av/ContactPage";

export const metadata: Metadata = {
  title: "Talk to Avishkar",
  description:
    "Book a 30-minute conversation with Avishkar. Tell us the workflow your practice is trying to improve and we'll work out where technology could help.",
  alternates: { canonical: "/contact" },
};

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ intent?: string }>;
}) {
  const { intent } = await searchParams;
  return <ContactPage custom={intent === "custom"} />;
}
