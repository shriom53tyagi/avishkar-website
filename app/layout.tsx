import type { Metadata, Viewport } from "next";
import { Inter_Tight, JetBrains_Mono, Caveat } from "next/font/google";
import "./globals.css";
import { AvNavbar } from "@/components/av/AvNavbar";
import { AvPageShell } from "@/components/av/AvPageShell";
import { JsonLd } from "@/components/ui/JsonLd";
import { organizationSchema, websiteSchema } from "@/lib/schema";
import { GoogleAnalytics } from "@/components/ui/GoogleAnalytics";
import { DEFAULT_DESCRIPTION, DEFAULT_TITLE, SITE_NAME, TITLE_TEMPLATE } from "@/lib/seo";
import { CookieConsentLoader } from "@/components/ui/CookieConsentLoader";
import { SITE_URL } from "@/lib/site";
import { listPublishedInsights } from "@/lib/db";

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

/**
 * Site-wide type: Inter Tight (text) + JetBrains Mono (labels/metadata),
 * standing in for the licensed Haffer Xh / Haffer Mono until those font
 * files are available (see /public/fonts). Swapping them in later means
 * changing only this block — every consumer reads the --font-sans /
 * --font-mono variables, never a font name directly.
 */
const sans = Inter_Tight({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-sans",
  display: "swap",
});

const mono = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-mono",
  display: "swap",
});

/**
 * Handwritten-note accent used across the new homepage (reference:
 * `font-family: "Caveat", "Segoe Print", cursive`). Only touched by
 * elements that opt into `var(--font-script)` explicitly.
 */
const script = Caveat({
  subsets: ["latin"],
  weight: ["500"],
  variable: "--font-script",
  display: "swap",
});

// The root layout queries the DB for the navbar's latest-insights strip
// and menu-panel feature card. Without an explicit revalidate, that query
// ran fresh on every single page navigation site-wide (the layout is the
// one component every route shares). The list barely changes minute to
// minute, so it's cached and revalidated in the background instead.
export const revalidate = 300;

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: DEFAULT_TITLE,
    template: TITLE_TEMPLATE,
  },
  description: DEFAULT_DESCRIPTION,
  icons: {
    icon: "/logo.webp",
    apple: "/logo.webp",
  },
  keywords: [
    "medspa technology partner",
    "medspa software integrations",
    "practice operations automation",
    "aesthetic practice software",
    "AI agents for medspas",
  ],
  // Fallback only. Every route builds its own openGraph/twitter through
  // buildMetadata() in lib/seo.ts, because Next replaces (not merges) these
  // per route. No `url` here: a root-level og:url would be inherited by
  // routes that forget to set their own and point them at the homepage.
  openGraph: {
    title: DEFAULT_TITLE,
    description: DEFAULT_DESCRIPTION,
    type: "website",
    siteName: SITE_NAME,
  },
  twitter: {
    card: "summary_large_image",
    title: DEFAULT_TITLE,
    description: DEFAULT_DESCRIPTION,
  },
  verification: {
    other: {
      "msvalidate.01": "5D876744A3628BBB9AE59B8781B3B409",
    },
  },
};

export const viewport: Viewport = {
  // Mirrors --color-bg (app/globals.css); the browser chrome color can't
  // read a CSS variable, so it's kept in sync here by hand.
  themeColor: "#f4f4f4",
  width: "device-width",
  initialScale: 1,
};

export default async function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const latestInsights = (await listPublishedInsights({ limit: 5 })).map((insight) => ({
    slug: insight.slug,
    title: insight.title,
  }));

  return (
    <html
      lang="en"
      className={`${sans.variable} ${mono.variable} ${script.variable}`}
      suppressHydrationWarning
    >
      <head>
        {/* Dev only: in production this ran a whole-document MutationObserver on every page. */}
        {process.env.NODE_ENV !== "production" && (
          <script dangerouslySetInnerHTML={{ __html: SUPPRESS_HYDRATION_NOISE }} />
        )}
        {/* Without JS the reveal animation never runs, so force its end state. */}
        <noscript>
          <style>{".reveal{opacity:1 !important;transform:none !important}"}</style>
        </noscript>
      </head>
      <body className="min-h-screen font-sans antialiased" suppressHydrationWarning>
        <JsonLd data={organizationSchema} />
        <JsonLd data={websiteSchema} />
        {/*
          `overflow-x: clip` (not `hidden`) — `hidden` on one axis forces
          the other axis to `auto`, which turns this div into a new
          scroll container and breaks `position: sticky` for every
          descendant that sticks against the viewport (the how-we-work
          step stack, the contact/about sticky sidebars, the insights
          filter bar, the article TOC). `clip` still prevents horizontal
          overflow without creating that scroll context.
        */}
        <div className="relative z-10" style={{ maxWidth: "100%", overflowX: "clip" }}>
          <AvNavbar latestInsights={latestInsights} />
          <AvPageShell>{children}</AvPageShell>
        </div>
        <CookieConsentLoader />
        <GoogleAnalytics />
      </body>
    </html>
  );
}
