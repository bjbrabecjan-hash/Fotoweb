import fs from "node:fs";
import path from "node:path";
import { fallbackPortfolioItems, type PortfolioCategory, type PortfolioItem } from "@/lib/portfolioData";

const categoryFolders: Array<{ folder: string; category: PortfolioCategory; ratio: PortfolioItem["ratio"] }> = [
  { folder: "family", category: "Family", ratio: "portrait" }
];

const imageExtensions = new Set([".jpg", ".jpeg", ".png", ".webp", ".avif"]);
const videoExtensions = new Set([".mp4", ".webm", ".mov"]);
const portfolioCopy: Record<string, { title: string; alt: string }> = {
  "01-family-forest-portrait.jpg": { title: "Spolu v lese", alt: "Rodina s dětmi společně stojí v lese" },
  "02-family-kiss-landscape.jpg": { title: "Rodinné objetí", alt: "Rodiče se líbají při společném rodinném focení" },
  "03-family-path-landscape.jpg": { title: "Společnou cestou", alt: "Rodina s dětmi kráčí po cestě v přírodě" },
  "04-baby-sun-portrait.jpg": { title: "V ranním světle", alt: "Miminko v jemném slunečním světle" },
  "05-baby-hands-bw-landscape.jpg": { title: "Malé detaily", alt: "Černobílý detail rukou miminka" },
  "06-mother-baby-portrait.jpg": { title: "V bezpečí náruče", alt: "Maminka drží miminko v náručí" },
  "07-family-green-portrait.jpg": { title: "Rodinná blízkost", alt: "Rodinný portrét v zeleni" },
  "08-mother-sons-meadow-portrait.jpg": { title: "Máma a synové", alt: "Maminka se dvěma syny na louce" },
  "09-brothers-fence-landscape.jpg": { title: "Bratři", alt: "Dva bratři společně u dřevěného plotu" },
  "10-boy-portrait-bw-landscape.jpg": { title: "Tichý portrét", alt: "Černobílý portrét chlapce" },
  "11-girl-door-bw-landscape.jpg": { title: "Ve dveřích", alt: "Černobílý portrét dívky ve dveřích" },
  "12-child-car-bw-landscape.jpg": { title: "Na cestě", alt: "Černobílý portrét dítěte u auta" },
  "13-father-daughter-field-landscape.jpg": { title: "Táta a dcera", alt: "Otec objímá dceru v poli" },
  "14-father-children-field-landscape.jpg": { title: "S tátou", alt: "Otec s dětmi při společné chvíli v poli" },
  "15-mother-daughter-close-landscape.jpg": { title: "Blízko", alt: "Detail blízkosti maminky a dcery" },
  "16-mother-daughter-play-landscape.jpg": { title: "Společná hra", alt: "Maminka si hraje s dcerou venku" },
  "17-maternity-water-couple-landscape.jpg": { title: "V očekávání", alt: "Těhotenský portrét páru ve vodě" },
  "18-maternity-dog-river-landscape.jpg": { title: "Čekání u řeky", alt: "Těhotná žena se psem u řeky" },
  "19-father-son-close-portrait.jpg": { title: "Otec a syn", alt: "Blízký portrét otce se synem" },
  "20-siblings-green-landscape.jpg": { title: "Sourozenci v přírodě", alt: "Sourozenci spolu v zelené přírodě" },
  "21-family-grass-play-landscape.jpg": { title: "Hra v trávě", alt: "Rodina si společně hraje v trávě" },
  "22-siblings-soft-portrait.jpg": { title: "Sourozenecká blízkost", alt: "Jemný portrét sourozenců" },
  "23-mother-daughter-kiss-landscape.jpg": { title: "Pusa od mámy", alt: "Maminka líbá dceru" },
  "24-maternity-water-solo-landscape.jpg": { title: "Klidné očekávání", alt: "Samostatný těhotenský portrét ve vodě" },
  "25-child-heart-color-portrait.jpg": { title: "Srdce v dlaních", alt: "Dítě drží ruce ve tvaru srdce" },
  "26-child-paint-play-bw-portrait.jpg": { title: "Hra bez pravidel", alt: "Černobílý portrét dítěte při hře s barvou" },
  "27-child-cake-bw-portrait.jpg": { title: "Narozeninový okamžik", alt: "Černobílý portrét dítěte s narozeninovým dortem" },
  "28-child-painted-face-portrait.jpg": { title: "Barvy dětství", alt: "Portrét dítěte s pomalovaným obličejem" },
  "29-child-birthday-portrait.jpg": { title: "Jedno malé přání", alt: "Dítě při narozeninové oslavě" },
  "30-woman-water-warm-landscape.jpg": { title: "V teplém světle", alt: "Portrét ženy ve vodě v teplém světle" },
  "31-woman-water-reflection-portrait.jpg": { title: "Tiché zrcadlení", alt: "Portrét ženy s odrazem na vodní hladině" },
  "32-water-splash-portrait.jpg": { title: "Radost v pohybu", alt: "Portrét ve vodě zachycující pohyb a stříkající kapky" }
};

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
      .sort((a, b) => a.localeCompare(b, "cs", { numeric: true }))
      .filter((fileName) => {
        const extension = path.extname(fileName).toLowerCase();
        return imageExtensions.has(extension) || videoExtensions.has(extension);
      })
      .map((fileName) => {
        const extension = path.extname(fileName).toLowerCase();
        const content = portfolioCopy[fileName] ?? { title: "Rodinný příběh", alt: "Přirozená rodinná fotografie od Hany Brabcové" };
        return {
          id: `${folder}-${path.basename(fileName, extension)}`,
          title: content.title,
          category,
          type: videoExtensions.has(extension) ? "video" : "image",
          src: `/assets/portfolio/${folder}/${fileName}`,
          alt: content.alt,
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
