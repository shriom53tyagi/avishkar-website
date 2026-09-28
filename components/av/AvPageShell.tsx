"use client";

import { usePathname } from "next/navigation";
import { AvSiteFooter } from "@/components/av/AvSiteFooter";
import pageOffsetStyles from "@/app/page-offset.module.css";

/**
 * Wraps every route's content with the shared top-offset (compensating for
 * AvNavbar's fixed bar) and the shared AvSiteFooter — except on the
 * homepage.
 *
 * The homepage (components/av/HomePage.tsx, via AvHomeHero) was ported 1:1
 * from reference/avishkar-hero.html, which supplies its own hero top
 * padding and composes AvSiteFooter itself in the same position the
 * reference's own `.foot` sits at the end of the page. Rendering it again
 * here would double the top offset and stack two footers on `/`. Needs
 * `usePathname`, so this one piece of the root layout is a client
 * component; everything else in app/layout.tsx stays a server component.
 */
export function AvPageShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isHome = pathname === "/";

  if (isHome) {
    return <>{children}</>;
  }

  return (
    <>
      <main className={pageOffsetStyles.main}>{children}</main>
      <AvSiteFooter />
    </>
  );
}
