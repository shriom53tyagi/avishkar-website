import { Hero } from "@/components/sections/Hero";
import { ProofStrip } from "@/components/sections/ProofStrip";
import { RevenueMetrics } from "@/components/sections/RevenueMetrics";
import { WhyDifferent } from "@/components/sections/WhyDifferent";
import { AuditEngine } from "@/components/sections/AuditEngine";
import { Agents } from "@/components/sections/Agents";
import { Results } from "@/components/sections/Results";
import { Security } from "@/components/sections/Security";
import { FAQ } from "@/components/sections/FAQ";
import { FinalCTA } from "@/components/sections/FinalCTA";
import { JsonLd } from "@/components/ui/JsonLd";
import { faqSchema } from "@/lib/schema";

/**
 * Section order follows the blueprint's cognitive journey:
 *   Hero → Proof Strip → Problem Validation → Methodology →
 *   Audit Lifecycle → Agents → Outcomes → Trust → FAQ → CTA
 */
export default function HomePage() {
  return (
    <>
      <JsonLd data={faqSchema} />
      <Hero />
      <ProofStrip />
      <RevenueMetrics />
      <WhyDifferent />
      <AuditEngine />
      <Agents />
      <Results />
      <Security />
      <FAQ />
      <FinalCTA />
    </>
  );
}
