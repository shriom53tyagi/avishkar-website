/**
 * Integrations directory.
 * TODO: confirm each system's status and fill in `syncs` before launch.
 * Do not mark anything "Live" or describe what syncs until confirmed.
 */
export const CATEGORIES = ["EMR", "CRM", "Booking", "Phones", "Payments", "Marketing"] as const;
export type Category = (typeof CATEGORIES)[number];
export type IntegrationStatus = "Live" | "On request";

export type Integration = {
  name: string;
  cat: Category;
  status: IntegrationStatus;
  syncs: string; // empty until confirmed
};

export const INTEGRATIONS: Integration[] = [
  { name: "GoHighLevel", cat: "CRM", status: "On request", syncs: "" },
  { name: "Nextech", cat: "EMR", status: "On request", syncs: "" },
  { name: "ModMed", cat: "EMR", status: "On request", syncs: "" },
  { name: "AdvancedMD", cat: "EMR", status: "On request", syncs: "" },
  { name: "Symplast", cat: "EMR", status: "On request", syncs: "" },
  { name: "eClinicalWorks", cat: "EMR", status: "On request", syncs: "" },
  { name: "Practice+", cat: "EMR", status: "On request", syncs: "" },
  { name: "Meditab IMS", cat: "EMR", status: "On request", syncs: "" },
];
