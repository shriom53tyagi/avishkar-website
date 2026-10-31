/**
 * Benchmark metrics and industry averages.
 * Industry averages MUST come from a cited source. `value: null` hides the
 * marker and shows "Industry average not set".
 * TODO: rebooking rate still has no sourced average (value: null).
 */
export const SHOW_SAMPLES = false;

export type IndustryAverage = {
  value: number | null;
  sourceName: string;
  sourceUrl: string;
};

export type Metric = {
  id: "noShow" | "rebook" | "response";
  name: string;
  unit: "%" | "min";
  min: number;
  max: number;
  step: number;
  initial: number;
  better: "lower" | "higher";
  average: IndustryAverage;
};

const REAL_AVERAGES: Record<Metric["id"], IndustryAverage> = {
  noShow: {
    value: 4,
    sourceName: "Zenoti 2026 Beauty & Wellness Benchmark Report (Medspa Edition)",
    sourceUrl: "https://www.zenoti.com/thecheckin/medspa-cancellation-rate",
  },
  // No sourced figure yet: marker hidden, "Industry average not set" shown.
  rebook: { value: null, sourceName: "", sourceUrl: "" },
  response: {
    value: 125,
    sourceName: "InsideSales.com, healthcare average (via Geckoboard)",
    sourceUrl: "https://www.geckoboard.com/resources/kpi-examples/lead-response-time/",
  },
};

// Placeholder numbers, only used while SHOW_SAMPLES is true (with a notice).
const SAMPLE_AVERAGES: Record<Metric["id"], number> = { noShow: 15, rebook: 55, response: 45 };

function avg(id: Metric["id"]): IndustryAverage {
  return SHOW_SAMPLES ? { ...REAL_AVERAGES[id], value: SAMPLE_AVERAGES[id] } : REAL_AVERAGES[id];
}

export const METRICS: Metric[] = [
  {
    id: "noShow",
    name: "No-show rate",
    unit: "%",
    min: 0,
    max: 40,
    step: 1,
    initial: 12,
    better: "lower",
    average: avg("noShow"),
  },
  {
    id: "rebook",
    name: "Rebooking rate",
    unit: "%",
    min: 0,
    max: 100,
    step: 1,
    initial: 45,
    better: "higher",
    average: avg("rebook"),
  },
  {
    id: "response",
    name: "Lead response time",
    unit: "min",
    min: 0,
    max: 240,
    step: 5,
    initial: 60,
    better: "lower",
    average: avg("response"),
  },
];
