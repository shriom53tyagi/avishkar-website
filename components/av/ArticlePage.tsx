"use client";

import { useEffect, useRef, useState, type CSSProperties } from "react";
import Image from "next/image";
import Link from "next/link";

const mono: CSSProperties = { fontFamily: "'DM Mono', monospace" };

export type ArticleSection = {
  id: string;
  heading: string;
};

export type ArticleSource = {
  sourceTitle: string;
  sourceUrl: string;
};

export type RelatedPost = {
  slug: string;
  cat: string;
  read: string;
  title: string;
  date: string;
};

export type Article = {
  slug: string;
  title: string;
  kicker: string;
  readTimeMinutes: number;
  dek: string;
  heroImageUrl: string;
  heroImageAlt: string;
  heroImageTagChipText: string | null;
  bylineName: string;
  date: string;
  sections: ArticleSection[];
  sources: ArticleSource[];
  bodyHtml: string;
};

export function ArticlePage({
  article,
  related,
}: {
  article: Article;
  related: RelatedPost[];
}) {
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
          {article.kicker}<span style={{ color: "#5E6664" }}>· {article.readTimeMinutes} min read</span>
        </div>
        <h1 className="av-rise" style={{ fontSize: "clamp(34px, 4.8vw, 66px)", lineHeight: 1.03, letterSpacing: "-.035em", fontWeight: 500, margin: "18px 0 0", maxWidth: "24ch", textWrap: "balance" }}>
          {article.title}
        </h1>
        <p style={{ fontSize: "clamp(17px,1.5vw,21px)", lineHeight: 1.55, color: "#4E5654", maxWidth: "58ch", margin: "22px 0 0", textWrap: "pretty" }}>
          {article.dek}
        </p>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 18, alignItems: "center", marginTop: 32, paddingBottom: 32, borderBottom: "1px solid rgba(20,24,26,.12)", fontSize: 13.5, color: "#6E7674" }}>
          <span style={{ width: 34, height: 34, borderRadius: "50%", background: "#DCE3DC", display: "block" }} />
          <span style={{ color: "#14181A", fontWeight: 500 }}>{article.bylineName}</span>
          <span>{article.date}</span>
        </div>

        <div style={{ position: "relative", marginTop: 40, borderRadius: 18, border: "1px solid rgba(20,24,26,.12)", minHeight: 360, overflow: "hidden", display: "flex", alignItems: "flex-end", padding: 18 }}>
          <Image
            src={article.heroImageUrl}
            alt={article.heroImageAlt}
            fill
            sizes="(max-width: 1240px) 100vw, 1176px"
            priority
            style={{ objectFit: "cover" }}
          />
          {article.heroImageTagChipText && (
            <span style={{ position: "relative", ...mono, fontSize: 11, color: "#586060", background: "rgba(248,248,245,.88)", padding: "6px 12px", borderRadius: 999 }}>{article.heroImageTagChipText}</span>
          )}
        </div>

        <div style={{ display: "flex", flexWrap: "wrap", gap: 56, marginTop: 56, alignItems: "flex-start" }}>
          <aside className="av-article-toc" style={{ flex: "1 1 200px", minWidth: 0, position: "sticky", top: 120 }}>
            <div style={{ ...mono, fontSize: 10.5, letterSpacing: ".12em", textTransform: "uppercase", color: "#5E6664" }}>In this piece</div>
            <div style={{ display: "flex", flexDirection: "column", gap: 10, marginTop: 14, fontSize: 14 }}>
              {article.sections.map((s) => (
                <a key={s.id} href={`#${s.id}`} style={{ color: "#4E5654" }}>{s.heading}</a>
              ))}
            </div>
          </aside>

          <div
            className="prose"
            style={{ flex: "3 1 560px", minWidth: 0, maxWidth: "68ch" }}
            dangerouslySetInnerHTML={{ __html: article.bodyHtml }}
          />
        </div>

        {article.sources.length > 0 && (
          <div style={{ marginTop: 56, paddingTop: 24, borderTop: "1px solid rgba(20,24,26,.12)" }}>
            <div style={{ ...mono, fontSize: 10.5, letterSpacing: ".12em", textTransform: "uppercase", color: "#5E6664" }}>Sources</div>
            <div style={{ display: "flex", flexDirection: "column", gap: 8, marginTop: 14, fontSize: 14 }}>
              {article.sources.map((s) => (
                <a key={s.sourceUrl} href={s.sourceUrl} target="_blank" rel="noopener noreferrer" style={{ color: "#4E5654" }}>
                  {s.sourceTitle}
                </a>
              ))}
            </div>
          </div>
        )}
      </article>

      <section style={{ maxWidth: 1240, margin: "0 auto", padding: "88px 32px 0" }}>
        <div style={{ borderRadius: 20, background: "#14181A", color: "#EDF0EC", padding: "clamp(32px,4.4vw,56px)" }}>
          <h2 style={{ fontSize: "clamp(26px,3vw,40px)", lineHeight: 1.06, letterSpacing: "-.03em", fontWeight: 500, margin: 0, maxWidth: "24ch" }}>Want this framework applied to your practice?</h2>
          <p style={{ fontSize: 16, lineHeight: 1.6, color: "#B2BAB7", margin: "14px 0 0", maxWidth: "50ch" }}>We&apos;ll walk your stack with you and come back with a keep / connect / build map. Thirty minutes, no deck.</p>
          <Link href="/contact" className="av-contact-btn" style={{ display: "inline-block", fontSize: 15.5, fontWeight: 500, padding: "15px 30px", borderRadius: 999, background: "#F1F1ED", color: "#14181A", marginTop: 28 }}>Talk to Avishkar</Link>
        </div>
      </section>

      {related.length > 0 && (
        <section style={{ maxWidth: 1240, margin: "0 auto", padding: "88px 32px 0" }}>
          <div style={{ ...mono, fontSize: 12, letterSpacing: ".12em", textTransform: "uppercase", color: "#586060" }}>Keep reading</div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 24, marginTop: 28 }}>
            {related.map((r) => (
              <Link href={`/insights/${r.slug}`} key={r.slug} style={{ flex: "1 1 300px", minWidth: 0, display: "block", borderTop: "1px solid rgba(20,24,26,.14)", paddingTop: 20 }}>
                <div style={{ display: "flex", gap: 10, ...mono, fontSize: 11, letterSpacing: ".1em", textTransform: "uppercase", color: "#2F6B5F" }}>{r.cat}<span style={{ color: "#5E6664" }}>· {r.read}</span></div>
                <div style={{ fontSize: 19, fontWeight: 500, lineHeight: 1.3, marginTop: 10, letterSpacing: "-.018em" }}>{r.title}</div>
                <div style={{ fontSize: 12.5, color: "#5E6664", marginTop: 10 }}>{r.date}</div>
              </Link>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
