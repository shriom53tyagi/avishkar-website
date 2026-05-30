import { Hero } from "@/components/sections/Hero";
import { Problems } from "@/components/sections/Problems";
import { AuditEngine } from "@/components/sections/AuditEngine";
import { Agents } from "@/components/sections/Agents";
import { InsideSystem } from "@/components/sections/InsideSystem";
import { Results } from "@/components/sections/Results";
import { Process } from "@/components/sections/Process";
import { FinalCTA } from "@/components/sections/FinalCTA";

export default function HomePage() {
  return (
    <>
      <Hero />
      <Problems />
      <AuditEngine />
      <Agents />
      <InsideSystem />
      <Results />
      <Process />
      <FinalCTA />
    </>
  );
}
