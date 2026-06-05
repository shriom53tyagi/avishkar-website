"use client";

import dynamic from "next/dynamic";

const CookieConsent = dynamic(
  () => import("@/components/ui/CookieConsent").then((m) => m.CookieConsent),
  { ssr: false }
);

export function CookieConsentLoader() {
  return <CookieConsent />;
}
