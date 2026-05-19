import fs from "node:fs";
import path from "node:path";
import { fallbackPortfolioItems, type PortfolioCategory, type PortfolioItem } from "@/lib/portfolioData";

const categoryFolders: Array<{ folder: string; category: PortfolioCategory; ratio: PortfolioItem["ratio"] }> = [
  { folder: "beauty", category: "Beauty", ratio: "portrait" },
  { folder: "hair", category: "Hair", ratio: "landscape" },
  { folder: "salon", category: "Salon", ratio: "landscape" },
  { folder: "portraits", category: "Portraits", ratio: "portrait" },
  { folder: "branding", category: "Branding", ratio: "square" },
  { folder: "editorial", category: "Editorial", ratio: "portrait" },
  { folder: "reels", category: "Reels", ratio: "portrait" }
];

const imageExtensions = new Set([".jpg", ".jpeg", ".png", ".webp", ".avif"]);
const videoExtensions = new Set([".mp4", ".webm", ".mov"]);

function titleFromFile(fileName: string) {
  return path
    .basename(fileName, path.extname(fileName))
    .replace(/[-_]+/g, " ")
    .replace(/\b\w/g, (letter) => letter.toUpperCase());
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
          alt: `${category} visual story by Hana Brabcová`,
          ratio
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
