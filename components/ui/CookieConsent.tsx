"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

const STORAGE_KEY = "cookie_consent";

/** Fired on window when the visitor accepts or declines, so scripts can react. */
export const CONSENT_EVENT = "avishkar:consent-change";

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
    window.dispatchEvent(new Event(CONSENT_EVENT));
    setVisible(false);
  }

  function decline() {
    localStorage.setItem(STORAGE_KEY, "declined");
    setVisible(false);
  }

  if (!visible) return null;

  return (
    <div className="fixed bottom-0 left-0 z-50 w-full border-t border-line bg-surface px-6 py-4">
      <div className="mx-auto flex max-w-container flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-small text-ink-muted">
          We use cookies to enable booking (Calendly) and monitor site performance. See our{" "}
          <Link href="/privacy" className="underline underline-offset-4 hover:text-ink">
            Privacy Policy
          </Link>
          .
        </p>
        <div className="flex shrink-0 items-center gap-3">
          <button
            onClick={decline}
            className="rounded border border-line-strong px-4 py-2 text-small font-medium text-ink-muted transition-colors hover:text-ink"
          >
            Decline
          </button>
          <button
            onClick={accept}
            className="rounded bg-accent px-4 py-2 text-small font-medium text-white transition-colors hover:bg-accent-hover"
          >
            Accept
          </button>
        </div>
      </div>
    </div>
  );
}
