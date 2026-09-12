"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

const navLinkStyle: React.CSSProperties = { color: "#4E5654" };
const navLinkActiveStyle: React.CSSProperties = { color: "#14181A", fontWeight: 500 };

const NAV_LINKS = [
  { href: "/#how", label: "What we do" },
  { href: "/#capabilities", label: "Solutions" },
  { href: "/#proof", label: "Case studies" },
  { href: "/insights", label: "Insights" },
  { href: "/#partner", label: "About" },
];

export function AvHeader() {
  const pathname = usePathname();
  const isInsights = pathname?.startsWith("/insights");
  const home = isInsights ? "/" : "/#top";
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    const onClick = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("keydown", onKey);
    document.addEventListener("mousedown", onClick);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("mousedown", onClick);
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <header
      ref={menuRef}
      style={{
        position: "sticky",
        top: 0,
        zIndex: 50,
        backdropFilter: "blur(14px)",
        background: "rgba(241,241,237,.82)",
        borderBottom: "1px solid rgba(20,24,26,.08)",
      }}
    >
      <div
        style={{
          maxWidth: 1240,
          margin: "0 auto",
          padding: "18px 32px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 24,
        }}
      >
        <Link href={home} style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <Image src="/logo.png" alt="" width={26} height={14} style={{ display: "block", width: "auto", height: 14 }} priority />
          <span style={{ fontSize: 19, fontWeight: 600, letterSpacing: "-.02em" }}>Avishkar</span>
        </Link>

        <nav
          className="av-desktop-nav"
          style={{
            display: "flex",
            alignItems: "center",
            gap: 26,
            fontSize: 14.5,
            color: "#4E5654",
            flexWrap: "wrap",
          }}
        >
          {NAV_LINKS.map((l) => (
            <Link key={l.href} href={l.href} style={l.href === "/insights" && isInsights ? navLinkActiveStyle : navLinkStyle}>
              {l.label}
            </Link>
          ))}
        </nav>

        <div className="av-desktop-cta" style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <Link
            href="/#early-access"
            className="av-early-access-pill"
            style={{
              fontSize: 13.5,
              fontWeight: 500,
              padding: "8px 14px",
              borderRadius: 999,
              color: "#245348",
              background: "rgba(47,107,95,.1)",
              border: "1px solid rgba(47,107,95,.28)",
              display: "inline-flex",
              alignItems: "center",
              gap: 7,
              whiteSpace: "nowrap",
            }}
          >
            <span
              style={{
                width: 6,
                height: 6,
                borderRadius: "50%",
                background: "#2F6B5F",
                display: "block",
                animation: "avPulse 2.4s ease-in-out infinite",
              }}
            />
            Early access
          </Link>
          <Link
            href="/contact"
            className="av-talk-btn"
            style={{
              fontSize: 14.5,
              fontWeight: 500,
              padding: "10px 18px",
              borderRadius: 999,
              background: "#14181A",
              color: "#F1F1ED",
              border: "1px solid #14181A",
              whiteSpace: "nowrap",
            }}
          >
            Talk to us
          </Link>
        </div>

        <div className="av-mobile-cta" style={{ display: "none", alignItems: "center", gap: 10 }}>
          <Link
            href="/contact"
            className="av-talk-btn"
            style={{
              fontSize: 14,
              fontWeight: 500,
              padding: "9px 16px",
              borderRadius: 999,
              background: "#14181A",
              color: "#F1F1ED",
              border: "1px solid #14181A",
              whiteSpace: "nowrap",
            }}
          >
            Talk to us
          </Link>
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
            className="av-hamburger-btn"
            style={{
              width: 44,
              height: 44,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              background: "transparent",
              border: "none",
              cursor: "pointer",
              flex: "none",
            }}
          >
            <span
              aria-hidden
              style={{
                position: "relative",
                width: 24,
                height: 24,
                display: "inline-block",
              }}
            >
              <span
                style={{
                  position: "absolute",
                  left: 0,
                  right: 0,
                  top: open ? 11 : 6,
                  height: 2,
                  background: "#14181A",
                  transition: "transform .25s ease, top .25s ease",
                  transform: open ? "rotate(45deg)" : "none",
                }}
              />
              <span
                style={{
                  position: "absolute",
                  left: 0,
                  right: 0,
                  top: 11,
                  height: 2,
                  background: "#14181A",
                  transition: "opacity .2s ease",
                  opacity: open ? 0 : 1,
                }}
              />
              <span
                style={{
                  position: "absolute",
                  left: 0,
                  right: 0,
                  top: open ? 11 : 16,
                  height: 2,
                  background: "#14181A",
                  transition: "transform .25s ease, top .25s ease",
                  transform: open ? "rotate(-45deg)" : "none",
                }}
              />
            </span>
          </button>
        </div>
      </div>

      <div
        className="av-mobile-menu"
        style={{
          maxHeight: open ? 480 : 0,
          overflow: "hidden",
          transition: "max-height .3s ease",
          background: "rgba(241,241,237,.98)",
          backdropFilter: "blur(14px)",
          borderTop: open ? "1px solid rgba(20,24,26,.08)" : "none",
        }}
      >
        <nav style={{ display: "flex", flexDirection: "column", padding: "8px 32px 20px" }} aria-label="Mobile">
          {NAV_LINKS.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              onClick={() => setOpen(false)}
              style={{
                display: "flex",
                alignItems: "center",
                minHeight: 48,
                fontSize: 16,
                color: l.href === "/insights" && isInsights ? "#14181A" : "#14181A",
                fontWeight: l.href === "/insights" && isInsights ? 600 : 400,
                borderBottom: "1px solid rgba(20,24,26,.08)",
              }}
            >
              {l.label}
            </Link>
          ))}
          <Link
            href="/#early-access"
            onClick={() => setOpen(false)}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              minHeight: 48,
              fontSize: 16,
              color: "#245348",
              fontWeight: 500,
            }}
          >
            <span
              style={{
                width: 6,
                height: 6,
                borderRadius: "50%",
                background: "#2F6B5F",
                display: "block",
                animation: "avPulse 2.4s ease-in-out infinite",
              }}
            />
            Early access
          </Link>
        </nav>
      </div>
    </header>
  );
}
