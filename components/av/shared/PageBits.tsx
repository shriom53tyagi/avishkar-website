import Link from "next/link";
import { Roll } from "@/components/av/Roll";
import type { Grade } from "@/lib/audits-data";
import styles from "./PageBits.module.css";

export { styles as bits };

export function PageHero({ title, lede, badge }: { title: string; lede: string; badge: string }) {
  return (
    <section className={styles.hero}>
      <div>
        <h1 className={styles.title}>
          <span className={styles.ln}>
            <span>{title}</span>
          </span>
        </h1>
        <p className={styles.lede}>{lede}</p>
      </div>
      <div className={styles.badge} aria-hidden="true">
        <svg viewBox="0 0 136 136">
          <defs>
            <path id="badge-circle" d="M68,68 m-52,0 a52,52 0 1,1 104,0 a52,52 0 1,1 -104,0" />
          </defs>
          <text>
            <textPath href="#badge-circle">{badge}</textPath>
          </text>
        </svg>
      </div>
    </section>
  );
}

export function CtaBand({
  title,
  body,
  label,
  href,
}: {
  title: string;
  body: string;
  label: string;
  href: string;
}) {
  return (
    <section className={styles.section}>
      <div className={`${styles.dark} ${styles.ctaRow}`}>
        <div>
          <h2 className={styles.h2}>{title}</h2>
          <p>{body}</p>
        </div>
        <Link href={href} className={`${styles.btn} ${styles.btnLime} ${styles.btnLg}`}>
          <Roll>{label}</Roll>
        </Link>
      </div>
    </section>
  );
}

export function EmptyState({
  title,
  body,
  label,
  href,
}: {
  title: string;
  body: string;
  label: string;
  href: string;
}) {
  return (
    <div className={styles.empty}>
      <strong>{title}</strong>
      {body}
      <br />
      <Link href={href} className={styles.btn}>
        <Roll>{label}</Roll>
      </Link>
    </div>
  );
}

export function Marquee({ items }: { items: string[] }) {
  const group = (
    <div className={styles.bandGrp}>
      {items.map((item) => (
        <span key={item} style={{ display: "contents" }}>
          <span>{item}</span>
          <b>✱</b>
        </span>
      ))}
    </div>
  );
  return (
    <div className={styles.band} aria-hidden="true">
      <div className={styles.bandTrack}>
        {group}
        {group}
      </div>
    </div>
  );
}

const GRADE_PCT: Record<string, number> = { A: 90, B: 75, C: 55, D: 35, F: 15 };
export function gradePct(grade: Grade): number {
  const base = GRADE_PCT[grade[0]] ?? 50;
  return grade.endsWith("+") ? base + 7 : grade.endsWith("-") ? base - 7 : base;
}
