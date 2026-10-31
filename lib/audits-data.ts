/**
 * Practice audit data. Anonymised only — never a real practice name.
 * TODO: replace the samples with real audits. With SHOW_SAMPLES = false and
 * an empty AUDITS array the pages show their empty state.
 */
// Flip to true locally to preview the sample cards. Even then they are never
// shown in a production build.
const SAMPLES_ENABLED = false;
export const SHOW_SAMPLES = SAMPLES_ENABLED && process.env.NODE_ENV !== "production";

export const AREAS = ["Booking", "Follow-ups", "Phones", "Reviews", "Data flow"] as const;
export type Area = (typeof AREAS)[number];
export type Grade = "A" | "A-" | "B+" | "B" | "B-" | "C+" | "C" | "C-" | "D+" | "D" | "D-" | "F";

export type Audit = {
  slug: string;
  sample: boolean;
  label: string; // e.g. "Medspa, City, ST"
  locations: number;
  headline: string;
  grades: Record<Area, Grade>;
  found: string[];
  fix: string[];
};

const SAMPLE_AUDITS: Audit[] = [
  {
    slug: "sample-1",
    sample: true,
    label: "Medspa, City, ST",
    locations: 1,
    headline: "Headline finding for this practice goes here",
    grades: { Booking: "B+", "Follow-ups": "D", Phones: "C", Reviews: "A", "Data flow": "D" },
    found: [
      "Finding one, in one short line",
      "Finding two, in one short line",
      "Finding three, in one short line",
    ],
    fix: [
      "Fix one, in one short line",
      "Fix two, in one short line",
      "Fix three, in one short line",
    ],
  },
  {
    slug: "sample-2",
    sample: true,
    label: "Clinic, City, ST",
    locations: 3,
    headline: "Headline finding for this practice goes here",
    grades: { Booking: "A", "Follow-ups": "C", Phones: "D", Reviews: "B", "Data flow": "C" },
    found: ["Finding one, in one short line", "Finding two, in one short line"],
    fix: ["Fix one, in one short line", "Fix two, in one short line"],
  },
];

const REAL_AUDITS: Audit[] = []; // TODO: real, anonymised audits

export const AUDITS: Audit[] = SHOW_SAMPLES ? SAMPLE_AUDITS : REAL_AUDITS;

export function getAudit(slug: string): Audit | undefined {
  return AUDITS.find((a) => a.slug === slug);
}
