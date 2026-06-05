import type { Metadata } from "next";
import { PageHeader } from "@/components/ui/PageHeader";

export const metadata: Metadata = {
  title: "Terms of Service",
  description:
    "Terms governing access to and use of the Avishkar AI website and its features.",
};

const SECTIONS = [
  {
    title: "Acceptance of Terms",
    body: "By accessing this website you agree to these terms.",
  },
  {
    title: "Use of the Website",
    body: "This website is for informational purposes. You may not use automated tools to scrape content or abuse API endpoints.",
  },
  {
    title: "Intellectual Property",
    body: "All content, branding, and code are the property of Avishkar Systems, Inc.",
  },
  {
    title: "AI-Powered Features",
    body: "The chat assistant is powered by a large language model and may occasionally produce inaccurate responses. Do not rely on it for clinical or financial decisions.",
  },
  {
    title: "Limitation of Liability",
    body: "This website is provided as-is. Avishkar Systems, Inc. is not liable for damages arising from use of this website.",
  },
  {
    title: "Governing Law",
    body: "These terms are governed by the laws of [State], United States.",
  },
  {
    title: "Contact",
    body: "For questions: info@avishakar.com",
  },
];

export default function TermsPage() {
  return (
    <>
      <PageHeader eyebrow="Legal" title="Terms of Service" />
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
