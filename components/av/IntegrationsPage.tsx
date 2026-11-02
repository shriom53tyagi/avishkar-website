"use client";

import { useState } from "react";
import { INTEGRATIONS, CATEGORIES } from "@/lib/integrations-data";
import { bits, PageHero, CtaBand, Marquee } from "./shared/PageBits";
import x from "./shared/PageExtras.module.css";

const initials = (name: string) =>
  name
    .replace(/[^A-Za-z ]/g, "")
    .split(/\s+|(?=[A-Z])/)
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0])
    .join("")
    .toUpperCase();

/** /integrations — structure from reference/integrations.html. */
export function IntegrationsPage() {
  const [cat, setCat] = useState<string>("All");
  const visible = INTEGRATIONS.filter((i) => cat === "All" || i.cat === cat);
  const filters: [string, number][] = [
    ["All", INTEGRATIONS.length],
    ...CATEGORIES.map((c): [string, number] => [c, INTEGRATIONS.filter((i) => i.cat === c).length]),
  ];

  return (
    <div className={bits.page}>
      <PageHero
        title="Works with what you run."
        lede="Avishkar connects the systems your practice already pays for."
        badge="EMR ✱ CRM ✱ Booking ✱ Phones ✱ "
      />
      <Marquee items={INTEGRATIONS.map((i) => i.name)} />

      <section className={bits.section}>
        <div className={x.filters}>
          <div className={x.pills} role="group" aria-label="Filter by category">
            {filters.map(([c, n]) => (
              <button
                key={c}
                type="button"
                className={x.pill}
                aria-pressed={cat === c}
                disabled={n === 0}
                onClick={() => setCat(c)}
              >
                {c}
                <span>{n}</span>
              </button>
            ))}
          </div>
          <span className={bits.count} aria-live="polite">
            {visible.length} system{visible.length === 1 ? "" : "s"}
          </span>
        </div>
        <div className={bits.grid3}>
          {visible.map((i) => (
            <article key={i.name} className={`${bits.card} ${x.int} ${bits.lift}`} tabIndex={0}>
              <div className={x.mono} aria-hidden="true">
                {initials(i.name)}
              </div>
              <h3>{i.name}</h3>
              <div className={x.intMeta}>
                <span className={bits.tag}>{i.cat}</span>
                <span className={`${bits.tag} ${i.status === "Live" ? bits.tagLime : ""}`}>
                  {i.status}
                </span>
              </div>
              <div className={x.syncs}>
                <b>What syncs</b>
                {i.syncs || "Details coming soon"}
              </div>
            </article>
          ))}
        </div>
      </section>

      <CtaBand
        title="Don't see yours? Ask us."
        body="If it has an API or an export, we can usually connect it."
        label="Ask about an integration"
        href="/contact"
      />
    </div>
  );
}
