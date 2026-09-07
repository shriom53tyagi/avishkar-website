import type { Metadata } from "next";
import { PageHeader } from "@/components/ui/PageHeader";
import { Section } from "@/components/ui/Section";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { AgentLibrary } from "@/components/agents/AgentLibrary";
import { JsonLd } from "@/components/ui/JsonLd";
import { AGENTS, AGENT_CATEGORIES, DEVELOPING_AGENTS, LIVE_AGENTS } from "@/lib/agents";
import { AGENTS_PAGE, BUILT_NOT_BOUGHT, CTA } from "@/lib/content";
import { agentLibrarySchema } from "@/lib/schema";

export const metadata: Metadata = {
  title: "Agents we've built for practice teams",
  description:
    "A current look at Avishkar's work for medspas, aesthetic practices and clinics. Agents are one of the things we build — alongside integrations, automation, internal tools and custom software.",
  alternates: { canonical: "/agents" },
};

export default function AgentsPage() {
  return (
    <>
      <JsonLd data={agentLibrarySchema} />
      <PageHeader
        eyebrow={AGENTS_PAGE.eyebrow}
        title={AGENTS_PAGE.title}
        description={AGENTS_PAGE.description}
      >
        <p className="text-small text-ink-subtle">
          {LIVE_AGENTS.length} available to explore · {DEVELOPING_AGENTS.length} in development
        </p>
      </PageHeader>

      <Section tone="canvas">
        <AgentLibrary agents={AGENTS} categories={[...AGENT_CATEGORIES]} />
      </Section>

      {/* Cold traffic lands here from marketing, so the page has to say out
          loud that the library is a sample of the work, not the whole of it. */}
      <div className="border-t border-line bg-alt py-16 md:py-20">
        <Container>
          <div className="grid gap-12 lg:grid-cols-[minmax(0,7fr)_minmax(0,5fr)] lg:gap-20">
            <div className="max-w-measure">
              <h2 className="text-h2 text-ink">{AGENTS_PAGE.breadthHeadline}</h2>
              <p className="mt-4 text-lead text-ink-muted">{AGENTS_PAGE.breadthBody}</p>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-4">
                <Button href="/contact?intent=custom">{CTA.custom}</Button>
                <Button href="/how-we-work" variant="secondary">
                  How we work
                </Button>
              </div>
            </div>

            <div>
              <p className="eyebrow mb-4">{BUILT_NOT_BOUGHT.formsLabel}</p>
              <ul>
                {BUILT_NOT_BOUGHT.forms.map((form) => (
                  <li
                    key={form}
                    className="border-t border-line py-3 text-small text-ink last:border-b"
                  >
                    {form}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </Container>
      </div>
    </>
  );
}
