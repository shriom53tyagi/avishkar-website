import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { Logo } from "@/components/ui/Logo";
import { FOOTER_AGENTS } from "@/lib/agents";
import {
  CONTACT_EMAIL,
  FOOTER_BRAND,
  FOOTER_LINKS,
  LEGAL_NOTE,
} from "@/lib/content";

function Column({
  title,
  links,
}: {
  title: string;
  links: { href: string; label: string }[];
}) {
  return (
    <div>
      <p className="eyebrow">{title}</p>
      <ul className="mt-4 space-y-3">
        {links.map((link) => (
          <li key={`${link.href}-${link.label}`}>
            {link.href.startsWith("http") || link.href.startsWith("mailto:") ? (
              <a
                href={link.href}
                className="text-small text-ink-muted transition-colors hover:text-ink"
                {...(link.href.startsWith("http")
                  ? { target: "_blank", rel: "noopener noreferrer" }
                  : {})}
              >
                {link.label}
              </a>
            ) : (
              <Link
                href={link.href}
                className="text-small text-ink-muted transition-colors hover:text-ink"
              >
                {link.label}
              </Link>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}

export function Footer() {
  const agentLinks = [
    ...FOOTER_AGENTS.map((a) => ({ href: `/agents/${a.slug}`, label: a.name })),
    { href: "/agents", label: "All agents" },
  ];

  return (
    <footer className="border-t border-line bg-surface">
      {/* Brand statement — the last thing we say before the links. */}
      <Container>
        <div className="border-b border-line py-16 md:py-20">
          <div className="max-w-measure">
            <h2 className="text-h2 text-ink">{FOOTER_BRAND.statement}</h2>
            <p className="mt-4 text-lead text-ink-muted">{FOOTER_BRAND.body}</p>
            <div className="mt-8">
              <Button href="/contact" arrow>
                {FOOTER_BRAND.cta}
              </Button>
            </div>
          </div>
        </div>
      </Container>

      <Container>
        <div className="grid grid-cols-2 gap-x-8 gap-y-12 py-14 md:grid-cols-3 lg:grid-cols-5">
          <div className="col-span-2 md:col-span-3 lg:col-span-1">
            <Logo />
            <p className="mt-4 max-w-xs text-small text-ink-muted">
              {FOOTER_BRAND.description}
            </p>
            <p className="mt-3 max-w-xs text-small text-ink-subtle">
              {FOOTER_BRAND.descriptionSub}
            </p>
          </div>

          <Column title="Explore" links={FOOTER_LINKS.explore} />
          <Column title="Agents" links={agentLinks} />
          <Column title="Company" links={FOOTER_LINKS.company} />
          <Column title="Connect" links={FOOTER_LINKS.connect} />
        </div>
      </Container>

      <div className="border-t border-line">
        <Container>
          <div className="flex flex-col gap-3 py-6 text-small text-ink-subtle md:flex-row md:items-center md:justify-between">
            <p>© {new Date().getFullYear()} Avishkar. All rights reserved.</p>
            <p className="max-w-xl md:text-right">
              {LEGAL_NOTE}{" "}
              <a href={`mailto:${CONTACT_EMAIL}`} className="text-ink-muted hover:text-ink">
                {CONTACT_EMAIL}
              </a>
            </p>
          </div>
        </Container>
      </div>
    </footer>
  );
}
