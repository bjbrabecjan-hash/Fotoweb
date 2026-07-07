export type PortfolioCategory = "Family";

export type PortfolioItem = {
  id: string;
  title: string;
  category: PortfolioCategory;
  type: "image" | "video";
  src: string;
  alt: string;
  ratio: "portrait" | "landscape" | "square";
};

export const portfolioCategories: Array<"All" | PortfolioCategory> = ["All", "Family"];

export const fallbackPortfolioItems: PortfolioItem[] = [
  {
    id: "family-forest",
    title: "Rodinný příběh",
    category: "Family",
    type: "image",
    src: "/assets/portfolio/family/01-family-forest-portrait.jpg",
    alt: "Přirozený rodinný portrét od Hany Brabcové",
    ratio: "portrait"
  }
];
