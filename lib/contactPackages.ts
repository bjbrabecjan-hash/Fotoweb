export const packageIds = ["family-mini", "family-standard", "wedding-half-day", "wedding-full-day", "christmas-2026", "content-salons", "content-gastro"] as const;
export type PackageId = (typeof packageIds)[number];

export function isPackageId(value: unknown): value is PackageId {
  return typeof value === "string" && packageIds.includes(value as PackageId);
}

export const packageLabels: Record<PackageId, { cz: string; en: string }> = {
  "content-salons": { cz: "Content creator – pro salony", en: "Content creation – salons" },
  "content-gastro": { cz: "Content creator – pro gastro podniky", en: "Content creation – hospitality" },
  "family-mini": { cz: "Rodinné focení – Mini", en: "Family session – Mini" },
  "family-standard": { cz: "Rodinné focení – Standardní, 3 800 Kč", en: "Family session – Standard, CZK 3,800" },
  "wedding-half-day": { cz: "Svatba – Půl dne, 15 900 Kč", en: "Wedding – Half day, CZK 15,900" },
  "wedding-full-day": { cz: "Svatba – Celý den, 22 000 Kč", en: "Wedding – Full day, CZK 22,000" },
  "christmas-2026": { cz: "Vánoční focení 2026 – předprodej", en: "Christmas sessions 2026 – presale" }
};
