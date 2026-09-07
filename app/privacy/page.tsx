import type { Metadata } from "next";
import { PageHeader } from "@/components/ui/PageHeader";
import { Container } from "@/components/ui/Container";
import { CONTACT_EMAIL } from "@/lib/content";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description:
    "How Avishkar collects, uses and protects personal information submitted through this website.",
  alternates: { canonical: "/privacy" },
};

const SECTIONS = [
  {
    title: "Information we collect",
    body: `We collect the contact details you give us when you book a conversation, request early access, or email us. We also collect standard server logs — IP address, browser type, pages visited — for security and performance monitoring. We do not collect Protected Health Information (PHI) through this website.`,
  },
  {
    title: "How we use your information",
    body: "Contact information is used only to respond to your enquiry, arrange a conversation, or follow up on an early-access request. We do not sell, rent or share your personal information with third parties for marketing purposes.",
  },
  {
    title: "Third-party services",
    body: "This website uses Calendly for appointment scheduling, governed by Calendly's own privacy policy. Scheduling and analytics scripts only load after you accept cookies.",
  },
  {
    title: "Data security",
    body: "We apply appropriate technical and organizational measures to protect your information. Traffic to this website is encrypted in transit via HTTPS.",
  },
  {
    title: "HIPAA",
    body: "This website is a marketing site and does not process, store or transmit Protected Health Information. Any engagement involving PHI is governed by a separate Business Associate Agreement.",
  },
  {
    title: "Your rights",
    body: `You may ask us to delete any personal information we hold about you by writing to ${CONTACT_EMAIL}.`,
  },
  {
    title: "Contact",
    body: `Privacy questions: ${CONTACT_EMAIL}`,
  },
];

export default function PrivacyPage() {
  return (
    <>
      <PageHeader eyebrow="Legal" title="Privacy Policy" />
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
