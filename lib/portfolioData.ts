export type PortfolioCategory = "Beauty" | "Hair" | "Salon" | "Family";

export type PortfolioItem = {
  id: string;
  title: string;
  category: PortfolioCategory;
  type: "image" | "video";
  src: string;
  alt: string;
  ratio: "portrait" | "landscape" | "square";
};

export const portfolioCategories: Array<"All" | PortfolioCategory> = [
  "All",
  "Beauty",
  "Hair",
  "Salon",
  "Family"
];

export const fallbackPortfolioItems: PortfolioItem[] = [
  {
    id: "hair-hana-story",
    title: "Hana Hair Story",
    category: "Hair",
    type: "image",
    src: "/assets/portfolio/hair/hana-hair-story.jpg",
    alt: "Cinematic brunette hair visual story",
    ratio: "landscape"
  }
];
