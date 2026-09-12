"use client";

import { useEffect, useRef, useState } from "react";
import { hasConsent } from "@/components/ui/CookieConsent";

/*
 * Calendly inline embed, restyled for the Avishkar brand.
 *
 * Setup:
 *   1. Create the event type in Calendly and copy its booking URL.
 *   2. Add NEXT_PUBLIC_CALENDLY_URL=... to .env.local
 *   3. Restart the dev server.
 *
 * If the script is blocked, consent is declined, or the env var is missing,
 * a plain fallback with a direct link is shown instead.
 */

const CALENDLY_URL = process.env.NEXT_PUBLIC_CALENDLY_URL || "";
const SCRIPT_SRC = "https://assets.calendly.com/assets/external/widget.js";
const CSS_SRC = "https://assets.calendly.com/assets/external/widget.css";

type CalendlyAPI = {
  initInlineWidget: (opts: { url: string; parentElement: HTMLElement }) => void;
};

function loadScript(src: string): Promise<boolean> {
  return new Promise((resolve) => {
    if (document.querySelector(`script[src="${src}"]`)) {
      resolve(true);
      return;
    }
    const s = document.createElement("script");
    s.src = src;
    s.async = true;
    s.onload = () => resolve(true);
    s.onerror = () => resolve(false);
    document.head.appendChild(s);
  });
}

function loadCss(href: string) {
  if (document.querySelector(`link[href="${href}"]`)) return;
  const l = document.createElement("link");
  l.rel = "stylesheet";
  l.href = href;
  document.head.appendChild(l);
}

function Fallback({ children }: { children: React.ReactNode }) {
  return (
    <div
      style={{
        border: "1px solid rgba(20,24,26,.12)",
        borderRadius: 16,
        background: "#FDFDFB",
        padding: 32,
      }}
    >
      {children}
    </div>
  );
}

export function AvCalendarEmbed() {
  const ref = useRef<HTMLDivElement>(null);
  const [state, setState] = useState<"loading" | "ready" | "error" | "no-consent">("loading");

  useEffect(() => {
    if (!hasConsent()) {
      setState("no-consent");
      return;
    }

    if (!CALENDLY_URL) {
      setState("error");
      return;
    }

    let cancelled = false;
    loadCss(CSS_SRC);

    loadScript(SCRIPT_SRC).then((ok) => {
      if (cancelled) return;
      const Calendly = (window as unknown as { Calendly?: CalendlyAPI }).Calendly;

      if (!ok || !Calendly || !ref.current) {
        setState("error");
        return;
      }

      Calendly.initInlineWidget({ url: CALENDLY_URL, parentElement: ref.current });
      setState("ready");
    });

    return () => {
      cancelled = true;
    };
  }, []);

  if (state === "no-consent") {
    return (
      <Fallback>
        <p style={{ fontSize: 15.5, fontWeight: 600, color: "#14181A", margin: 0 }}>The booking calendar needs cookies</p>
        <p style={{ fontSize: 14.5, color: "#4E5654", marginTop: 8 }}>
          Accept cookies to load the calendar, or email us and we&apos;ll find a time.
        </p>
        <button
          onClick={() => {
            localStorage.removeItem("cookie_consent");
            window.location.reload();
          }}
          style={{
            marginTop: 20,
            cursor: "pointer",
            fontFamily: "inherit",
            fontSize: 14,
            fontWeight: 500,
            padding: "10px 18px",
            borderRadius: 999,
            border: "1px solid rgba(20,24,26,.2)",
            background: "transparent",
            color: "#14181A",
          }}
        >
          Update cookie preferences
        </button>
      </Fallback>
    );
  }

  if (state === "error") {
    return (
      <Fallback>
        <p style={{ fontSize: 15.5, fontWeight: 600, color: "#14181A", margin: 0 }}>Open the booking calendar</p>
        <p style={{ fontSize: 14.5, color: "#4E5654", marginTop: 8 }}>
          {CALENDLY_URL
            ? "The embedded calendar could not load — it may be blocked by a browser extension. Use the link below."
            : "The booking calendar is not configured yet. Set NEXT_PUBLIC_CALENDLY_URL in the environment."}
        </p>
        {CALENDLY_URL && (
          <a
            href={CALENDLY_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="av-contact-btn-dark"
            style={{
              marginTop: 20,
              display: "inline-flex",
              fontSize: 14,
              fontWeight: 500,
              padding: "12px 22px",
              borderRadius: 999,
              background: "#14181A",
              color: "#F1F1ED",
            }}
          >
            Open calendar in a new tab
          </a>
        )}
      </Fallback>
    );
  }

  return (
    <div
      style={{
        position: "relative",
        width: "100%",
        overflow: "hidden",
        border: "1px solid rgba(20,24,26,.12)",
        borderRadius: 16,
        background: "#FDFDFB",
      }}
    >
      {state === "loading" && (
        <div
          style={{
            position: "absolute",
            inset: 0,
            zIndex: 10,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            background: "#FDFDFB",
          }}
        >
          <span style={{ fontSize: 14, color: "#6E7674" }}>Loading calendar…</span>
        </div>
      )}
      <div ref={ref} style={{ minWidth: 320, height: 700 }} />
    </div>
  );
}
