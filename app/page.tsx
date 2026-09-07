import { Hero } from "@/components/home/Hero";
import { Problem } from "@/components/home/Problem";
import { Capability } from "@/components/home/Capability";
import { AgentsPreview } from "@/components/home/AgentsPreview";
import { HowWeWork } from "@/components/home/HowWeWork";
import { Trust } from "@/components/home/Trust";
import { FinalCTA } from "@/components/home/FinalCTA";

/**
 * Home page order:
 *   Hero → Problem → Capability → Agents → How we work → Trust →
 *   Final CTA → Footer (in the layout)
 *
 * Breadth comes before the agent showcase on purpose: a visitor should learn
 * what we build in general before seeing the examples, so agents read as
 * evidence rather than as the entire company. The model Avishkar is building
 * lives in the hero's right column, not as a later section.
 *
 * Nothing else belongs here. Detail lives one level deeper.
 */
export default function HomePage() {
  return (
    <>
      <Hero />
      <Problem />
      <Capability />
      <AgentsPreview />
      <HowWeWork />
      <Trust />
      <FinalCTA />
    </>
  );
}
