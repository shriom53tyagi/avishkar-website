import { Hero } from "@/components/sections/Hero";
import { WhyDifferent } from "@/components/sections/WhyDifferent";
import { RevenueMetrics } from "@/components/sections/RevenueMetrics";
import { AuditEngine } from "@/components/sections/AuditEngine";
import { Agents } from "@/components/sections/Agents";
import { WhyDeploymentsWork } from "@/components/sections/WhyDeploymentsWork";
import { Results } from "@/components/sections/Results";
import { Security } from "@/components/sections/Security";
import { FAQ } from "@/components/sections/FAQ";
import { FinalCTA } from "@/components/sections/FinalCTA";
import { JsonLd } from "@/components/ui/JsonLd";
import { faqSchema } from "@/lib/schema";

/**
 * Home page — streamlined per the cleanup brief:
 *   Hero → Why Different → Hidden Revenue (KPIs + leaks) → Operational Audit →
 *   Agent Solutions (4) → Why Our Deployments Work → Outcomes → Security → CTA
 */
export default function HomePage() {
  return (
    <>
    <JsonLd data={faqSchema} />
      <Hero />
      <WhyDifferent />
      {/* Merged: Revenue Recovery + Where Revenue Leaks */}
      <RevenueMetrics />
      {/* Operational Intelligence Audit concept */}
      <AuditEngine />
      {/* Agent solutions — 4 consolidated categories */}
      <Agents />
      {/* Replaces the longer "Inside Your System" */}
      <WhyDeploymentsWork />
      {/* Outcomes, Not Adjectives */}
      <Results />
      <Security />
      <FAQ />
      <FinalCTA />
    </>
  );
}
