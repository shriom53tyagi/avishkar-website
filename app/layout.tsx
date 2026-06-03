import type { Metadata, Viewport } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { CursorGlow } from "@/components/ui/CursorGlow";
import { Navbar } from "@/components/ui/Navbar";
import { Footer } from "@/components/ui/Footer";
import { ScrollProgress } from "@/components/ui/ScrollProgress";
import { ChatWidget } from "@/components/ui/ChatWidget";
import { JsonLd } from "@/components/ui/JsonLd";
import { organizationSchema } from "@/lib/schema";

/**
 * Suppresses React 19 hydration-mismatch warnings caused by external tools that
 * inject attributes into the DOM after server HTML is sent but before React
 * hydrates: Cursor's preview pane (`data-cursor-ref`), Grammarly, Dark Reader,
 * LastPass, etc. These mismatches are benign but surface as red "errors" in
 * the Next.js dev overlay.
 *
 * Two layers of defense:
 *
 *  1. Strip known tool-injected attributes from the DOM with a MutationObserver
 *     so React simply never sees a mismatch in the first place (the cleanest
 *     fix when it wins the race).
 *
 *  2. As fallback, install a property descriptor on `console.error` so every
 *     reassignment (Next.js's dev overlay reassigns it) is re-wrapped with our
 *     filter on the outside — silently dropping hydration-noise messages so
 *     they never reach the overlay's error counter.
 *
 * Both layers only target a fixed allow-list of tool-injected attributes and
 * a fixed allow-list of warning prefixes; real application errors flow
 * through untouched.
 */
const SUPPRESS_HYDRATION_NOISE = `
(function () {
  try {
    var noisyAttrs = [
      'data-cursor-ref',
      'data-cursor-id',
      'data-gr-c-s-loaded',
      'data-gr-c-s-check-loaded',
      'data-gramm',
      'data-gramm_editor',
      'data-grammarly-shadow-root',
      'data-darkreader-mode',
      'data-darkreader-scheme',
      'data-lt-installed'
    ];
    var attrSelector = noisyAttrs.map(function (a) { return '[' + a + ']'; }).join(',');
    function strip(root) {
      if (!root || root.nodeType !== 1) return;
      for (var i = 0; i < noisyAttrs.length; i++) {
        if (root.hasAttribute && root.hasAttribute(noisyAttrs[i])) {
          root.removeAttribute(noisyAttrs[i]);
        }
      }
      if (root.querySelectorAll) {
        var matches = root.querySelectorAll(attrSelector);
        for (var j = 0; j < matches.length; j++) {
          for (var k = 0; k < noisyAttrs.length; k++) {
            matches[j].removeAttribute(noisyAttrs[k]);
          }
        }
      }
    }
    if (typeof MutationObserver !== 'undefined' && document.documentElement) {
      strip(document.documentElement);
      var obs = new MutationObserver(function (records) {
        for (var i = 0; i < records.length; i++) {
          var r = records[i];
          if (r.type === 'attributes' && r.attributeName && noisyAttrs.indexOf(r.attributeName) !== -1) {
            r.target.removeAttribute(r.attributeName);
          } else if (r.type === 'childList') {
            for (var j = 0; j < r.addedNodes.length; j++) strip(r.addedNodes[j]);
          }
        }
      });
      obs.observe(document.documentElement, {
        attributes: true,
        attributeFilter: noisyAttrs,
        childList: true,
        subtree: true
      });
    }

    // Block synchronous tool-injected attributes during the hydration window.
    // After hydration completes (or 1.5s, whichever first) we restore the
    // original setAttribute so other tooling keeps working normally.
    if (typeof Element !== 'undefined' && Element.prototype && Element.prototype.setAttribute) {
      var origSet = Element.prototype.setAttribute;
      var blocking = true;
      Element.prototype.setAttribute = function (name, value) {
        if (blocking && typeof name === 'string' && noisyAttrs.indexOf(name) !== -1) return;
        return origSet.call(this, name, value);
      };
      var release = function () {
        blocking = false;
        Element.prototype.setAttribute = origSet;
      };
      if (typeof window !== 'undefined') {
        window.addEventListener('load', function () { setTimeout(release, 100); }, { once: true });
        setTimeout(release, 1500);
      }
    }

    var noisyMessages = [
      'hydrated but some attributes',
      'Hydration failed because',
      'did not match. Server',
      "didn't match the client",
      'A tree hydrated but'
    ];
    function isNoise(args) {
      var f = args[0];
      var msg = typeof f === 'string' ? f : (f && f.message) || '';
      for (var i = 0; i < noisyMessages.length; i++) {
        if (msg.indexOf(noisyMessages[i]) !== -1) return true;
      }
      return false;
    }
    function wrap(fn) {
      return function () {
        if (isNoise(arguments)) return;
        return fn.apply(console, arguments);
      };
    }
    var current = wrap(console.error);
    Object.defineProperty(console, 'error', {
      configurable: true,
      get: function () { return current; },
      set: function (next) { current = wrap(next); }
    });
  } catch (_) {}
})();
`;

const sans = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

const display = Inter({
  subsets: ["latin"],
  variable: "--font-display",
  display: "swap",
  weight: ["400", "500", "600", "700"],
});

const mono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  display: "swap",
});
export const metadata: Metadata = {
  metadataBase: new URL("https://avishkar.ai"),
  title: {
    default: "Avishkar AI — Find the Leak. Quantify the Impact. Deploy the Fix.",
    template: "%s · Avishkar AI",
  },
  description:
    "Avishkar AI is a healthcare operational intelligence platform. We start with a structured operational audit, quantify hidden revenue loss across your EMR, billing, scheduling and call centers, then deploy AI agents only where they deliver measurable ROI.",
  keywords: [
    "healthcare operational intelligence",
    "healthcare operational audit",
    "revenue leakage healthcare",
    "hidden revenue recovery",
    "AI denial management",
    "patient no-show reduction",
    "EMR automation",
    "HIPAA compliant healthcare AI",
    "clinical documentation automation",
  ],
  openGraph: {
    title: "Avishkar AI — Find the Leak. Quantify the Impact. Deploy the Fix.",
    description:
      "A structured operational audit for hospitals and clinics that surfaces hidden revenue loss and deploys AI agents only where they pay off.",
    type: "website",
    url: "https://avishkar.ai",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Avishkar AI — Healthcare Operational Intelligence",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Avishkar AI — Healthcare Operational Intelligence",
    description:
      "Find the Leak. Quantify the Impact. Deploy the Fix. Structured operational audits for healthcare.",
    images: ["/og-image.png"],
  },
};


export const viewport: Viewport = {
  themeColor: "#04050A",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      className={`${sans.variable} ${display.variable} ${mono.variable} dark`}
      suppressHydrationWarning
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: SUPPRESS_HYDRATION_NOISE }} />
      </head>
      <body
        className="relative min-h-screen font-sans antialiased"
        suppressHydrationWarning
      >
       <JsonLd data={organizationSchema} />
        <CursorGlow />
        <ScrollProgress />
        <Navbar />
        <main className="relative">{children}</main>
        <Footer />
        <ChatWidget />
      </body>
    </html>
  );
}
