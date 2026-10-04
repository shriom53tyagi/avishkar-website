import Link from "next/link";
import { Roll } from "./Roll";
import { AREAS, type Audit } from "@/lib/audits-data";
import { bits } from "./shared/PageBits";
import x from "./shared/PageExtras.module.css";

const TILE: Record<string, string> = { A: x.gA, B: x.gB, C: x.gC, D: x.gD, F: x.gD };

/**
 * /audits/[slug] — the reference's dialog as a real route. The grade tiles
 * animate in one at a time via staggered CSS animation (--i); reduced
 * motion shows the end state.
 */
export function AuditDetailPage({ audit }: { audit: Audit }) {
  return (
    <div className={bits.page}>
      <header className={x.detailHead}>
        <Link href="/audits" className={x.back}>
          ← All audits
        </Link>
        <p style={{ marginTop: "1.5rem" }}>
          <span className={`${bits.tag} ${audit.sample ? bits.tagSample : ""}`}>
            {audit.label}
            {audit.sample ? " · Sample" : ""}
          </span>
        </p>
        <h1>{audit.headline}</h1>
      </header>

      <section className={bits.section} style={{ paddingTop: 0 }}>
        <div className={x.board}>
          {AREAS.map((area, i) => (
            <div key={area} className={`${x.g} ${TILE[audit.grades[area][0]] ?? ""}`} style={{ ["--i" as string]: i }}>
              <b>{audit.grades[area]}</b>
              <small>{area}</small>
            </div>
          ))}
        </div>

        <div className={x.cols}>
          <div className={bits.card}>
            <h2>What we found</h2>
            <ul>
              {audit.found.map((f) => (
                <li key={f}>
                  <i aria-hidden="true">!</i>
                  <span>{f}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className={`${bits.card} ${x.fix}`}>
            <h2>What we&apos;d fix</h2>
            <ul>
              {audit.fix.map((f) => (
                <li key={f}>
                  <i aria-hidden="true">✓</i>
                  <span>{f}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <section className={bits.section}>
        <div className={`${bits.dark} ${bits.ctaRow}`}>
          <h2 className={bits.h2}>See how your stack grades.</h2>
          <Link href="/contact" className={`${bits.btn} ${bits.btnLime} ${bits.btnLg}`}>
            <Roll>Get your free audit</Roll>
          </Link>
        </div>
      </section>
    </div>
  );
}
