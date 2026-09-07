import type { Metadata } from "next";
import { PageHeader } from "@/components/ui/PageHeader";
import { Section } from "@/components/ui/Section";
import { CalendarEmbed } from "@/components/ui/CalendarEmbed";
import { CONTACT_EMAIL } from "@/lib/content";

export const metadata: Metadata = {
  title: "Talk to Avishkar",
  description:
    "Book a 30-minute conversation with Avishkar. Tell us the workflow your practice is trying to improve and we'll work out where technology could help.",
  alternates: { canonical: "/contact" },
};

const PREP = [
  "The workflow that frustrates you most right now",
  "Who on the team touches it, and how often",
  "The systems that hold the data — CRM, scheduling, EMR, phones, spreadsheets",
  "What a good outcome would look like in a month",
];

export default async function ContactPage({
  searchParams,
}: {
  searchParams: Promise<{ intent?: string }>;
}) {
  const { intent } = await searchParams;
  const custom = intent === "custom";

  return (
    <>
      <PageHeader
        eyebrow="Talk to us"
        title={
          custom
            ? "Tell us what you're trying to solve."
            : "Book a 30-minute conversation."
        }
        description={
          custom
            ? "The agents on our site are examples of current work, not a catalogue. Describe the problem and we'll tell you honestly what we'd build around it."
            : "Thirty minutes on the workflow you want to improve. We'll ask about the systems involved and where the time goes, then tell you where technology could help — and where it wouldn't."
        }
      />

      <Section tone="canvas">
        <div className="grid gap-12 lg:grid-cols-[minmax(0,7fr)_minmax(0,5fr)] lg:gap-16">
          <div>
            <h2 className="text-h3 text-ink">Pick a time</h2>
            <p className="mt-2 text-small text-ink-muted">
              Straight to the calendar. If nothing fits, email us and we&apos;ll find a slot.
            </p>
            <div className="mt-6">
              <CalendarEmbed />
            </div>
          </div>

          <div>
            <h2 className="text-h3 text-ink">Prefer email?</h2>
            <p className="mt-2 text-small text-ink-muted">
              Write to{" "}
              <a
                href={`mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(
                  custom ? "A problem we're trying to solve" : "30-minute conversation"
                )}`}
                className="text-accent underline underline-offset-4"
              >
                {CONTACT_EMAIL}
              </a>{" "}
              with a couple of lines about the workflow. We usually reply within one business day.
            </p>

            <h2 className="mt-12 text-h3 text-ink">Worth having ready</h2>
            <ul className="mt-5 space-y-3">
              {PREP.map((item) => (
                <li key={item} className="border-t border-line pt-3 text-small text-ink-muted">
                  {item}
                </li>
              ))}
            </ul>

            <p className="mt-8 text-small text-ink-subtle">
              No preparation is required. Nothing in the conversation obliges you to buy anything,
              and we won&apos;t ask for system access to have it.
            </p>
          </div>
        </div>
      </Section>
    </>
  );
}
