"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";
import { CTA, NAV_LINKS, BOOKING_URL } from "@/lib/content";
import { Container } from "@/components/ui/Container";
import { Logo } from "@/components/ui/Logo";
import { cn } from "@/lib/utils";

export function Navbar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  // Close the mobile panel on navigation.
  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  // Lock scroll while the mobile panel is open.
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  const isActive = (href: string) => pathname === href || pathname.startsWith(`${href}/`);

  return (
    <header className="sticky top-0 z-50 border-b border-line bg-canvas/95 backdrop-blur-[2px]">
      <Container>
        <div className="flex h-16 items-center justify-between">
          <Logo priority />

          <nav className="hidden items-center gap-8 md:flex" aria-label="Main">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "border-b-2 py-1 text-small transition-colors",
                  isActive(link.href)
                    ? "border-accent text-ink"
                    : "border-transparent text-ink-muted hover:text-ink"
                )}
              >
                {link.label}
              </Link>
            ))}
            <Link
              href={BOOKING_URL}
              className="rounded bg-accent px-4 py-2 text-small font-medium text-white transition-colors hover:bg-accent-hover"
            >
              {CTA.book}
            </Link>
          </nav>

          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            className="-mr-2 inline-flex h-10 w-10 items-center justify-center text-ink md:hidden"
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </Container>

      {open && (
        <div className="border-t border-line bg-canvas md:hidden">
          <Container>
            <nav className="flex flex-col py-4" aria-label="Main">
              {NAV_LINKS.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    "border-b border-line py-4 text-body",
                    isActive(link.href) ? "text-ink" : "text-ink-muted"
                  )}
                >
                  {link.label}
                </Link>
              ))}
              <Link
                href={BOOKING_URL}
                className="mt-5 rounded bg-accent px-5 py-3.5 text-center text-small font-medium text-white"
              >
                {CTA.book}
              </Link>
            </nav>
          </Container>
        </div>
      )}
    </header>
  );
}
