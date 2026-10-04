import Link from "next/link";
import { Roll } from "./Roll";
import { AUDITS, AREAS } from "@/lib/audits-data";
import { bits, PageHero, CtaBand, EmptyState, gradePct } from "./shared/PageBits";
import x from "./shared/PageExtras.module.css";

/** /audits — structure from reference/audits.html. */
export function AuditsPage() {
  return (
    <div className={bits.page}>
      <PageHero
        title="Practice Audits"
        lede="Teardowns of real practices' stacks, and exactly what we'd fix."
        badge="Booking ✱ Phones ✱ Follow-ups ✱ Data ✱ "
      />

      <section className={bits.section}>
        <div className={bits.sectionHead}>
          <h2 className={bits.h2}>Latest audits</h2>
          {AUDITS.length > 0 && <span className={bits.count}>{AUDITS.length} audits</span>}
        </div>
        {AUDITS.length > 0 ? (
          <div className={bits.grid2}>
            {AUDITS.map((a) => (
              <article key={a.slug} className={`${bits.card} ${x.auditCard} ${a.sample ? bits.sample : ""}`}>
                <div className={x.auditTop}>
                  <span>
                    {a.label} · {a.locations} location{a.locations > 1 ? "s" : ""}
                  </span>
                  {a.sample && <span className={`${bits.tag} ${bits.tagSample}`}>Sample</span>}
                </div>
                <h3>{a.headline}</h3>
                <div className={bits.score}>
                  {AREAS.map((area) => (
                    <div key={area}>
                      {area}
                      <em style={{ ["--w" as string]: `${gradePct(a.grades[area])}%` }} />
                      <strong>{a.grades[area]}</strong>
                    </div>
                  ))}
                </div>
                <Link href={`/audits/${a.slug}`} className={bits.btn}>
                  <Roll>Read audit</Roll>
                </Link>
              </article>
            ))}
          </div>
        ) : (
          <EmptyState
            title="The first audit publishes soon."
            body="Want yours to be next? We'll grade your stack for free."
            label="Get your free audit"
            href="/contact"
          />
        )}
      </section>

      <CtaBand
        title="Want your stack audited?"
        body="We'll grade it and show you where revenue slips out."
        label="Get your free audit"
        href="/contact"
      />
    </div>
  );
}
