import { AvHomeHero } from "./home/AvHomeHero";
import { AvHomeWheel } from "./home/AvHomeWheel";
import { AvHomeIntro } from "./home/AvHomeIntro";
import { AvHomeOval } from "./home/AvHomeOval";
import { AvHomeLibrary } from "./home/AvHomeLibrary";
import { AvHomeWhy } from "./home/AvHomeWhy";
import { AvHomeCta } from "./home/AvHomeCta";
import { AvSiteFooter } from "./AvSiteFooter";

/**
 * Homepage — a thin composition of the 8 sections ported 1:1 from
 * reference/avishkar-hero.html (.hero, .wheel, .intro, .oval-wrap, .lib,
 * .why, .cta-wrap, .foot), in the reference's own order.
 *
 * app/layout.tsx renders the shared `<AvSiteFooter>` and top-offset
 * padding on every route except `/` (see components/av/AvPageShell.tsx) —
 * the homepage supplies its own equivalents (AvSiteFooter below, and
 * AvHomeHero's own top padding, both ported from the reference), which
 * would otherwise double up with the shared ones.
 */

export type LatestInsight = {
  slug: string;
  art: string;
  img: string;
  cat: string;
  read: string;
  title: string;
  dek: string;
  date: string;
};

export function HomePage({ latestInsights }: { latestInsights: LatestInsight[] }) {
  return (
    <div>
      <AvHomeHero />
      <AvHomeWheel />
      <AvHomeIntro />
      <AvHomeOval />
      <AvHomeLibrary latestInsights={latestInsights} />
      <AvHomeWhy />
      <AvHomeCta />
      <AvSiteFooter />
    </div>
  );
}
