import Link from "next/link";
import { Linkedin, Twitter, Github, Youtube } from "lucide-react";
import { Logo } from "./Logo";
import { VisitorCounter } from "./VisitorCounter";
import { CONTACT_EMAIL, SOCIAL_LINKS } from "@/lib/data";

/**
 * Footer columns. Anchor targets use the `/#id` form so they resolve to the
 * correct home-page section even when the user is on a sub-page (/contact,
 * /careers). Contact and Careers are now their own routes.
 */
const COLS: { title: string; links: { label: string; href: string }[] }[] = [
  {
    title: "Product",
    links: [
      { label: "Why Avishkar", href: "/#why" },
      { label: "Operational Audit", href: "/#engine" },
      { label: "Agents", href: "/#agents" },
      { label: "Results", href: "/#results" },
    ],
  },
  {
    title: "Company",
    links: [
      { label: "Revenue Recovery", href: "/#revenue" },
      { label: "How We Deploy", href: "/#deployments" },
      { label: "Security", href: "/#security" },
      { label: "Careers", href: "/careers" },
    ],
  },
  {
    title: "Resources",
    links: [
      { label: "Operational Audit", href: "/#engine" },
      { label: "Compliance", href: "/#security" },
      { label: "Results", href: "/#results" },
      { label: "Contact", href: "/contact" },
    ],
  },
];

/** Map social icon keys → lucide components (X reuses the Twitter glyph). */
const SOCIAL_ICONS = {
  linkedin: Linkedin,
  x: Twitter,
  github: Github,
  youtube: Youtube,
} as const;

export function Footer() {
  return (
    <footer className="relative mt-24 border-t border-white/[0.06]">
      <div aria-hidden className="absolute inset-x-0 -top-px h-px bg-gradient-to-r from-transparent via-white/15 to-transparent" />
      <div className="mx-auto grid max-w-7xl gap-12 px-6 py-16 lg:grid-cols-[1.4fr_1fr_1fr_1fr]">
        <div className="space-y-5">
          <Logo />
          <p className="max-w-sm text-sm text-white/55">
            Avishkar is an operational intelligence and revenue recovery company for healthcare. We
            audit your operations, quantify hidden revenue leakage, and deploy AI agents only where
            measurable ROI exists.
          </p>
          <div className="flex flex-wrap gap-2">
            {["HIPAA-aligned", "SOC 2 in progress", "BAA available"].map((t) => (
              <span
                key={t}
                className="rounded-full border border-white/10 bg-white/[0.03] px-3 py-1 font-mono text-[10px] uppercase tracking-[0.14em] text-white/55"
              >
                {t}
              </span>
            ))}
          </div>

          {/* Social links */}
          <div className="flex items-center gap-2.5">
            {SOCIAL_LINKS.map((s) => {
              const Icon = SOCIAL_ICONS[s.icon as keyof typeof SOCIAL_ICONS];
              return (
                <a
                  key={s.label}
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={s.label}
                  className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-white/10 bg-white/[0.03] text-white/60 transition-colors hover:border-white/25 hover:text-white"
                >
                  <Icon className="h-4 w-4" />
                </a>
              );
            })}
          </div>

          {/* Live, server-persisted visitor counter */}
          <VisitorCounter className="mt-1" />
        </div>

        {COLS.map((c) => (
          <div key={c.title}>
            <div className="mb-4 font-mono text-[11px] uppercase tracking-[0.2em] text-white/40">
              {c.title}
            </div>
            <ul className="space-y-2.5 text-sm">
              {c.links.map((l) => (
                <li key={l.label}>
                  <Link
                    href={l.href}
                    className="text-white/70 transition-colors hover:text-white"
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
              {/* Direct email for the relevant columns */}
              {c.title === "Resources" && (
                <li>
                  <a
                    href={`mailto:${CONTACT_EMAIL}`}
                    className="text-white/70 transition-colors hover:text-white"
                  >
                    {CONTACT_EMAIL}
                  </a>
                </li>
              )}
            </ul>
          </div>
        ))}
      </div>
      <div className="border-t border-white/[0.06]">
        <div className="mx-auto flex max-w-7xl flex-col gap-2 px-6 py-6 text-xs text-white/45 sm:flex-row sm:items-center sm:justify-between">
          <div>© {new Date().getFullYear()} Avishkar Systems, Inc. All rights reserved.</div>
          <div className="font-mono uppercase tracking-[0.16em]">
            <span className="text-white/35">build</span> · 2026.05 · sha 9c14a0
          </div>
        </div>
      </div>
    </footer>
  );
}
