"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, ArrowUpRight } from "lucide-react";
import { Logo } from "./Logo";
import { NAV_LINKS } from "@/lib/data";
import { cn } from "@/lib/utils";

const SECTION_IDS = ["approach", "diagnosis", "audit", "agents", "results", "security", "faq"];

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("");

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 16);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const observers: IntersectionObserver[] = [];
    SECTION_IDS.forEach((id) => {
      const el = document.getElementById(id);
      if (!el) return;
      const obs = new IntersectionObserver(
        ([e]) => { if (e.isIntersecting) setActiveSection(id); },
        { rootMargin: "-40% 0px -55% 0px" }
      );
      obs.observe(el);
      observers.push(obs);
    });
    return () => observers.forEach((o) => o.disconnect());
  }, []);

  return (
    <>
      <motion.header
        initial={{ y: -24, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        className="fixed left-0 right-0 top-0 z-50 px-4 pt-4 sm:px-6 sm:pt-5"
      >
        <div className={cn(
          "mx-auto flex max-w-7xl items-center justify-between rounded-2xl px-4 py-2.5 transition-all duration-400",
          scrolled
            ? "bg-white/85 backdrop-blur-2xl shadow-[0_2px_20px_rgba(8,145,178,0.10),0_0_0_1px_rgba(8,145,178,0.10)] border border-white/80"
            : "bg-transparent border border-transparent"
        )}>
          <Logo />

          {/* Center nav */}
          <nav className="hidden items-center gap-0.5 md:flex" aria-label="Main navigation">
            {NAV_LINKS.map((l) => {
              const id = l.href.replace("/#", "");
              const active = activeSection === id;
              return (
                <Link
                  key={l.href}
                  href={l.href}
                  className={cn(
                    "relative rounded-xl px-3.5 py-2 text-[13.5px] font-medium transition-colors duration-200 cursor-pointer",
                    active
                      ? "text-[#0891B2]"
                      : "text-slate-500 hover:text-slate-900"
                  )}
                >
                  {l.label}
                  {active && (
                    <motion.span
                      layoutId="nav-underline"
                      className="absolute inset-x-3.5 -bottom-px h-[2px] rounded-full bg-[#0891B2]"
                      transition={{ type: "spring", stiffness: 380, damping: 36 }}
                    />
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Right CTAs */}
          <div className="hidden items-center gap-2 md:flex">
            <Link
              href="/contact"
              className="rounded-xl px-4 py-2 text-[13.5px] font-medium text-slate-500 transition-colors hover:text-slate-900 cursor-pointer"
            >
              Contact
            </Link>
            <Link href="/contact" className="cursor-pointer">
              <span className="inline-flex items-center gap-1.5 rounded-xl bg-[#0891B2] px-4 py-2 text-[13.5px] font-medium text-white transition-all duration-200 hover:bg-[#0E7490] hover:-translate-y-px shadow-[0_1px_4px_rgba(8,145,178,0.3)]">
                Book Audit
                <ArrowUpRight className="h-3.5 w-3.5" />
              </span>
            </Link>
          </div>

          {/* Mobile hamburger */}
          <button
            aria-label="Open menu"
            onClick={() => setOpen(true)}
            className="inline-flex h-9 w-9 cursor-pointer items-center justify-center rounded-xl border border-[rgba(8,145,178,0.2)] text-slate-600 transition-colors hover:bg-cyan-50 md:hidden"
          >
            <Menu className="h-4 w-4" />
          </button>
        </div>
      </motion.header>

      {/* Mobile drawer */}
      <AnimatePresence>
        {open && (
          <div className="fixed inset-0 z-[60] md:hidden">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-slate-900/20 backdrop-blur-sm"
              onClick={() => setOpen(false)}
            />
            <motion.div
              initial={{ y: -12, opacity: 0, scale: 0.98 }}
              animate={{ y: 0, opacity: 1, scale: 1 }}
              exit={{ y: -8, opacity: 0, scale: 0.98 }}
              transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
              className="relative mx-4 mt-4 overflow-hidden rounded-2xl border border-[rgba(8,145,178,0.14)] bg-white/95 p-4 shadow-[0_8px_40px_rgba(8,145,178,0.12)]"
            >
              <div className="flex items-center justify-between">
                <Logo />
                <button
                  aria-label="Close menu"
                  onClick={() => setOpen(false)}
                  className="inline-flex h-9 w-9 cursor-pointer items-center justify-center rounded-xl border border-slate-200 text-slate-500 transition-colors hover:bg-slate-50"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              <nav className="mt-4 grid gap-0.5">
                {NAV_LINKS.map((l) => (
                  <Link
                    key={l.href}
                    href={l.href}
                    onClick={() => setOpen(false)}
                    className="rounded-xl px-3 py-2.5 text-[15px] font-medium text-slate-700 transition-colors hover:bg-cyan-50 hover:text-[#0891B2] cursor-pointer"
                  >
                    {l.label}
                  </Link>
                ))}
              </nav>

              <div className="mt-4 flex flex-col gap-2 border-t border-slate-100 pt-4">
                <Link
                  href="/contact"
                  onClick={() => setOpen(false)}
                  className="flex cursor-pointer items-center justify-center gap-1.5 rounded-xl bg-[#0891B2] px-5 py-3 text-[14px] font-medium text-white transition-colors hover:bg-[#0E7490]"
                >
                  Book an Operational Audit
                  <ArrowUpRight className="h-4 w-4" />
                </Link>
                <Link
                  href="/contact"
                  onClick={() => setOpen(false)}
                  className="flex cursor-pointer items-center justify-center rounded-xl border border-[rgba(8,145,178,0.25)] px-5 py-3 text-[14px] font-medium text-[#0891B2] transition-colors hover:bg-cyan-50"
                >
                  Contact
                </Link>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
