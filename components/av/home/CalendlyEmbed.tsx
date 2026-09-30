"use client";

import { useEffect, useRef } from "react";

const CALENDLY_URL = process.env.NEXT_PUBLIC_CALENDLY_URL || "";
const SCRIPT_SRC = "https://assets.calendly.com/assets/external/widget.js";

type CalendlyAPI = {
  initInlineWidget: (opts: { url: string; parentElement: HTMLElement }) => void;
};

function loadScript(): Promise<boolean> {
  return new Promise((resolve) => {
    const existing = document.querySelector<HTMLScriptElement>(`script[src="${SCRIPT_SRC}"]`);
    if (existing) {
      if ((window as unknown as { Calendly?: CalendlyAPI }).Calendly) resolve(true);
      else {
        existing.addEventListener("load", () => resolve(true));
        existing.addEventListener("error", () => resolve(false));
      }
      return;
    }
    const s = document.createElement("script");
    s.src = SCRIPT_SRC;
    s.async = true;
    s.onload = () => resolve(true);
    s.onerror = () => resolve(false);
    document.head.appendChild(s);
  });
}

/** Inline Calendly widget; the script loads only once the container is near the viewport. */
export function CalendlyEmbed({ className }: { className?: string }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el || !CALENDLY_URL) return;
    const url = `${CALENDLY_URL}?hide_gdpr_banner=1&hide_event_type_details=1`;
    const io = new IntersectionObserver(
      (entries) => {
        if (!entries.some((e) => e.isIntersecting)) return;
        io.disconnect();
        loadScript().then((ok) => {
          const api = (window as unknown as { Calendly?: CalendlyAPI }).Calendly;
          if (ok && api && el.isConnected && !el.querySelector("iframe")) {
            api.initInlineWidget({ url, parentElement: el });
          }
        });
      },
      { rootMargin: "600px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return <div id="book" ref={ref} className={className} />;
}
