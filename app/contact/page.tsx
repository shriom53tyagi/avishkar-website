import type { Metadata } from "next";
import { buildMetadata } from "@/lib/seo";
import { ContactPage } from "@/components/av/ContactPage";

export const metadata: Metadata = buildMetadata({
  title: "Book a Conversation",
  description:
    "Book a 30-minute conversation with Avishkar, a technology partner for medspas. Tell us which workflow to improve and we will find where technology helps.",
  path: "/contact",
});

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ intent?: string }>;
}) {
  const { intent } = await searchParams;
  return <ContactPage custom={intent === "custom"} />;
}
