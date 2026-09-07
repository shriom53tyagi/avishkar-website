import type { Metadata } from "next";
import { PageHeader } from "@/components/ui/PageHeader";
import { Container } from "@/components/ui/Container";
import { CONTACT_EMAIL } from "@/lib/content";

export const metadata: Metadata = {
  title: "Terms of Service",
  description: "Terms governing access to and use of the Avishkar website.",
  alternates: { canonical: "/terms" },
};

const SECTIONS = [
  {
    title: "Acceptance of terms",
    body: "By accessing this website you agree to these terms.",
  },
  {
    title: "Use of the website",
    body: "This website is for informational purposes. You may not use automated tools to scrape content or abuse endpoints.",
  },
  {
    title: "Intellectual property",
    body: "All content, branding and code on this website are the property of Avishkar.",
  },
  {
    title: "No professional advice",
    body: "Avishkar is a technology company. Nothing on this website is clinical, legal, billing or financial advice, and it should not be relied on as such.",
  },
  {
    title: "Limitation of liability",
    body: "This website is provided as-is. Avishkar is not liable for damages arising from use of this website.",
  },
  {
    title: "Governing law",
    // TODO: confirm the governing state and the exact registered entity name.
    body: "These terms are governed by the laws of the State of [State], United States.",
  },
  {
    title: "Contact",
    body: `Questions about these terms: ${CONTACT_EMAIL}`,
  },
];

export default function TermsPage() {
  return (
    <>
      <PageHeader eyebrow="Legal" title="Terms of Service" />
      <Container>
        <div className="max-w-measure py-14 md:py-20">
          <p className="text-small text-ink-subtle">Last updated: September 2026</p>
          <div className="mt-10 space-y-10">
            {SECTIONS.map((section) => (
              <section key={section.title}>
                <h2 className="text-h3 text-ink">{section.title}</h2>
                <p className="mt-3 text-body text-ink-muted">{section.body}</p>
              </section>
            ))}
          </div>
        </div>
      </Container>
    </>
  );
}
