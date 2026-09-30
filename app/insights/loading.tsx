/**
 * Shown only on a cache miss for the ISR-revalidated /insights route (see
 * revalidate in app/insights/page.tsx) — most requests are served from
 * cache and never see this. A neutral, empty frame so a click still
 * responds instantly instead of the tab looking hung while the page
 * waits on the DB query; no skeleton shapes, so nothing is added that
 * could read as a design change.
 */
export default function Loading() {
  return <div aria-hidden="true" style={{ minHeight: "100vh" }} />;
}
