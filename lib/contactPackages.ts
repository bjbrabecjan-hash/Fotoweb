export const packageIds = ["mini", "full", "story-3", "story-5"] as const;
export type PackageId = (typeof packageIds)[number];

export function isPackageId(value: unknown): value is PackageId {
  return typeof value === "string" && packageIds.includes(value as PackageId);
}

export const packageLabels: Record<PackageId, { cz: string; en: string }> = {
  mini: { cz: "Mini – 5 900 Kč", en: "Mini – CZK 5,900" },
  full: { cz: "Full – 8 500 Kč", en: "Full – CZK 8,500" },
  "story-3": { cz: "Rodinný příběh – 3 focení od 15 900 Kč", en: "Family Story – 3 sessions from CZK 15,900" },
  "story-5": { cz: "Rodinný příběh – 5 focení od 24 900 Kč", en: "Family Story – 5 sessions from CZK 24,900" }
};
