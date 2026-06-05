"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

const STORAGE_KEY = "cookie_consent";

export function hasConsent(): boolean {
  if (typeof window === "undefined") return false;
  return localStorage.getItem(STORAGE_KEY) === "accepted";
}

export function CookieConsent() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) setVisible(true);
  }, []);

  function accept() {
    localStorage.setItem(STORAGE_KEY, "accepted");
    setVisible(false);
  }

  function decline() {
    localStorage.setItem(STORAGE_KEY, "declined");
    setVisible(false);
  }

  if (!visible) return null;

  return (
    <div className="fixed bottom-0 left-0 z-50 w-full border-t border-slate-900/[0.08] bg-white/95 px-6 py-4 shadow-[0_-4px_24px_rgba(0,0,0,0.06)] backdrop-blur">
      <div className="mx-auto flex max-w-7xl flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-[13px] leading-relaxed text-slate-600">
          We use cookies to enable booking functionality (Calendly) and monitor site performance.
          See our{" "}
          <Link href="/privacy" className="underline underline-offset-2 hover:text-slate-900">
            Privacy Policy
          </Link>
          .
        </p>
        <div className="flex shrink-0 items-center gap-3">
          <button
            onClick={decline}
            className="rounded-full border border-slate-900/10 bg-slate-50 px-4 py-1.5 text-[13px] font-medium text-slate-600 transition-colors hover:border-slate-900/20 hover:text-slate-900"
          >
            Decline
          </button>
          <button
            onClick={accept}
            className="rounded-full bg-blue-600 px-4 py-1.5 text-[13px] font-medium text-white shadow-sm transition-colors hover:bg-blue-700"
          >
            Accept
          </button>
        </div>
      </div>
    </div>
  );
}
