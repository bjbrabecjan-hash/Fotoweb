import type { Metadata } from "next";

export const siteUrl = "https://hana-brabcova.vercel.app";
export const homeTitle = "Rodinná fotografka – Moravskoslezský kraj | Hana Brabcová";
export const homeDescription = "Přirozené rodinné, těhotenské a newborn focení v Moravskoslezském kraji. Prohlédněte si fotografie Hany Brabcové, ceník a domluvte si termín.";

export function pageMetadata(title: string, description: string, path: string): Metadata {
  const fullTitle = title === homeTitle ? title : `${title} | Hana Brabcová`;
  return {
    title: { absolute: fullTitle },
    description,
    alternates: { canonical: path },
    openGraph: {
      title: fullTitle, description, url: path,
      siteName: "Hana Brabcová", locale: "cs_CZ", type: "website",
      images: [{ url: "/assets/about/hana-owner-portrait.png", alt: "Hana Brabcová, rodinná fotografka" }]
    },
    twitter: {
      card: "summary_large_image", title: fullTitle, description,
      images: ["/assets/about/hana-owner-portrait.png"]
    }
  };
}
