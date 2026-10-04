"use client";

import { useEffect, useRef, useState } from "react";
import { Roll } from "./Roll";
import { isValidEmail } from "@/lib/early-access";
import { METRICS, SHOW_SAMPLES, type Metric } from "@/lib/benchmarks-config";
import { readReducedMotion } from "./home/shared/useReducedMotion";
import { bits, PageHero } from "./shared/PageBits";
import x from "./shared/PageExtras.module.css";

const clamp = (m: Metric, v: number) => Math.max(m.min, Math.min(m.max, Math.round(v)));
const pct = (m: Metric, v: number) => ((v - m.min) / (m.max - m.min)) * 100;

/** Animated number that eases to `value` (instant under reduced motion). */
function Counter({ value }: { value: number }) {
  const [shown, setShown] = useState(value);
  const from = useRef(value);
  useEffect(() => {
    if (readReducedMotion() || from.current === value) {
      from.current = value;
      setShown(value);
      return;
    }
    const start = from.current;
    const t0 = performance.now();
    let raf = 0;
    const tick = (t: number) => {
      const p = Math.min(1, (t - t0) / 500);
      setShown(Math.round(start + (value - start) * (1 - Math.pow(1 - p, 3))));
      if (p < 1) raf = requestAnimationFrame(tick);
      else from.current = value;
    };
    raf = requestAnimationFrame(tick);
    return () => {
      cancelAnimationFrame(raf);
      from.current = value;
    };
  }, [value]);
  return <>{shown}</>;
}

function Verdict({ m, value }: { m: Metric; value: number }) {
  const avg = m.average.value;
  if (avg == null) return <b>Industry average not set</b>;
  const diff = value - avg;
  if (diff === 0) return <b>On par with average</b>;
  const good = m.better === "lower" ? diff < 0 : diff > 0;
  const gap = Math.abs(diff);
  return (
    <>
      <b className={good ? x.up : ""}>{good ? "Ahead of" : "Behind"} average</b> by {gap}
      {m.unit === "%" ? " pts" : ` ${m.unit}`}
    </>
  );
}

/** /benchmarks — structure and interactions from reference/benchmarks.html. */
export function BenchmarksPage() {
  const [raw, setRaw] = useState<Record<string, string>>(() =>
    Object.fromEntries(METRICS.map((m) => [m.id, String(m.initial)])),
  );
  const [msg, setMsg] = useState<{ ok: boolean; text: string } | null>(null);
  const value = (m: Metric) => clamp(m, Number(raw[m.id]) || 0);
  const sourced = METRICS.filter((m) => m.average.value != null);

  return (
    <div className={bits.page}>
      <PageHero
        title="Benchmarks"
        lede="How your numbers compare on no-shows, rebooking and response time."
        badge="No-shows ✱ Rebooking ✱ Response ✱ "
      />

      <section className={bits.section}>
        {SHOW_SAMPLES && (
          <div className={bits.notice} role="note">
            <b>Sample data.</b> The industry averages here are placeholders, not real figures. Add sourced values in
            lib/benchmarks-config.ts before publishing.
          </div>
        )}
        <div className={x.tool}>
          <div className={bits.card}>
            <h2>Your practice</h2>
            <p className={x.subT}>Drag or type your numbers. Nothing is saved.</p>
            {METRICS.map((m) => (
              <div className={x.mi} key={m.id}>
                <div className={x.miHead}>
                  <label htmlFor={`r-${m.id}`}>{m.name}</label>
                  <div className={x.num}>
                    <input
                      type="number"
                      inputMode="numeric"
                      min={m.min}
                      max={m.max}
                      step={m.step}
                      value={raw[m.id]}
                      aria-label={`${m.name} value`}
                      onChange={(e) => setRaw((r) => ({ ...r, [m.id]: e.target.value }))}
                      onBlur={() => setRaw((r) => ({ ...r, [m.id]: String(value(m)) }))}
                    />
                    <span>{m.unit}</span>
                  </div>
                </div>
                <input
                  id={`r-${m.id}`}
                  type="range"
                  min={m.min}
                  max={m.max}
                  step={m.step}
                  value={value(m)}
                  onChange={(e) => setRaw((r) => ({ ...r, [m.id]: e.target.value }))}
                />
              </div>
            ))}
          </div>

          <div className={bits.card} aria-live="polite">
            <div className={x.legend}>
              <span>
                <i className={x.l1} />
                Your practice
              </span>
              <span>
                <i className={x.l2} />
                Industry average
              </span>
            </div>
            {METRICS.map((m) => {
              const v = value(m);
              const avg = m.average.value;
              return (
                <div className={x.res} key={m.id}>
                  <div className={x.resHead}>
                    <span className={x.resName}>{m.name}</span>
                    <span className={x.resVal}>
                      <Counter value={v} />
                      <small>{m.unit}</small>
                    </span>
                  </div>
                  <div className={x.track}>
                    <div className={x.fill} style={{ width: `${pct(m, v)}%` }} />
                    {avg != null && (
                      <div className={x.avg} style={{ left: `${pct(m, avg)}%` }}>
                        <span>
                          avg {avg}
                          {m.unit}
                        </span>
                      </div>
                    )}
                  </div>
                  <div className={x.verdict}>
                    <span>
                      <Verdict m={m} value={v} />
                    </span>
                    <span>{m.better === "lower" ? "Lower is better" : "Higher is better"}</span>
                  </div>
                </div>
              );
            })}
            <p className={x.sources}>
              {sourced.length > 0 ? (
                <>
                  Sources:{" "}
                  {sourced.map((m, i) => (
                    <span key={m.id}>
                      {i > 0 && " · "}
                      {m.average.sourceUrl ? (
                        <a href={m.average.sourceUrl} target="_blank" rel="noopener noreferrer">
                          {m.average.sourceName || m.name}
                        </a>
                      ) : (
                        `${m.name}: source needed`
                      )}
                    </span>
                  ))}
                </>
              ) : (
                "Industry averages will appear here once sourced."
              )}
            </p>
          </div>
        </div>
      </section>

      <section className={bits.section}>
        <div className={`${bits.dark} ${x.report}`}>
          <div>
            <h2 className={bits.h2}>Get the full report.</h2>
            <p style={{ marginTop: "0.6rem" }}>We&apos;ll send a breakdown of where you stand and what to fix first.</p>
          </div>
          <div>
            <form
              noValidate
              onSubmit={(e) => {
                e.preventDefault();
                const form = e.currentTarget;
                const email = String(new FormData(form).get("email") ?? "");
                if (!isValidEmail(email)) {
                  setMsg({ ok: false, text: "Enter a valid work email." });
                  form.querySelector<HTMLInputElement>("input[name=email]")?.focus();
                  return;
                }
                // TODO: POST email + the metric values above to a report endpoint.
                setMsg({ ok: true, text: "Report requested. It'll arrive in your inbox." });
                form.reset();
              }}
            >
              <div className={bits.field}>
                <label htmlFor="report-email">Work email</label>
                <input className={bits.input} id="report-email" name="email" type="email" autoComplete="email" />
              </div>
              <button className={`${bits.btn} ${bits.btnLime} ${bits.btnLg}`} type="submit">
                <Roll>Send my report</Roll>
              </button>
            </form>
            <p className={`${bits.formMsg} ${msg ? (msg.ok ? bits.formOk : bits.formErr) : ""}`} role="status">
              {msg?.text}
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
