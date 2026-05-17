export type PortfolioCategory = "Beauty" | "Portraits" | "Hair" | "Branding" | "Editorial" | "Reels";

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
  "Portraits",
  "Hair",
  "Branding",
  "Editorial",
  "Reels"
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
  },
  {
    id: "beauty-gold-mask",
    title: "Golden Skin Ritual",
    category: "Beauty",
    type: "image",
    src: "https://images.unsplash.com/photo-1596462502278-27bfdc403348?auto=format&fit=crop&w=1400&q=85",
    alt: "Premium beauty cosmetics textures",
    ratio: "square"
  },
  {
    id: "portrait-soft-light",
    title: "Soft Light Portrait",
    category: "Portraits",
    type: "image",
    src: "https://images.unsplash.com/photo-1512316609839-ce289d3eba0a?auto=format&fit=crop&w=1400&q=85",
    alt: "Editorial beauty portrait in soft shadows",
    ratio: "portrait"
  },
  {
    id: "branding-fragrance",
    title: "Fragrance Brand Story",
    category: "Branding",
    type: "image",
    src: "https://images.unsplash.com/photo-1594035910387-fea47794261f?auto=format&fit=crop&w=1400&q=85",
    alt: "Luxury fragrance campaign visual",
    ratio: "portrait"
  },
  {
    id: "editorial-texture",
    title: "Texture Editorial",
    category: "Editorial",
    type: "image",
    src: "https://images.unsplash.com/photo-1487412947147-5cebf100ffc2?auto=format&fit=crop&w=1400&q=85",
    alt: "Beauty makeup editorial detail",
    ratio: "square"
  },
  {
    id: "reels-salon-motion",
    title: "Salon Motion Reel",
    category: "Reels",
    type: "video",
    src: "https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&w=1400&q=85",
    alt: "Premium salon motion story placeholder",
    ratio: "landscape"
  }
];
