import fs from "node:fs";
import path from "node:path";
import { fallbackPortfolioItems, type PortfolioCategory, type PortfolioItem } from "@/lib/portfolioData";

const categoryFolders: Array<{ folder: string; category: PortfolioCategory; ratio: PortfolioItem["ratio"] }> = [
  { folder: "family", category: "Family", ratio: "portrait" }
];

const imageExtensions = new Set([".jpg", ".jpeg", ".png", ".webp", ".avif"]);
const videoExtensions = new Set([".mp4", ".webm", ".mov"]);
const portfolioTitles: Record<string, string> = {
  "25-child-heart-color-portrait.jpg": "Srdce v dlaních",
  "26-child-paint-play-bw-portrait.jpg": "Hra bez pravidel",
  "27-child-cake-bw-portrait.jpg": "Narozeninový okamžik",
  "28-child-painted-face-portrait.jpg": "Barvy dětství",
  "29-child-birthday-portrait.jpg": "Jedno malé přání",
  "30-woman-water-warm-landscape.jpg": "V teplém světle",
  "31-woman-water-reflection-portrait.jpg": "Tiché zrcadlení",
  "32-water-splash-portrait.jpg": "Radost v pohybu"
};

function titleFromFile(fileName: string) {
  if (portfolioTitles[fileName]) {
    return portfolioTitles[fileName];
  }

  return path
    .basename(fileName, path.extname(fileName))
    .replace(/[-_]+/g, " ")
    .replace(/^\d+\s+/, "")
    .replace(/\b\w/g, (letter) => letter.toUpperCase());
}

function ratioFromFile(fileName: string, fallback: PortfolioItem["ratio"]) {
  const normalized = fileName.toLowerCase();

  if (normalized.includes("landscape")) {
    return "landscape";
  }

  if (normalized.includes("square")) {
    return "square";
  }

  if (normalized.includes("portrait")) {
    return "portrait";
  }

  return fallback;
}

export function getPortfolioItems(): PortfolioItem[] {
  const publicDir = path.join(process.cwd(), "public");
  const portfolioDir = path.join(publicDir, "assets", "portfolio");

  const discovered = categoryFolders.flatMap(({ folder, category, ratio }) => {
    const absoluteFolder = path.join(portfolioDir, folder);
    if (!fs.existsSync(absoluteFolder)) {
      return [];
    }

    return fs
      .readdirSync(absoluteFolder)
      .filter((fileName) => {
        const extension = path.extname(fileName).toLowerCase();
        return imageExtensions.has(extension) || videoExtensions.has(extension);
      })
      .map((fileName) => {
        const extension = path.extname(fileName).toLowerCase();
        return {
          id: `${folder}-${path.basename(fileName, extension)}`,
          title: titleFromFile(fileName),
          category,
          type: videoExtensions.has(extension) ? "video" : "image",
          src: `/assets/portfolio/${folder}/${fileName}`,
          alt: `Rodinný příběh fotografovaný Hanou Brabcovou`,
          ratio: ratioFromFile(fileName, ratio)
        } satisfies PortfolioItem;
      });
  });

  if (discovered.length > 0) {
    const discoveredSources = new Set(discovered.map((item) => item.src));
    const supplemental = fallbackPortfolioItems.filter((item) => !discoveredSources.has(item.src));
    return [...discovered, ...supplemental];
  }

  return fallbackPortfolioItems;
}
