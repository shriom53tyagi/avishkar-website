"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import type { CSSProperties } from "react";
import { AvMark } from "./shared/AvMark";
import { readReducedMotion } from "./shared/useReducedMotion";
import styles from "./AvHomeHero.module.css";
import { Roll } from "../Roll";

/**
 * Hero section — ported 1:1 from reference/avishkar-hero.html `.hero`
 * (CSS ~162-334, markup ~948-1004, JS ~1202-1291).
 *
 * TODO: none — all hero copy/timing is real, ported as-is.
 *
 * The headline's mark (between "make" and "your") uses the real Avishkar
 * logo (public/logo.webp) instead of the placeholder AvMark SVG — the only
 * one of AvMark's 4 call sites swapped so far; the node pill, library
 * cards and CTA sidebar still use the animated placeholder. Because a
 * raster image can't do the SVG's stroke-drawing entrance, it gets a
 * simple fade/scale-in on `.hero.isIn` instead (see .titleLogo in
 * AvHomeHero.module.css) rather than the spoke draw-in/hover-wiggle.
 */

const TITLE_LEFT = ["We", "make"];
const TITLE_RIGHT = ["your", "systems", "talk"];
const CHIPS = ["medspas", "clinics", "EMR", "CRM", "booking", "phones"];

const TILES: { key: string; label: string; icon: React.ReactNode }[] = [
  {
    key: "emr",
    label: "EMR",
    icon: (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M9 4h6v3H9zM7 5.5H5.5v15h13v-15H17" />
        <path d="M9 12h6M9 16h4" />
      </svg>
    ),
  },
  {
    key: "crm",
    label: "CRM",
    icon: (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <circle cx="9" cy="8" r="3" />
        <path d="M3.5 19a5.5 5.5 0 0 1 11 0" />
        <circle cx="17" cy="9" r="2.3" />
        <path d="M16 14.2a4.5 4.5 0 0 1 5 4.8" />
      </svg>
    ),
  },
  {
    key: "booking",
    label: "Booking",
    icon: (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <rect x="4" y="5.5" width="16" height="14" rx="2" />
        <path d="M8 3.5v4M16 3.5v4M4 10h16" />
      </svg>
    ),
  },
  {
    key: "payments",
    label: "Payments",
    icon: (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <rect x="3" y="6" width="18" height="12" rx="2" />
        <path d="M3 10h18M7 15h3" />
      </svg>
    ),
  },
  {
    key: "phones",
    label: "Phones",
    icon: (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a1 1 0 0 1-1 1A16 16 0 0 1 4 5a1 1 0 0 1 1-1z" />
      </svg>
    ),
  },
  {
    key: "marketing",
    label: "Marketing",
    icon: (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M4 10v4h3l7 4V6l-7 4H4z" />
        <path d="M17.5 9.5a3.5 3.5 0 0 1 0 5" />
      </svg>
    ),
  },
  {
    key: "forms",
    label: "Forms",
    icon: (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M7 3.5h7l4 4v13H7z" />
        <path d="M14 3.5v4h4M10 12h5M10 16h5" />
      </svg>
    ),
  },
  {
    key: "reviews",
    label: "Reviews",
    icon: (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M12 4l2.4 5 5.3.7-3.9 3.7 1 5.3L12 16.2 7.2 18.7l1-5.3-3.9-3.7 5.3-.7z" />
      </svg>
    ),
  },
  {
    key: "inbox",
    label: "Inbox",
    icon: (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M4 6h16v10H9l-5 4z" />
      </svg>
    ),
  },
];

const WIRE_PATHS_IN = [
  "M330,170 C430,170 400,290 480,290",
  "M330,230 C430,230 400,290 480,290",
  "M330,290 C430,290 400,290 480,290",
  "M330,350 C430,350 400,290 480,290",
  "M330,410 C430,410 400,290 480,290",
];
const WIRE_PATHS_OUT = [
  "M720,290 C800,290 770,210 870,210",
  "M720,290 C800,290 770,290 870,290",
  "M720,290 C800,290 770,370 870,370",
];

const PACKET_COLORS = ["#201d1d", "#6840ff"];

const ROLES: { left: number; top: number; bg: string }[] = [
  { left: 70, top: 20, bg: "#ece7ff" },
  { left: 210, top: 20, bg: "#e7ffd6" },
  { left: 70, top: 200, bg: "#ffeadd" },
  { left: 210, top: 200, bg: "#e1efff" },
];
const ROLE_LABELS = ["Front desk", "Providers", "Owner", "Marketing"];

const EVENTS = [
  "Booking → EMR",
  "Payment → CRM",
  "Call → Inbox",
  "Form → Chart",
  "Review → Marketing",
  "Lead → Booking",
];

const CheckIcon = () => (
  <svg viewBox="0 0 12 12" fill="none" aria-hidden="true">
    <path d="M3 6.2l2 2 4-4.4" />
  </svg>
);

export function AvHomeHero() {
  const heroRef = useRef<HTMLElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const stageOuterRef = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  const countRef = useRef<HTMLSpanElement>(null);
  const toastBoxRef = useRef<HTMLDivElement>(null);
  const tileRefs = useRef<(HTMLDivElement | null)[]>([]);
  const roleRefs = useRef<(HTMLDivElement | null)[]>([]);
  const chipRefs = useRef<(HTMLSpanElement | null)[]>([]);
  const nodeRef = useRef<HTMLDivElement>(null);
  const layerRefs = useRef<(HTMLDivElement | null)[]>([]);
  const onScreenRef = useRef(true);

  // Pause/resume gate for the off-screen performance addition. Everything
  // below this line replicates reference JS/timings exactly; only the
  // rAF loops check `onScreenRef` before doing work / scheduling the next
  // frame's actual computation (the loop itself keeps ticking so it can
  // resume instantly — cheap no-op frames, no timeline drift).
  useEffect(() => {
    const hero = heroRef.current;
    if (!hero) return;
    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) onScreenRef.current = entry.isIntersecting;
      },
      { rootMargin: "200px" },
    );
    io.observe(hero);
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    const hero = heroRef.current;
    const stage = stageRef.current;
    const outer = stageOuterRef.current;
    const svg = svgRef.current;
    const count = countRef.current;
    const toastBox = toastBoxRef.current;
    const node = nodeRef.current;
    if (!hero || !stage || !outer || !svg || !count || !toastBox || !node) return;

    const body = document.body;
    const tiles = tileRefs.current.filter((t): t is HTMLDivElement => !!t);
    const roles = roleRefs.current.filter((r): r is HTMLDivElement => !!r);
    const chips = chipRefs.current.filter((c): c is HTMLSpanElement => !!c);
    const layers = layerRefs.current.filter((l): l is HTMLDivElement => !!l);
    const reduce = readReducedMotion();

    const fit = () => {
      const s = Math.min(1, outer.clientWidth / 1200);
      stage.style.transform = `scale(${s})`;
      outer.style.height = 520 * s + "px";
    };
    fit();
    window.addEventListener("resize", fit);

    svg.pauseAnimations();
    const pick = <T,>(a: T[]): T => a[Math.floor(Math.random() * a.length)];
    const flash = (el: Element, cls: string, ms: number) => {
      el.classList.remove(cls);
      void (el as HTMLElement).offsetWidth;
      el.classList.add(cls);
      setTimeout(() => el.classList.remove(cls), ms);
    };

    const tickSvg = '<i><svg viewBox="0 0 12 12"><path d="M3 6.2l2 2 4-4.4"/></svg></i>';
    let ev = 0;
    const toast = () => {
      const old = [...toastBox.children];
      old.forEach((t) => {
        if (t.classList.contains("up")) {
          t.classList.add("gone");
          setTimeout(() => t.remove(), 700);
        } else t.classList.add("up");
      });
      const t = document.createElement("div");
      t.className = styles.toast;
      t.innerHTML =
        tickSvg.replace("<i>", `<i class="${styles.toastIcon}">`) + EVENTS[ev++ % EVENTS.length];
      toastBox.appendChild(t);
      requestAnimationFrame(() => requestAnimationFrame(() => t.classList.add("show")));
    };

    const cleanupFns: (() => void)[] = [];
    const trackInterval = (fn: () => void, ms: number) => {
      const id = setInterval(fn, ms);
      cleanupFns.push(() => clearInterval(id));
      return id;
    };
    const trackTimeout = (fn: () => void, ms: number) => {
      const id = setTimeout(fn, ms);
      cleanupFns.push(() => clearTimeout(id));
      return id;
    };

    let connected = false;
    const connect = () => {
      if (connected) return;
      connected = true;
      hero.classList.add(styles.isIn);
      stage.classList.add(styles.isIn, styles.isConnected);
      tiles.forEach((t, i) =>
        trackTimeout(
          () => {
            t.classList.add("on");
            count.textContent = `${i + 1}/9`;
          },
          reduce ? 0 : 500 + i * 90,
        ),
      );
      if (reduce) {
        roles.forEach((r) => r.classList.add("done"));
        return;
      }
      trackTimeout(() => {
        body.classList.add("flowing");
        svg.setCurrentTime(0);
        svg.unpauseAnimations();
        // Each interval's own work is skipped while the hero is off-
        // screen (the interval keeps ticking — clearing/re-arming exact
        // phase on re-entry isn't worth the complexity for a decorative
        // loop — but it does nothing until back in view).
        let k = 0;
        trackInterval(() => {
          if (!onScreenRef.current) return;
          const r = roles[k++ % roles.length];
          flash(r, "ping", 900);
          r.classList.add("done");
        }, 700);
        trackInterval(() => {
          if (!onScreenRef.current) return;
          flash(pick(tiles), "send", 600);
        }, 380);
        trackInterval(() => {
          if (!onScreenRef.current) return;
          flash(node, "gulp", 450);
        }, 900);
        let c = 0;
        trackInterval(() => {
          if (!onScreenRef.current) return;
          flash(chips[2 + (c++ % 4)], "hot", 700);
        }, 800);
        toast();
        trackInterval(() => {
          if (onScreenRef.current) toast();
        }, 1700);
      }, 1500);
    };

    const startTimers: ReturnType<typeof setTimeout>[] = [];
    const start = () => {
      startTimers.push(trackTimeout(() => hero.classList.add(styles.isIn), 80));
      startTimers.push(trackTimeout(() => stage.classList.add(styles.isIn), 1400));
      startTimers.push(trackTimeout(connect, 3000));
    };

    let scrollHandler: (() => void) | null = null;
    if (reduce) {
      connect();
    } else {
      let started = false;
      const go = () => {
        if (!started) {
          started = true;
          start();
        }
      };
      if (document.fonts) {
        document.fonts.ready.then(() => {
          fit();
          go();
        });
      }
      trackTimeout(go, 1200);
      scrollHandler = () => {
        if (window.scrollY > 20) {
          startTimers.forEach(clearTimeout);
          connect();
        }
      };
      window.addEventListener("scroll", scrollHandler, { passive: true });
    }

    // Mouse parallax (allowed addition: pause the rAF loop while off-screen)
    let rafId: number | null = null;
    let pointerHandler: ((e: PointerEvent) => void) | null = null;
    if (!reduce) {
      let mx = 0,
        my = 0,
        cx = 0,
        cy = 0;
      pointerHandler = (e: PointerEvent) => {
        mx = (e.clientX / window.innerWidth) * 2 - 1;
        my = (e.clientY / window.innerHeight) * 2 - 1;
      };
      window.addEventListener("pointermove", pointerHandler, { passive: true });
      const loop = () => {
        if (onScreenRef.current) {
          cx += (mx - cx) * 0.07;
          cy += (my - cy) * 0.07;
          const spread = Math.min(window.scrollY, 500) * 0.07;
          layers.forEach((l) => {
            const d = +(l.dataset.depth || 0);
            const side = +(l.dataset.side || 0);
            l.style.transform = `translate3d(${cx * d + side * spread}px, ${cy * d * 0.6}px, 0)`;
          });
        }
        rafId = requestAnimationFrame(loop);
      };
      loop();
    }

    return () => {
      window.removeEventListener("resize", fit);
      if (scrollHandler) window.removeEventListener("scroll", scrollHandler);
      if (pointerHandler) window.removeEventListener("pointermove", pointerHandler);
      if (rafId !== null) cancelAnimationFrame(rafId);
      cleanupFns.forEach((fn) => fn());
    };
  }, []);

  return (
    <section className={styles.hero} data-hero ref={heroRef}>
      <div className={styles.guide} aria-hidden="true" />

      <h1 className={styles.title}>
        <span className={styles.side}>
          {TITLE_LEFT.map((w, i) => (
            <span className={styles.w} key={w}>
              <span style={{ ["--i" as string]: i }}>{w}</span>
            </span>
          ))}
        </span>
        <span>
          <Image
            src="/logo.webp"
            alt=""
            width={96}
            height={52}
            priority
            className={styles.titleLogo}
          />
        </span>
        <span className={styles.side}>
          {TITLE_RIGHT.map((w, i) => (
            <span className={styles.w} key={w}>
              <span style={{ ["--i" as string]: i + 2 }}>{w}</span>
            </span>
          ))}
        </span>
      </h1>

      <p className={styles.sub}>
        The technology partner for{" "}
        <span
          className={styles.chip}
          ref={(el) => {
            chipRefs.current[0] = el;
          }}
          style={{ ["--i" as string]: 0 }}
        >
          {CHIPS[0]}
        </span>{" "}
        &amp;{" "}
        <span
          className={styles.chip}
          ref={(el) => {
            chipRefs.current[1] = el;
          }}
          style={{ ["--i" as string]: 1 }}
        >
          {CHIPS[1]}
        </span>
        , one layer that connects your{" "}
        <span
          className={styles.chip}
          ref={(el) => {
            chipRefs.current[2] = el;
          }}
          style={{ ["--i" as string]: 2 }}
        >
          {CHIPS[2]}
        </span>
        ,{" "}
        <span
          className={styles.chip}
          ref={(el) => {
            chipRefs.current[3] = el;
          }}
          style={{ ["--i" as string]: 3 }}
        >
          {CHIPS[3]}
        </span>
        ,{" "}
        <span
          className={styles.chip}
          ref={(el) => {
            chipRefs.current[4] = el;
          }}
          style={{ ["--i" as string]: 4 }}
        >
          {CHIPS[4]}
        </span>{" "}
        and{" "}
        <span
          className={styles.chip}
          ref={(el) => {
            chipRefs.current[5] = el;
          }}
          style={{ ["--i" as string]: 5 }}
        >
          {CHIPS[5]}
        </span>
      </p>

      <div className={styles.cta}>
        <Link href="/contact" className={`${styles.btn} ${styles.btnJoin}`}>
          <Roll>Book a demo</Roll>
        </Link>
        <a href="#insights" className={`${styles.btn} ${styles.btnSoft}`}>
          <Roll>See how</Roll>
        </a>
      </div>

      <div className={styles.stageOuter} ref={stageOuterRef}>
        <div className={styles.stage} ref={stageRef}>
          <div
            className={styles.layer}
            data-depth="4"
            data-side="0"
            ref={(el) => {
              layerRefs.current[0] = el;
            }}
          >
            <div className={styles.stageGrid} aria-hidden="true" />
          </div>

          <div
            className={styles.layer}
            data-depth="0"
            data-side="0"
            ref={(el) => {
              layerRefs.current[1] = el;
            }}
          >
            <svg className={styles.wires} viewBox="0 0 1200 520" aria-hidden="true" ref={svgRef}>
              {WIRE_PATHS_IN.map((d, i) => (
                <path key={`base-in-${i}`} className="wire-base" d={d} />
              ))}
              {WIRE_PATHS_OUT.map((d, i) => (
                <path key={`base-out-${i}`} className="wire-base" d={d} />
              ))}
              {WIRE_PATHS_IN.map((d, i) => (
                <path
                  key={`live-in-${i}`}
                  id={`wl${i}`}
                  className="wire-live"
                  pathLength={1}
                  d={d}
                />
              ))}
              {WIRE_PATHS_OUT.map((d, i) => (
                <path
                  key={`live-out-${i}`}
                  id={`wr${i}`}
                  className="wire-live out"
                  pathLength={1}
                  d={d}
                />
              ))}
              <g className={styles.packets}>
                {WIRE_PATHS_IN.map((_, i) => (
                  <g key={`packet-in-${i}`}>
                    <circle
                      r="9.6"
                      fill={PACKET_COLORS[i % 2]}
                      opacity="0"
                      style={{ filter: "blur(3px)" }}
                      fillOpacity=".35"
                    >
                      <animateMotion
                        dur="1.8s"
                        begin={`${(i * 0.37).toFixed(2)}s`}
                        repeatCount="indefinite"
                        calcMode="spline"
                        keyTimes="0;1"
                        keySplines=".45 0 .55 1"
                      >
                        <mpath href={`#wl${i}`} />
                      </animateMotion>
                      <animate
                        attributeName="opacity"
                        values="0;1;1;0"
                        keyTimes="0;.12;.85;1"
                        dur="1.8s"
                        begin={`${(i * 0.37).toFixed(2)}s`}
                        repeatCount="indefinite"
                      />
                    </circle>
                    <circle r="4" fill={PACKET_COLORS[i % 2]} opacity="0">
                      <animateMotion
                        dur="1.8s"
                        begin={`${(i * 0.37).toFixed(2)}s`}
                        repeatCount="indefinite"
                        calcMode="spline"
                        keyTimes="0;1"
                        keySplines=".45 0 .55 1"
                      >
                        <mpath href={`#wl${i}`} />
                      </animateMotion>
                      <animate
                        attributeName="opacity"
                        values="0;1;1;0"
                        keyTimes="0;.12;.85;1"
                        dur="1.8s"
                        begin={`${(i * 0.37).toFixed(2)}s`}
                        repeatCount="indefinite"
                      />
                    </circle>
                  </g>
                ))}
                {WIRE_PATHS_OUT.map((_, i) => (
                  <g key={`packet-out-${i}`}>
                    <circle
                      r="9.6"
                      fill={PACKET_COLORS[i % 2]}
                      opacity="0"
                      style={{ filter: "blur(3px)" }}
                      fillOpacity=".35"
                    >
                      <animateMotion
                        dur="1.8s"
                        begin={`${(i * 0.4 + 0.2).toFixed(2)}s`}
                        repeatCount="indefinite"
                        calcMode="spline"
                        keyTimes="0;1"
                        keySplines=".45 0 .55 1"
                      >
                        <mpath href={`#wr${i}`} />
                      </animateMotion>
                      <animate
                        attributeName="opacity"
                        values="0;1;1;0"
                        keyTimes="0;.12;.85;1"
                        dur="1.8s"
                        begin={`${(i * 0.4 + 0.2).toFixed(2)}s`}
                        repeatCount="indefinite"
                      />
                    </circle>
                  </g>
                ))}
              </g>
            </svg>
          </div>

          <div
            className={styles.layer}
            data-depth="-12"
            data-side="-1"
            ref={(el) => {
              layerRefs.current[2] = el;
            }}
          >
            <div className={`${styles.hcard} ${styles.hcardLeft}`}>
              <p className={styles.cardLabel}>Your systems</p>
              <div className={styles.tiles}>
                {TILES.map((t, i) => (
                  <div
                    className={styles.tile}
                    key={t.key}
                    style={{ ["--i" as string]: i }}
                    ref={(el) => {
                      tileRefs.current[i] = el;
                    }}
                  >
                    {t.icon}
                    {t.label}
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div
            className={styles.layer}
            data-depth="-22"
            data-side="-1"
            ref={(el) => {
              layerRefs.current[3] = el;
            }}
          >
            <div className={styles.stat}>
              <span className={styles.toggleSw} aria-hidden="true" />
              <span className={styles.statNum} ref={countRef}>
                0/9
              </span>
              <span className={styles.statLabel}>
                Systems
                <br />
                talking
              </span>
            </div>
          </div>

          <div
            className={styles.layer}
            data-depth="12"
            data-side="1"
            ref={(el) => {
              layerRefs.current[4] = el;
            }}
          >
            <div className={`${styles.hcard} ${styles.hcardRight}`}>
              <p className={styles.cardLabel}>Your team</p>
              <div className={styles.team}>
                <svg className={styles.teamLines} viewBox="0 0 280 290" aria-hidden="true">
                  <path d="M140,145 L70,44" />
                  <path d="M140,145 L210,44" />
                  <path d="M140,145 L70,224" />
                  <path d="M140,145 L210,224" />
                </svg>
                <div className={styles.hub}>
                  <svg viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M4 20V9l8-5 8 5v11z" />
                    <path d="M12 10v6M9 13h6" />
                  </svg>
                </div>
                {ROLES.map((r, i) => (
                  <div
                    className={styles.role}
                    style={{ left: r.left, top: r.top } as CSSProperties}
                    key={ROLE_LABELS[i]}
                    ref={(el) => {
                      roleRefs.current[i] = el;
                    }}
                  >
                    <span className={styles.avatar} style={{ background: r.bg }}>
                      <svg viewBox="0 0 24 24" aria-hidden="true">
                        <circle cx="12" cy="9" r="3.5" />
                        <path d="M5.5 20a6.5 6.5 0 0 1 13 0" />
                      </svg>
                      <span className={styles.check}>
                        <CheckIcon />
                      </span>
                    </span>
                    {ROLE_LABELS[i]}
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div
            className={styles.layer}
            data-depth="22"
            data-side="1"
            ref={(el) => {
              layerRefs.current[5] = el;
            }}
          >
            <div className={styles.toasts} ref={toastBoxRef} aria-hidden="true" />
          </div>

          <div
            className={styles.layer}
            data-depth="6"
            data-side="0"
            ref={(el) => {
              layerRefs.current[6] = el;
            }}
          >
            <div className={styles.node} ref={nodeRef} aria-label="Avishkar">
              <span className={styles.orbit} aria-hidden="true">
                <b />
                <b />
              </span>
              <span className={styles.nodeMark} aria-hidden="true">
                <AvMark />
              </span>
              <span className={styles.nodeWord}>Avishkar</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
