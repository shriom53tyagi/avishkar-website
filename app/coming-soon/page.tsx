import type { Metadata } from "next";
import { ComingSoonPage } from "@/components/av/ComingSoonPage";

export const metadata: Metadata = {
  title: { absolute: "Coming soon | Avishkar Technology Partner" },
  robots: "noindex",
};

export default function Page() {
  return <ComingSoonPage />;
}
