import { Logo } from "./Logo";

const COLS: { title: string; links: { label: string; href: string }[] }[] = [
  {
    title: "Product",
    links: [
      { label: "AI Audit", href: "#engine" },
      { label: "Agents", href: "#agents" },
      { label: "Inside Your System", href: "#system" },
      { label: "Results", href: "#results" },
    ],
  },
  {
    title: "Company",
    links: [
      { label: "About", href: "#" },
      { label: "Research", href: "#" },
      { label: "Security", href: "#" },
      { label: "Careers", href: "#" },
    ],
  },
  {
    title: "Resources",
    links: [
      { label: "Audit Sample", href: "#" },
      { label: "Compliance", href: "#" },
      { label: "Integrations", href: "#" },
      { label: "Contact", href: "#contact" },
    ],
  },
];

export function Footer() {
  return (
    <footer className="relative mt-24 border-t border-white/[0.06]">
      <div aria-hidden className="absolute inset-x-0 -top-px h-px bg-gradient-to-r from-transparent via-white/15 to-transparent" />
      <div className="mx-auto grid max-w-7xl gap-12 px-6 py-16 lg:grid-cols-[1.4fr_1fr_1fr_1fr]">
        <div className="space-y-5">
          <Logo />
          <p className="max-w-sm text-sm text-white/55">
            Avishkar builds the operating layer for healthcare's next decade — auditing systems with
            AI, identifying revenue leaks, and deploying agentic automation inside your environment.
          </p>
          <div className="flex flex-wrap gap-2">
            {["HIPAA-aligned", "SOC2 in progress", "BAA available"].map((t) => (
              <span
                key={t}
                className="rounded-full border border-white/10 bg-white/[0.03] px-3 py-1 font-mono text-[10px] uppercase tracking-[0.14em] text-white/55"
              >
                {t}
              </span>
            ))}
          </div>
        </div>
        {COLS.map((c) => (
          <div key={c.title}>
            <div className="mb-4 font-mono text-[11px] uppercase tracking-[0.2em] text-white/40">
              {c.title}
            </div>
            <ul className="space-y-2.5 text-sm">
              {c.links.map((l) => (
                <li key={l.label}>
                  <a
                    href={l.href}
                    className="text-white/70 transition-colors hover:text-white"
                  >
                    {l.label}
                  </a>
                </li>
              ))}
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
