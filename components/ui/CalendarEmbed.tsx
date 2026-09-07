"use client";

import { useEffect, useRef, useState } from "react";
import { hasConsent } from "@/components/ui/CookieConsent";

/*
 * Calendly inline embed.
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
    <div className="rounded border border-line bg-surface p-8">{children}</div>
  );
}

export function CalendarEmbed() {
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
        <p className="text-small font-semibold text-ink">The booking calendar needs cookies</p>
        <p className="mt-2 text-small text-ink-muted">
          Accept cookies to load the calendar, or email us and we&apos;ll find a time.
        </p>
        <button
          onClick={() => {
            localStorage.removeItem("cookie_consent");
            window.location.reload();
          }}
          className="mt-6 rounded border border-line-strong px-4 py-2 text-small font-medium text-ink transition-colors hover:border-ink-subtle"
        >
          Update cookie preferences
        </button>
      </Fallback>
    );
  }

  if (state === "error") {
    return (
      <Fallback>
        <p className="text-small font-semibold text-ink">Open the booking calendar</p>
        <p className="mt-2 text-small text-ink-muted">
          {CALENDLY_URL
            ? "The embedded calendar could not load — it may be blocked by a browser extension. Use the link below."
            : "The booking calendar is not configured yet. Set NEXT_PUBLIC_CALENDLY_URL in the environment."}
        </p>
        {CALENDLY_URL && (
          <a
            href={CALENDLY_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-6 inline-flex rounded bg-accent px-5 py-3 text-small font-medium text-white transition-colors hover:bg-accent-hover"
          >
            Open calendar in a new tab
          </a>
        )}
      </Fallback>
    );
  }

  return (
    <div className="relative w-full overflow-hidden rounded border border-line bg-surface">
      {state === "loading" && (
        <div className="absolute inset-0 z-10 flex items-center justify-center bg-surface">
          <span className="text-small text-ink-subtle">Loading calendar…</span>
        </div>
      )}
      <div ref={ref} style={{ minWidth: "320px", height: "700px" }} />
    </div>
  );
}
