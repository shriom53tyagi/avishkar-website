"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { Menu, X } from "lucide-react";
import { CTA, NAV_LINKS, BOOKING_URL } from "@/lib/content";
import { Container } from "@/components/ui/Container";
import { Logo } from "@/components/ui/Logo";
import { cn } from "@/lib/utils";

/**
 * Sticky header. It starts transparent so the hero's backdrop runs under it,
 * then picks up a background and border once the page scrolls — the border
 * only earns its place when there's content behind the bar to separate from.
 */
export function Navbar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const reduce = useReducedMotion();

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

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const isActive = (href: string) => pathname === href || pathname.startsWith(`${href}/`);

  return (
    <header
      className={cn(
        "sticky top-0 z-50 transition-colors duration-300",
        scrolled || open
          ? "border-b border-line bg-[#FBFAF7]/85 backdrop-blur-md"
          : "border-b border-transparent bg-transparent",
      )}
    >
      <Container>
        <div className="flex h-16 items-center justify-between">
          <Logo priority />

          <nav className="hidden items-center gap-1 md:flex" aria-label="Main">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                aria-current={isActive(link.href) ? "page" : undefined}
                className={cn(
                  "relative rounded px-3 py-2 text-[0.72rem] font-medium uppercase tracking-[0.2em] transition-colors",
                  isActive(link.href) ? "text-ink" : "text-ink-muted hover:text-ink",
                )}
              >
                {link.label}
                {isActive(link.href) && (
                  <motion.span
                    layoutId="nav-active"
                    aria-hidden
                    className="absolute inset-x-3 -bottom-px h-px bg-accent"
                    transition={{ duration: reduce ? 0 : 0.3, ease: [0.2, 0.9, 0.25, 1] }}
                  />
                )}
              </Link>
            ))}
            <Link
              href={BOOKING_URL}
              className="ml-3 rounded bg-accent px-4 py-2 text-[0.72rem] font-medium uppercase tracking-[0.2em] text-white transition-colors hover:bg-accent-hover"
            >
              {CTA.book}
            </Link>
          </nav>

          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            className="-mr-2 inline-flex h-10 w-10 items-center justify-center rounded text-ink transition-colors hover:bg-alt md:hidden"
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </Container>

      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            key="mobile-nav"
            className="overflow-hidden border-t border-line bg-canvas md:hidden"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: reduce ? 0 : 0.28, ease: [0.2, 0.9, 0.25, 1] }}
          >
            <Container>
              <nav className="flex flex-col py-4" aria-label="Main">
                {NAV_LINKS.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    aria-current={isActive(link.href) ? "page" : undefined}
                    className={cn(
                      "border-b border-line py-4 text-body transition-colors",
                      isActive(link.href) ? "text-ink" : "text-ink-muted",
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
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
