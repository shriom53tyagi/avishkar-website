"use client";

import type { CSSProperties } from "react";
import { AvCalendarEmbed } from "@/components/av/AvCalendarEmbed";

const mono: CSSProperties = { fontFamily: "'DM Mono', monospace" };
const CONTACT_EMAIL = "info@avishkar.app";

const PREP = [
  "The workflow that frustrates you most right now",
  "Who on the team touches it, and how often",
  "The systems that hold the data — CRM, scheduling, EMR, phones, spreadsheets",
  "What a good outcome would look like in a month",
];

export function ContactPage({ custom }: { custom: boolean }) {
  return (
    <div style={{ maxWidth: "100%", overflowX: "hidden" }}>
      <section style={{ maxWidth: 1240, margin: "0 auto", padding: "88px 32px 0" }}>
        <div className="av-rise" style={{ ...mono, fontSize: 12, letterSpacing: ".12em", textTransform: "uppercase", color: "#586060" }}>Talk to us</div>
        <h1
          className="av-rise"
          style={{
            fontSize: "clamp(36px, 5.2vw, 68px)",
            lineHeight: 1.02,
            letterSpacing: "-.036em",
            fontWeight: 500,
            margin: "20px 0 0",
            maxWidth: "20ch",
            textWrap: "balance",
          }}
        >
          {custom ? "Tell us what you're trying to solve." : "Book a 30-minute conversation."}
        </h1>
        <p style={{ fontSize: "clamp(16.5px,1.4vw,19px)", lineHeight: 1.6, color: "#4E5654", maxWidth: "58ch", margin: "22px 0 0", textWrap: "pretty" }}>
          {custom
            ? "The agents on our site are examples of current work, not a catalogue. Describe the problem and we'll tell you honestly what we'd build around it."
            : "Thirty minutes on the workflow you want to improve. We'll ask about the systems involved and where the time goes, then tell you where technology could help — and where it wouldn't."}
        </p>
      </section>

      <section style={{ maxWidth: 1240, margin: "0 auto", padding: "56px 32px 140px" }}>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 56, alignItems: "flex-start" }}>
          <div style={{ flex: "1.4 1 480px", minWidth: 0 }}>
            <h2 style={{ fontSize: "clamp(22px,2vw,28px)", lineHeight: 1.15, letterSpacing: "-.02em", fontWeight: 500, margin: 0 }}>Pick a time</h2>
            <p style={{ fontSize: 14.5, color: "#4E5654", margin: "8px 0 0" }}>
              Straight to the calendar. If nothing fits, email us and we&apos;ll find a slot.
            </p>
            <div style={{ marginTop: 24 }}>
              <AvCalendarEmbed />
            </div>
          </div>

          <div style={{ flex: "1 1 320px", minWidth: 0 }}>
            <h2 style={{ fontSize: "clamp(22px,2vw,28px)", lineHeight: 1.15, letterSpacing: "-.02em", fontWeight: 500, margin: 0 }}>Prefer email?</h2>
            <p style={{ fontSize: 14.5, lineHeight: 1.6, color: "#4E5654", margin: "8px 0 0" }}>
              Write to{" "}
              <a
                href={`mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(
                  custom ? "A problem we're trying to solve" : "30-minute conversation"
                )}`}
                style={{ color: "#2F6B5F", textDecoration: "underline", textUnderlineOffset: 4 }}
              >
                {CONTACT_EMAIL}
              </a>{" "}
              with a couple of lines about the workflow. We usually reply within one business day.
            </p>

            <h2 style={{ fontSize: "clamp(22px,2vw,28px)", lineHeight: 1.15, letterSpacing: "-.02em", fontWeight: 500, margin: "48px 0 0" }}>Worth having ready</h2>
            <ul style={{ marginTop: 20, display: "flex", flexDirection: "column", gap: 12, listStyle: "none", padding: 0 }}>
              {PREP.map((item) => (
                <li key={item} style={{ borderTop: "1px solid rgba(20,24,26,.14)", paddingTop: 12, fontSize: 14.5, color: "#4E5654" }}>
                  {item}
                </li>
              ))}
            </ul>

            <p style={{ marginTop: 32, fontSize: 13.5, color: "#6E7674" }}>
              No preparation is required. Nothing in the conversation obliges you to buy anything, and we won&apos;t ask for system access to have it.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
