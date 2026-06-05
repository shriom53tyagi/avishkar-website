"use client";

import { useEffect, useRef, useState } from "react";
import { CalendarDays, ExternalLink } from "lucide-react";

/*
 * Calendly inline embed widget.
 *
 * Uses Calendly's official initInlineWidget({ url, parentElement }) API.
 * If the script is blocked or the env var is missing, a fallback card
 * with a direct link is shown.
 *
 * Setup:
 *   1. Create a Calendly account + event type at calendly.com
 *   2. Copy your booking URL
 *   3. Add to .env.local:
 *        NEXT_PUBLIC_CALENDLY_URL=https://calendly.com/yourname/audit-discovery
 *   4. Restart the dev server
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

export function CalendarEmbed() {
  const ref = useRef<HTMLDivElement>(null);
  const [state, setState] = useState<"loading" | "ready" | "error">("loading");

  useEffect(() => {
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

  if (state === "error") {
    return (
      <div className="flex flex-col items-center gap-4 rounded-2xl border border-slate-900/[0.08] bg-slate-50 px-6 py-12 text-center">
        <span className="inline-flex h-12 w-12 items-center justify-center rounded-full border border-cyan-200 bg-cyan-50">
          <CalendarDays className="h-6 w-6 text-cyan-700" />
        </span>
        <div>
          <div className="text-sm font-medium text-slate-900">Open the booking calendar</div>
          <p className="mt-1 max-w-xs text-[13px] text-slate-500">
            {CALENDLY_URL
              ? "The embedded calendar could not load (it may be blocked by a browser extension). Use the button below."
              : "Booking calendar is not configured yet. Set NEXT_PUBLIC_CALENDLY_URL in your environment."}
          </p>
        </div>
        {CALENDLY_URL && (
          <a
            href={CALENDLY_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-full bg-blue-600 px-5 py-2.5 text-sm font-medium text-white shadow-[0_1px_3px_rgba(23,70,219,0.28),0_4px_16px_rgba(23,70,219,0.32)] transition-transform hover:-translate-y-px hover:bg-blue-700"
          >
            <ExternalLink className="h-4 w-4" />
            Open calendar in new tab
          </a>
        )}
      </div>
    );
  }

  return (
    <div className="relative w-full overflow-hidden rounded-2xl border border-slate-900/[0.08] bg-white">
      {state === "loading" && (
        <div className="absolute inset-0 z-10 flex items-center justify-center bg-white">
          <div className="flex flex-col items-center gap-3 text-slate-500">
            <div className="h-6 w-6 animate-spin rounded-full border-2 border-slate-200 border-t-blue-500" />
            <span className="text-[13px]">Loading calendar...</span>
          </div>
        </div>
      )}
      <div ref={ref} style={{ minWidth: "320px", height: "700px" }} />
    </div>
  );
}
