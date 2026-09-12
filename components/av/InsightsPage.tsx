"use client";

import { useState, type CSSProperties } from "react";
import Image from "next/image";
import Link from "next/link";

type Post = { title: string; cat: string; read: string; date: string; art: string; dek: string; img: string };

const ALL: Post[] = [
  { title: "The real cost of a five-tool front desk", cat: "Operations", read: "6 min", date: "Aug 28, 2026", art: "front desk detail", dek: "We timed the handoffs in three multi-room practices. The pattern was remarkably consistent — and expensive.", img: "https://images.unsplash.com/photo-1629909613654-28e377c37b09?auto=format&fit=crop&w=1200&q=80" },
  { title: "Where automation belongs — and where it doesn't", cat: "AI in aesthetics", read: "8 min", date: "Aug 14, 2026", art: "treatment room detail", dek: "A practical line between the messages a model should draft and the ones a nurse must read.", img: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=1200&q=80" },
  { title: "Memberships are a data problem, not a pricing one", cat: "Growth", read: "5 min", date: "Jul 31, 2026", art: "membership dashboard", dek: "Why retention programs stall when billing, booking and the chart don't share a definition of a member.", img: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=1200&q=80" },
  { title: "What a second location breaks first", cat: "Operations", read: "7 min", date: "Jul 17, 2026", art: "two-location floorplan", dek: "Inventory, provider credentials, and the schedule. In that order, almost every time.", img: "https://images.unsplash.com/photo-1608303588026-884930af2559?auto=format&fit=crop&w=1200&q=80" },
  { title: "Consent, photos, and the paperwork nobody audits", cat: "Technology", read: "9 min", date: "Jun 30, 2026", art: "chart interface", dek: "Aesthetic practices carry clinical risk with consumer-grade tooling. A calmer way to handle documentation.", img: "https://images.unsplash.com/photo-1551434678-e076c223a692?auto=format&fit=crop&w=1200&q=80" },
  { title: "The first ninety seconds of a patient relationship", cat: "Patient experience", read: "6 min", date: "Jun 12, 2026", art: "intake on tablet", dek: "Intake is the only moment where every patient touches your technology. Most practices waste it.", img: "https://images.unsplash.com/photo-1576091160550-2173dba999ef?auto=format&fit=crop&w=1200&q=80" },
  { title: "Reading your schedule like a P&L", cat: "Growth", read: "8 min", date: "May 29, 2026", art: "utilization chart", dek: "Revenue per chair hour changes which appointments you actually want. Here's how to see it.", img: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1200&q=80" },
  { title: "Buying vs. building in a $3M practice", cat: "Technology", read: "10 min", date: "May 8, 2026", art: "systems diagram", dek: "A blunt decision tree for practice owners weighing another subscription against a custom build.", img: "https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=1200&q=80" },
  { title: "Wellness services don't fit aesthetic software", cat: "Wellness", read: "7 min", date: "Apr 24, 2026", art: "wellness suite", dek: "Programs, packages and longitudinal care break tools designed around single treatments.", img: "https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=1200&q=80" },
];

const FEATURED_IMG = "https://images.unsplash.com/photo-1551076805-e1869033e561?auto=format&fit=crop&w=1200&q=80";

const CATS = ["All", "Operations", "Patient experience", "Growth", "AI in aesthetics", "Technology", "Wellness"];

const mono: CSSProperties = { fontFamily: "'DM Mono', monospace" };

export function InsightsPage() {
  const [cat, setCat] = useState("All");
  const [query, setQuery] = useState("");
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  const q = query.trim().toLowerCase();
  const filtered = ALL.filter(
    (p) =>
      (cat === "All" || p.cat === cat) &&
      (!q || (p.title + " " + p.dek + " " + p.cat).toLowerCase().includes(q))
  );
  const showFeature = cat === "All" && !q;

  const onSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim()) setSubscribed(true);
  };

  return (
    <div style={{ maxWidth: "100%", overflowX: "hidden" }}>
      <section style={{ maxWidth: 1240, margin: "0 auto", padding: "88px 32px 0" }}>
        <div className="av-rise" style={{ ...mono, fontSize: 12, letterSpacing: ".12em", textTransform: "uppercase", color: "#586060" }}>Insights</div>
        <h1 className="av-rise" style={{ fontSize: "clamp(38px, 5.6vw, 76px)", lineHeight: 1, letterSpacing: "-.036em", fontWeight: 500, margin: "20px 0 0", maxWidth: "20ch", textWrap: "balance" }}>
          Insights for the modern practice.
        </h1>
        <p style={{ fontSize: "clamp(16.5px,1.4vw,19px)", lineHeight: 1.6, color: "#4E5654", maxWidth: "58ch", margin: "22px 0 0", textWrap: "pretty" }}>
          Field notes on aesthetics, medspa operations, wellness, and the technology underneath — written by the people building it, for the people running the practice.
        </p>
      </section>

      <section style={{ maxWidth: 1240, margin: "0 auto", padding: "44px 32px 0" }}>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 16, alignItems: "center", justifyContent: "space-between", borderBottom: "1px solid rgba(20,24,26,.12)", paddingBottom: 18 }}>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
            {CATS.map((name) => {
              const active = name === cat;
              return (
                <button
                  key={name}
                  type="button"
                  onClick={() => setCat(name)}
                  style={{
                    cursor: "pointer",
                    fontFamily: "inherit",
                    fontSize: 13.5,
                    padding: "8px 15px",
                    borderRadius: 999,
                    transition: "all .3s ease",
                    background: active ? "#14181A" : "transparent",
                    color: active ? "#F1F1ED" : "#4E5654",
                    border: active ? "1px solid #14181A" : "1px solid rgba(20,24,26,.18)",
                  }}
                >
                  {name}
                </button>
              );
            })}
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 10, border: "1px solid rgba(20,24,26,.16)", borderRadius: 999, padding: "9px 16px", background: "#F8F8F5", minWidth: 220 }}>
            <span style={{ ...mono, fontSize: 12, color: "#5E6664" }}>⌕</span>
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search insights"
              style={{ flex: 1, minWidth: 0, border: "none", outline: "none", background: "transparent", fontFamily: "inherit", fontSize: 14, color: "#14181A" }}
            />
          </div>
        </div>
      </section>

      <section style={{ maxWidth: 1240, margin: "0 auto", padding: "40px 32px 0" }}>
        {showFeature && (
          <Link
            href="/insights/the-practice-operating-system-nobody-sold-you"
            style={{ display: "flex", flexWrap: "wrap", gap: 36, alignItems: "stretch", border: "1px solid rgba(20,24,26,.12)", borderRadius: 20, background: "#FDFDFB", padding: 22, boxShadow: "0 40px 80px -66px rgba(20,24,26,.55)" }}
          >
            <div style={{ position: "relative", flex: "1.15 1 360px", minWidth: 0, borderRadius: 14, border: "1px solid rgba(20,24,26,.1)", minHeight: 300, overflow: "hidden", display: "flex", alignItems: "flex-end", padding: 16 }}>
              <Image
                src={FEATURED_IMG}
                alt=""
                fill
                sizes="(max-width: 768px) 100vw, 500px"
                style={{ objectFit: "cover" }}
              />
              <span style={{ position: "relative", ...mono, fontSize: 10.5, color: "#586060", background: "rgba(248,248,245,.88)", padding: "5px 10px", borderRadius: 999 }}>lead image · treatment room</span>
            </div>
            <div style={{ flex: "1 1 340px", minWidth: 0, display: "flex", flexDirection: "column", justifyContent: "center", padding: "10px 10px 10px 0" }}>
              <div style={{ display: "flex", gap: 12, alignItems: "center", ...mono, fontSize: 11, letterSpacing: ".1em", textTransform: "uppercase", color: "#2F6B5F" }}>
                Featured<span style={{ color: "#5E6664" }}>· Practice management · 11 min</span>
              </div>
              <h2 style={{ fontSize: "clamp(26px,3.2vw,42px)", lineHeight: 1.08, letterSpacing: "-.03em", fontWeight: 500, margin: "16px 0 0", maxWidth: "22ch" }}>The practice operating system nobody sold you</h2>
              <p style={{ fontSize: 16, lineHeight: 1.6, color: "#4E5654", margin: "16px 0 0", maxWidth: "48ch", textWrap: "pretty" }}>
                Most growing practices assemble their technology one urgent decision at a time. Here&apos;s a framework for deciding what to keep, what to connect, and what to build — before the next location makes it harder.
              </p>
              <div style={{ display: "flex", alignItems: "center", gap: 12, marginTop: 24, fontSize: 13, color: "#6E7674" }}>
                <span style={{ width: 30, height: 30, borderRadius: "50%", background: "#DCE3DC" }} />
                Avishkar Editorial · Sep 4, 2026
              </div>
            </div>
          </Link>
        )}
      </section>

      <section style={{ maxWidth: 1240, margin: "0 auto", padding: "56px 32px 0" }}>
        <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", gap: 16, flexWrap: "wrap" }}>
          <div style={{ ...mono, fontSize: 12, letterSpacing: ".12em", textTransform: "uppercase", color: "#586060" }}>
            {filtered.length} {filtered.length === 1 ? "article" : "articles"}
          </div>
          <div style={{ ...mono, fontSize: 12, color: "#5E6664" }}>Newest first</div>
        </div>

        <div style={{ display: "flex", flexWrap: "wrap", gap: 24, marginTop: 28 }}>
          {filtered.map((p) => (
            <Link href="/insights/the-practice-operating-system-nobody-sold-you" key={p.title} style={{ flex: "1 1 330px", maxWidth: "100%", minWidth: 0, display: "block", borderTop: "1px solid rgba(20,24,26,.14)", paddingTop: 20 }}>
              <div style={{ position: "relative", height: 178, borderRadius: 14, border: "1px solid rgba(20,24,26,.12)", overflow: "hidden", display: "flex", alignItems: "flex-end", padding: 14 }}>
                <Image
                  src={p.img}
                  alt=""
                  fill
                  sizes="(max-width: 768px) 100vw, 380px"
                  style={{ objectFit: "cover" }}
                />
                <span style={{ position: "relative", ...mono, fontSize: 10.5, color: "#586060", background: "rgba(248,248,245,.85)", padding: "4px 9px", borderRadius: 999 }}>{p.art}</span>
              </div>
              <div style={{ display: "flex", gap: 10, alignItems: "center", marginTop: 16, ...mono, fontSize: 11, letterSpacing: ".1em", textTransform: "uppercase", color: "#2F6B5F" }}>
                {p.cat}<span style={{ color: "#5E6664" }}>· {p.read}</span>
              </div>
              <div style={{ fontSize: 20, fontWeight: 500, lineHeight: 1.3, marginTop: 10, letterSpacing: "-.018em" }}>{p.title}</div>
              <p style={{ fontSize: 14.5, lineHeight: 1.55, color: "#4E5654", margin: "8px 0 0" }}>{p.dek}</p>
              <div style={{ fontSize: 12.5, color: "#5E6664", marginTop: 12 }}>{p.date}</div>
            </Link>
          ))}
        </div>

        {filtered.length === 0 && (
          <div style={{ border: "1px dashed rgba(20,24,26,.22)", borderRadius: 14, padding: 40, textAlign: "center", color: "#6E7674", fontSize: 15 }}>
            Nothing matches that yet. Try another category or search term.
          </div>
        )}
      </section>

      <section style={{ maxWidth: 1240, margin: "0 auto", padding: "96px 32px 0" }}>
        <div style={{ borderRadius: 20, background: "#14181A", color: "#EDF0EC", padding: "clamp(32px,4.4vw,56px)", display: "flex", flexWrap: "wrap", gap: 40, alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ minWidth: 0 }}>
            <h2 style={{ fontSize: "clamp(26px,3vw,40px)", lineHeight: 1.06, letterSpacing: "-.03em", fontWeight: 500, margin: 0, maxWidth: "22ch" }}>One considered note a month. Nothing else.</h2>
            <p style={{ fontSize: 15.5, lineHeight: 1.6, color: "#B2BAB7", margin: "14px 0 0", maxWidth: "46ch" }}>Operations, technology, and what we&apos;re learning building for aesthetic practices.</p>
          </div>
          {!subscribed ? (
            <form onSubmit={onSubscribe} style={{ display: "flex", flexWrap: "wrap", gap: 10, flex: "1 1 340px", minWidth: 0 }}>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@yourpractice.com"
                className="av-subscribe-input"
                style={{ flex: "1 1 200px", minWidth: 0, fontFamily: "inherit", fontSize: 15, padding: "14px 18px", borderRadius: 999, border: "1px solid rgba(255,255,255,.22)", background: "rgba(255,255,255,.05)", color: "#F1F1ED", outline: "none" }}
              />
              <button type="submit" className="av-join-btn" style={{ fontFamily: "inherit", fontSize: 15, fontWeight: 500, padding: "14px 26px", borderRadius: 999, border: "none", background: "#2F6B5F", color: "#F8F8F5", cursor: "pointer" }}>
                Subscribe
              </button>
            </form>
          ) : (
            <div style={{ flex: "1 1 300px", border: "1px solid rgba(111,163,148,.35)", background: "rgba(47,107,95,.14)", borderRadius: 14, padding: "18px 20px", fontSize: 16 }}>
              Subscribed. Next issue goes out at the start of the month.
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
