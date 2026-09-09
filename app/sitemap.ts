import type { MetadataRoute } from "next";
import { photoSessions } from "@/lib/photoSessions";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = "https://hana-brabcova.vercel.app";
  return ["", "/portfolio", "/about", "/contact", ...photoSessions.map(({ slug }) => `/${slug}`)].map((path) => ({ url: `${base}${path}`, changeFrequency: path === "" ? "monthly" : "yearly", priority: path === "" ? 1 : 0.7 }));
}
