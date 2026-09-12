"use client";

import { useEffect, useRef, useState, type CSSProperties } from "react";
import Image from "next/image";
import Link from "next/link";

const mono: CSSProperties = { fontFamily: "'DM Mono', monospace" };
const LEAD_IMG = "https://images.unsplash.com/photo-1629909615184-74f495363b67?auto=format&fit=crop&w=1600&q=80";

export function ArticlePage() {
  const [pct, setPct] = useState(0);
  const pctRef = useRef(0);

  useEffect(() => {
    const onScroll = () => {
      const el = document.scrollingElement || document.documentElement;
      const max = el.scrollHeight - el.clientHeight;
      const next = max > 0 ? Math.min(100, (el.scrollTop / max) * 100) : 0;
      if (Math.abs(next - pctRef.current) > 0.4) {
        pctRef.current = next;
        setPct(next);
      }
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const header = document.querySelector("header");
    if (!header) return;
    const setVar = () => {
      document.documentElement.style.setProperty("--header-h", `${header.getBoundingClientRect().height}px`);
    };
    setVar();
    const ro = new ResizeObserver(setVar);
    ro.observe(header);
    return () => ro.disconnect();
  }, []);

  return (
    <div style={{ maxWidth: "100%", overflowX: "hidden" }}>
      <div style={{ height: 3, background: "rgba(20,24,26,.08)", position: "sticky", top: "var(--header-h, 73px)", zIndex: 49 }}>
        <div style={{ height: "100%", background: "#2F6B5F", width: `${pct}%` }} />
      </div>

      <article style={{ maxWidth: 1240, margin: "0 auto", padding: "72px 32px 0" }}>
        <Link href="/insights" style={{ ...mono, fontSize: 12, letterSpacing: ".1em", textTransform: "uppercase", color: "#586060" }}>← All insights</Link>
        <div style={{ display: "flex", gap: 12, alignItems: "center", marginTop: 28, ...mono, fontSize: 11.5, letterSpacing: ".1em", textTransform: "uppercase", color: "#2F6B5F" }}>
          Practice management<span style={{ color: "#5E6664" }}>· 11 min read</span>
        </div>
        <h1 className="av-rise" style={{ fontSize: "clamp(34px, 4.8vw, 66px)", lineHeight: 1.03, letterSpacing: "-.035em", fontWeight: 500, margin: "18px 0 0", maxWidth: "24ch", textWrap: "balance" }}>
          The practice operating system nobody sold you
        </h1>
        <p style={{ fontSize: "clamp(17px,1.5vw,21px)", lineHeight: 1.55, color: "#4E5654", maxWidth: "58ch", margin: "22px 0 0", textWrap: "pretty" }}>
          Most growing practices assemble their technology one urgent decision at a time. A framework for deciding what to keep, what to connect, and what to build — before the next location makes it harder.
        </p>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 18, alignItems: "center", marginTop: 32, paddingBottom: 32, borderBottom: "1px solid rgba(20,24,26,.12)", fontSize: 13.5, color: "#6E7674" }}>
          <span style={{ width: 34, height: 34, borderRadius: "50%", background: "#DCE3DC", display: "block" }} />
          <span style={{ color: "#14181A", fontWeight: 500 }}>Avishkar Editorial</span>
          <span>Sep 4, 2026</span>
        </div>

        <div style={{ position: "relative", marginTop: 40, borderRadius: 18, border: "1px solid rgba(20,24,26,.12)", minHeight: 360, overflow: "hidden", display: "flex", alignItems: "flex-end", padding: 18 }}>
          <Image
            src={LEAD_IMG}
            alt=""
            fill
            sizes="(max-width: 1240px) 100vw, 1176px"
            priority
            style={{ objectFit: "cover" }}
          />
          <span style={{ position: "relative", ...mono, fontSize: 11, color: "#586060", background: "rgba(248,248,245,.88)", padding: "6px 12px", borderRadius: 999 }}>lead image · clinic interior, 16:9</span>
        </div>

        <div style={{ display: "flex", flexWrap: "wrap", gap: 56, marginTop: 56, alignItems: "flex-start" }}>
          <aside className="av-article-toc" style={{ flex: "1 1 200px", minWidth: 0, position: "sticky", top: 120 }}>
            <div style={{ ...mono, fontSize: 10.5, letterSpacing: ".12em", textTransform: "uppercase", color: "#5E6664" }}>In this piece</div>
            <div style={{ display: "flex", flexDirection: "column", gap: 10, marginTop: 14, fontSize: 14 }}>
              <a href="#s1" style={{ color: "#4E5654" }}>The accidental stack</a>
              <a href="#s2" style={{ color: "#4E5654" }}>Four questions before you buy</a>
              <a href="#s3" style={{ color: "#4E5654" }}>Keep, connect, or build</a>
              <a href="#s4" style={{ color: "#4E5654" }}>What to do this quarter</a>
            </div>
          </aside>

          <div style={{ flex: "3 1 560px", minWidth: 0, maxWidth: "68ch" }}>
            <p style={{ fontSize: 18.5, lineHeight: 1.7, color: "#23282A", margin: 0 }}>
              A practice at two million dollars in revenue and a practice at six million rarely differ in the quality of care. They differ in how many decisions the owner still has to make personally. Technology is how that gap closes — or doesn&apos;t.
            </p>
            <p style={{ fontSize: 18.5, lineHeight: 1.7, color: "#23282A", margin: "24px 0 0" }}>
              The pattern we see over and over: nothing was chosen badly. The booking tool was right in year one. The EMR was right when the first injector joined. The spreadsheet was a reasonable stopgap. Each decision was locally correct and collectively expensive.
            </p>

            <h2 id="s1" style={{ fontSize: "clamp(24px,2.6vw,34px)", lineHeight: 1.15, letterSpacing: "-.026em", fontWeight: 500, margin: "48px 0 0" }}>The accidental stack</h2>
            <p style={{ fontSize: 18.5, lineHeight: 1.7, color: "#23282A", margin: "18px 0 0" }}>
              Ask a front desk lead to narrate a single patient visit and count the systems they touch. Six is common. Each boundary between two systems is a place where a human becomes the integration — retyping a phone number, re-checking a consent, remembering that this patient is mid-series.
            </p>

            <blockquote className="av-article-quote" style={{ margin: "36px 0 0", padding: "26px 28px", borderRadius: 14, background: "#14181A", color: "#EDF0EC" }}>
              <div style={{ fontSize: 21, lineHeight: 1.45, maxWidth: "44ch" }}>&ldquo;The software wasn&apos;t the problem. The gaps between the software were the problem.&rdquo;</div>
              <div style={{ ...mono, fontSize: 11.5, color: "#98A19E", marginTop: 14 }}>Owner, four-location medspa group</div>
            </blockquote>

            <h2 id="s2" style={{ fontSize: "clamp(24px,2.6vw,34px)", lineHeight: 1.15, letterSpacing: "-.026em", fontWeight: 500, margin: "48px 0 0" }}>Four questions before you buy anything else</h2>
            <div style={{ display: "flex", flexDirection: "column", gap: 14, marginTop: 22 }}>
              {[
                ["01", "Who becomes the integration?", "If the answer is a person at the front desk, you are buying labor, not software."],
                ["02", "Where does the patient record actually live?", "One system should be the source of truth. Every other tool should read from it."],
                ["03", "Can you get your data out?", "An export button is not an API. Ask before signing, not at renewal."],
                ["04", "Does it survive a second location?", "Per-site instances that can't roll up will force a migration exactly when you're busiest."],
              ].map(([n, title, body]) => (
                <div key={n} style={{ display: "flex", gap: 14, border: "1px solid rgba(20,24,26,.12)", borderRadius: 12, background: "#FDFDFB", padding: "18px 20px" }}>
                  <span style={{ ...mono, fontSize: 12, color: "#2F6B5F", flex: "none", paddingTop: 3 }}>{n}</span>
                  <div>
                    <div style={{ fontSize: 16.5, fontWeight: 500 }}>{title}</div>
                    <p style={{ fontSize: 15.5, lineHeight: 1.6, color: "#4E5654", margin: "6px 0 0" }}>{body}</p>
                  </div>
                </div>
              ))}
            </div>

            <h2 id="s3" style={{ fontSize: "clamp(24px,2.6vw,34px)", lineHeight: 1.15, letterSpacing: "-.026em", fontWeight: 500, margin: "48px 0 0" }}>Keep, connect, or build</h2>
            <p style={{ fontSize: 18.5, lineHeight: 1.7, color: "#23282A", margin: "18px 0 0" }}>
              Sort every tool into one of three buckets. <strong style={{ fontWeight: 600 }}>Keep</strong> the ones your team is fluent in and that hold clinical or financial record. <strong style={{ fontWeight: 600 }}>Connect</strong> the ones that are fine but isolated. <strong style={{ fontWeight: 600 }}>Build</strong> only where your model of care is genuinely unusual — a proprietary protocol, a membership structure nobody sells software for, a device that needs to talk to the chart.
            </p>
            <p style={{ fontSize: 18.5, lineHeight: 1.7, color: "#23282A", margin: "24px 0 0" }}>
              Practices that skip the sorting exercise tend to over-build. Practices that never do it at all keep hiring around the problem.
            </p>

            <h2 id="s4" style={{ fontSize: "clamp(24px,2.6vw,34px)", lineHeight: 1.15, letterSpacing: "-.026em", fontWeight: 500, margin: "48px 0 0" }}>What to do this quarter</h2>
            <p style={{ fontSize: 18.5, lineHeight: 1.7, color: "#23282A", margin: "18px 0 0" }}>
              Pick the single handoff that costs your team the most time — usually the one between booking and the chart — and fix that one properly. Measure it before and after in hours, not opinions. A practice that closes one gap per quarter is unrecognizable in a year.
            </p>
          </div>
        </div>
      </article>

      <section style={{ maxWidth: 1240, margin: "0 auto", padding: "88px 32px 0" }}>
        <div style={{ borderRadius: 20, background: "#14181A", color: "#EDF0EC", padding: "clamp(32px,4.4vw,56px)" }}>
          <h2 style={{ fontSize: "clamp(26px,3vw,40px)", lineHeight: 1.06, letterSpacing: "-.03em", fontWeight: 500, margin: 0, maxWidth: "24ch" }}>Want this framework applied to your practice?</h2>
          <p style={{ fontSize: 16, lineHeight: 1.6, color: "#B2BAB7", margin: "14px 0 0", maxWidth: "50ch" }}>We&apos;ll walk your stack with you and come back with a keep / connect / build map. Thirty minutes, no deck.</p>
          <Link href="/contact" className="av-contact-btn" style={{ display: "inline-block", fontSize: 15.5, fontWeight: 500, padding: "15px 30px", borderRadius: 999, background: "#F1F1ED", color: "#14181A", marginTop: 28 }}>Talk to Avishkar</Link>
        </div>
      </section>

      <section style={{ maxWidth: 1240, margin: "0 auto", padding: "88px 32px 0" }}>
        <div style={{ ...mono, fontSize: 12, letterSpacing: ".12em", textTransform: "uppercase", color: "#586060" }}>Keep reading</div>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 24, marginTop: 28 }}>
          {[
            ["Operations", "6 min", "The real cost of a five-tool front desk", "Aug 28, 2026"],
            ["AI in aesthetics", "8 min", "Where automation belongs — and where it doesn't", "Aug 14, 2026"],
            ["Growth", "5 min", "Memberships are a data problem, not a pricing one", "Jul 31, 2026"],
          ].map(([cat, read, title, date]) => (
            <Link href="/insights/the-practice-operating-system-nobody-sold-you" key={title} style={{ flex: "1 1 300px", minWidth: 0, display: "block", borderTop: "1px solid rgba(20,24,26,.14)", paddingTop: 20 }}>
              <div style={{ display: "flex", gap: 10, ...mono, fontSize: 11, letterSpacing: ".1em", textTransform: "uppercase", color: "#2F6B5F" }}>{cat}<span style={{ color: "#5E6664" }}>· {read}</span></div>
              <div style={{ fontSize: 19, fontWeight: 500, lineHeight: 1.3, marginTop: 10, letterSpacing: "-.018em" }}>{title}</div>
              <div style={{ fontSize: 12.5, color: "#5E6664", marginTop: 10 }}>{date}</div>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
