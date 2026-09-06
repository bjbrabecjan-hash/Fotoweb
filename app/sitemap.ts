import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = "https://hana-brabcova.vercel.app";
  return ["", "/portfolio", "/about", "/contact"].map((path) => ({ url: `${base}${path}`, changeFrequency: path === "" ? "monthly" : "yearly", priority: path === "" ? 1 : 0.7 }));
}
