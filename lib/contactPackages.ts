export const packageIds = ["family-mini", "family-standard", "wedding-ceremony", "wedding-half-day", "wedding-full-day", "christmas-2026"] as const;
export type PackageId = (typeof packageIds)[number];

export function isPackageId(value: unknown): value is PackageId {
  return typeof value === "string" && packageIds.includes(value as PackageId);
}

export const packageLabels: Record<PackageId, { cz: string; en: string }> = {
  "family-mini": { cz: "Rodinné focení – Mini, 2 600 Kč", en: "Family session – Mini, CZK 2,600" },
  "family-standard": { cz: "Rodinné focení – Standardní, 3 800 Kč", en: "Family session – Standard, CZK 3,800" },
  "wedding-ceremony": { cz: "Svatba – Obřad, 5 900 Kč", en: "Wedding – Ceremony, CZK 5,900" },
  "wedding-half-day": { cz: "Svatba – Půl dne, 10 900 Kč", en: "Wedding – Half day, CZK 10,900" },
  "wedding-full-day": { cz: "Svatba – Celý den, 19 900 Kč", en: "Wedding – Full day, CZK 19,900" },
  "christmas-2026": { cz: "Vánoční focení 2026 – předprodej", en: "Christmas sessions 2026 – presale" }
};
