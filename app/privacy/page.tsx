import type { Metadata } from "next";
import { PageHeader } from "@/components/ui/PageHeader";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description:
    "How Avishkar AI collects, uses, and protects personal information submitted through this website.",
};

const SECTIONS = [
  {
    title: "Information We Collect",
    body: "We collect name and email address when you submit a voice note through our website. We also collect standard server logs (IP address, browser type, pages visited) for security and performance monitoring. We do not collect Protected Health Information (PHI) through this website.",
  },
  {
    title: "How We Use Your Information",
    body: "Contact information submitted via voice note is used solely to respond to your inquiry. We do not sell, rent, or share your personal information with third parties for marketing purposes.",
  },
  {
    title: "Third-Party Services",
    body: "This website uses Calendly for appointment scheduling (governed by Calendly's privacy policy), Amazon SES for email delivery, and Groq for AI-powered chat responses. None of these services receive PHI through this website.",
  },
  {
    title: "Data Security",
    body: "We implement appropriate technical and organizational measures to protect your information. API communications are encrypted in transit via HTTPS.",
  },
  {
    title: "HIPAA",
    body: "This website is a marketing site and does not process, store, or transmit Protected Health Information. Any engagement involving PHI is governed by a separate Business Associate Agreement (BAA).",
  },
  {
    title: "Your Rights",
    body: "You may request deletion of any personal information we hold about you by contacting info@avishakar.com.",
  },
  {
    title: "Contact",
    body: "For privacy questions: info@avishakar.com",
  },
];

export default function PrivacyPage() {
  return (
    <>
      <PageHeader eyebrow="Legal" title="Privacy Policy" />
      <div className="mx-auto max-w-3xl px-6 pb-24">
        <p className="mb-10 text-sm text-slate-400">Last updated: June 2025</p>
        <div className="space-y-10">
          {SECTIONS.map((s) => (
            <section key={s.title}>
              <h2 className="mb-3 text-xl font-medium text-slate-900">{s.title}</h2>
              <p className="text-[15px] leading-relaxed text-slate-500">{s.body}</p>
            </section>
          ))}
        </div>
      </div>
    </>
  );
}
