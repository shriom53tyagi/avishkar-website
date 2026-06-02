"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Menu, X } from "lucide-react";
import { Logo } from "./Logo";
import { Button } from "./Button";
import { NAV_LINKS } from "@/lib/data";
import { cn } from "@/lib/utils";

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <>
      <motion.header
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        className="fixed left-0 right-0 top-0 z-50 px-3 pt-3 sm:px-5 sm:pt-5"
      >
        <div
          className={cn(
            "mx-auto flex max-w-7xl items-center justify-between rounded-full px-4 py-2.5 transition-all duration-500",
            scrolled
              ? "border border-white/[0.08] bg-ink-900/70 backdrop-blur-xl shadow-[0_10px_40px_-20px_rgba(0,0,0,0.9)]"
              : "border border-transparent"
          )}
        >
          <Logo />
          <nav className="hidden items-center gap-1 md:flex">
            {NAV_LINKS.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                className="rounded-full px-3.5 py-1.5 text-[13px] text-white/65 transition-colors hover:text-white"
              >
                {l.label}
              </Link>
            ))}
          </nav>
          <div className="hidden items-center gap-2 md:flex">
            <Button href="/contact" variant="ghost">
              Contact
            </Button>
            <Button href="/contact" variant="primary" showArrow>
              Book an Operational Audit
            </Button>
          </div>
          <button
            aria-label="Open menu"
            onClick={() => setOpen(true)}
            className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-white/10 text-white/80 md:hidden"
          >
            <Menu className="h-4 w-4" />
          </button>
        </div>
      </motion.header>

      {open && (
        <div className="fixed inset-0 z-[60] md:hidden">
          <div
            className="absolute inset-0 bg-ink-950/80 backdrop-blur-md"
            onClick={() => setOpen(false)}
          />
          <motion.div
            initial={{ y: -10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="relative mx-3 mt-3 rounded-2xl border border-white/10 bg-ink-900/95 p-4 shadow-2xl"
          >
            <div className="flex items-center justify-between">
              <Logo />
              <button
                aria-label="Close menu"
                onClick={() => setOpen(false)}
                className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-white/10 text-white/80"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
            <div className="mt-4 grid gap-1">
              {NAV_LINKS.map((l) => (
                <Link
                  key={l.href}
                  href={l.href}
                  onClick={() => setOpen(false)}
                  className="rounded-xl px-3 py-3 text-[15px] text-white/80 hover:bg-white/5 hover:text-white"
                >
                  {l.label}
                </Link>
              ))}
            </div>
            <div className="mt-3 flex flex-col gap-2">
              <Button href="/contact" variant="primary" showArrow>
                Book an Operational Audit
              </Button>
              <Button href="/careers" variant="secondary">
                Careers
              </Button>
            </div>
          </motion.div>
        </div>
      )}
    </>
  );
}
