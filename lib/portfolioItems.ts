import fs from "node:fs";
import path from "node:path";
import { fallbackPortfolioItems, type PortfolioCategory, type PortfolioItem } from "@/lib/portfolioData";

const categoryFolders: Array<{ folder: string; category: PortfolioCategory; ratio: PortfolioItem["ratio"] }> = [
  { folder: "family", category: "Family", ratio: "portrait" },
  { folder: "studio", category: "Studio", ratio: "portrait" }
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
  "32-water-splash-portrait.jpg": { title: "Radost v pohybu", alt: "Portrét ve vodě zachycující pohyb a stříkající kapky" },
  "33-girl-field-bw-portrait.jpg": { title: "Dívčí portrét", alt: "Černobílý portrét dívky v přírodě" },
  "34-family-meadow-landscape.jpg": { title: "Rodina na louce", alt: "Rodinný portrét rodičů se dvěma dětmi na louce" },
  "35-family-meadow-close-landscape.jpg": { title: "Všichni spolu", alt: "Uvolněný rodinný portrét v přírodě" },
  "36-mother-daughter-grass-portrait.jpg": { title: "Máma a dcera", alt: "Maminka s dcerou stojí mezi vysokými travinami" },
  "37-family-path-portrait.jpg": { title: "Rodinná cesta", alt: "Rodina při společné chvíli na cestě mezi travinami" },
  "38-mother-daughter-embrace-portrait.jpg": { title: "V maminčině náruči", alt: "Maminka objímá dceru při venkovním focení" },
  "39-mother-daughter-flowers-portrait.jpg": { title: "Luční kvítí", alt: "Dcera zdobí maminku lučními květy" },
  "40-mother-son-kiss-bw-portrait.jpg": { title: "Maminka a syn", alt: "Černobílá fotografie maminky líbající malého syna" },
  "41-mother-son-walk-portrait.jpg": { title: "Společná procházka", alt: "Maminka nese malého syna mezi travinami" },
  "42-mother-son-laugh-bw-portrait.jpg": { title: "Upřímná radost", alt: "Černobílý portrét smějící se maminky se synem" },
  "43-mother-son-close-portrait.jpg": { title: "Blízko u mámy", alt: "Jemný portrét maminky s malým synem" },
  "44-girl-grass-portrait.jpg": { title: "V letní trávě", alt: "Portrét dívky s travinami v podvečerním světle" },
  "45-woman-field-portrait.jpg": { title: "Letní portrét", alt: "Přirozený portrét ženy na louce" },
  "46-woman-field-close-portrait.jpg": { title: "Tiché světlo", alt: "Detailní portrét ženy v měkkém přírodním světle" },
  "47-mother-daughter-reeds-portrait.jpg": { title: "Spolu v rákosí", alt: "Maminka s dcerou se objímají mezi vysokými travinami" },
  "48-mother-daughter-station-portrait.jpg": { title: "Na nádraží", alt: "Maminka s dcerou při společné chvíli na nádraží" },
  "49-mother-daughter-kiss-station-portrait.jpg": { title: "Pusa na cestu", alt: "Maminka líbá dceru při městském rodinném focení" },
  "50-girl-station-portrait.jpg": { title: "Hravý okamžik", alt: "Dívka se hravě schovává za zeleným sloupem nádraží" },
  "51-woman-station-portrait.jpg": { title: "Městský portrét", alt: "Portrét ženy u historického nádražního sloupu" },
  "52-family-station-landscape.jpg": { title: "Rodina ve městě", alt: "Rodinný portrét na historickém nádraží" },
  "53-mother-child-station-portrait.jpg": { title: "Maminka a nejmladší", alt: "Maminka líbá malé dítě při focení na nádraží" },
  "54-boy-station-portrait.jpg": { title: "Malý cestovatel", alt: "Portrét chlapce na nádraží s rodinou v pozadí" },
  "55-brothers-station-portrait.jpg": { title: "Bratři na cestách", alt: "Dva bratři spolu u zábradlí na nádraží" },
  "56-brothers-station-bw-portrait.jpg": { title: "Sourozenecké tajemství", alt: "Černobílá fotografie dvou bratrů na nádraží" },
  "57-child-hands-station-landscape.jpg": { title: "Malé ruce", alt: "Detail dětských rukou položených na nádražním zábradlí" },
  "58-family-platform-landscape.jpg": { title: "Společné zastavení", alt: "Rodina při uvolněném focení na nástupišti" },
  "59-family-embrace-station-landscape.jpg": { title: "Rodinné objetí", alt: "Rodiče a děti v pevném objetí na nádraží" },
  "60-family-hug-station-portrait.jpg": { title: "Hravé objetí", alt: "Rodina se směje a objímá při focení na nádraží" },
  "61-family-picnic-landscape.jpg": { title: "Piknik v přírodě", alt: "Rodina s dětmi sedí společně na dece v přírodě" },
  "62-father-sons-picnic-landscape.jpg": { title: "Táta a synové", alt: "Otec se dvěma syny při venkovním rodinném focení" },
  "63-family-picnic-close-landscape.jpg": { title: "Rodinná pohoda", alt: "Uvolněný detail rodiny při pikniku v přírodě" },
  "64-boy-grass-landscape.jpg": { title: "Hra v trávě", alt: "Malý chlapec si hraje ve vysoké trávě" },
  "65-family-play-meadow-portrait.jpg": { title: "Vzhůru nohama", alt: "Rodiče si hravě užívají chvíli se svými syny na louce" },
  "66-mother-child-close-portrait.jpg": { title: "V bezpečí", alt: "Blízký portrét maminky s malým dítětem" },
  "67-child-close-portrait.jpg": { title: "Dětské oči", alt: "Detailní portrét světlovlasého dítěte s modrýma očima" },
  "01-girl-black-portrait.jpg": { title: "Tichý ateliérový portrét", alt: "Ateliérový portrét dívky v černém oblečení na světlém pozadí" },
  "02-boy-denim-close-portrait.jpg": { title: "Modré oči", alt: "Detailní ateliérový portrét chlapce v džínových lacláčích" },
  "03-boy-denim-seated-portrait.jpg": { title: "Malý osobitý portrét", alt: "Chlapec sedí při přirozeném focení v ateliéru" },
  "04-siblings-studio-landscape.jpg": { title: "Sourozenci spolu", alt: "Sourozenecký portrét chlapce a dívky ve světlém ateliéru" },
  "05-siblings-studio-portrait.jpg": { title: "Sourozenecká blízkost", alt: "Dívka a mladší chlapec společně pózují v ateliéru" }
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
        const content = portfolioCopy[fileName] ?? (category === "Studio"
          ? { title: "Ateliérový portrét", alt: "Přirozená ateliérová fotografie od Hany Brabcové" }
          : { title: "Rodinný příběh", alt: "Přirozená rodinná fotografie od Hany Brabcové" });
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
