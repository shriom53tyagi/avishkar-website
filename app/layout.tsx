import type { Metadata, Viewport } from "next";
import { Schibsted_Grotesk, DM_Mono } from "next/font/google";
import "./globals.css";
import { AvHeader } from "@/components/av/AvHeader";
import { AvFooter } from "@/components/av/AvFooter";
import { JsonLd } from "@/components/ui/JsonLd";
import { organizationSchema } from "@/lib/schema";
import { CookieConsentLoader } from "@/components/ui/CookieConsentLoader";
import { SITE_URL } from "@/lib/site";

/**
 * Suppresses React 19 hydration-mismatch warnings caused by external tools
 * that inject attributes into the DOM after server HTML is sent but before
 * React hydrates (Cursor's preview pane, Grammarly, Dark Reader, LastPass).
 * Only a fixed allow-list of attributes and warning prefixes is touched.
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

const sans = Schibsted_Grotesk({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-sans",
  display: "swap",
});

const mono = DM_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-mono",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Avishkar — Technology built around how your practice works",
    template: "%s · Avishkar",
  },
  description:
    "Avishkar connects the systems your practice already uses and builds the technology around them — integrations, automation, internal tools, reporting and AI agents.",
  icons: {
    icon: "/logo.png",
    apple: "/logo.png",
  },
  keywords: [
    "practice technology",
    "custom healthcare software",
    "practice management integrations",
    "practice operations automation",
    "aesthetic practice software",
    "AI agents for medspas",
  ],
  openGraph: {
    title: "Avishkar — Technology built around how your practice works",
    description:
      "Integrations, automation, internal tools, AI agents and custom software for medspas, aesthetic practices, clinics and healthcare teams.",
    type: "website",
    url: SITE_URL,
    siteName: "Avishkar",
  },
  twitter: {
    card: "summary_large_image",
    title: "Avishkar — Technology built around how your practice works",
    description:
      "Integrations, automation, internal tools, AI agents and custom software for modern practices.",
  },
  verification: {
    other: {
      "msvalidate.01": "5D876744A3628BBB9AE59B8781B3B409",
    },
  },
};

export const viewport: Viewport = {
  themeColor: "#F1F1ED",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${sans.variable} ${mono.variable}`} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: SUPPRESS_HYDRATION_NOISE }} />
        {/* Without JS the reveal animation never runs, so force its end state. */}
        <noscript>
          <style>{".reveal{opacity:1 !important;transform:none !important}"}</style>
        </noscript>
      </head>
      <body className="min-h-screen font-sans antialiased" suppressHydrationWarning>
        <JsonLd data={organizationSchema} />
        <div className="relative z-10" style={{ maxWidth: "100%", overflowX: "hidden" }}>
          <AvHeader />
          <main>{children}</main>
          <AvFooter />
        </div>
        <CookieConsentLoader />
      </body>
    </html>
  );
}
