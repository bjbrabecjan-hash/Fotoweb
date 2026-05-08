export type WorkCategory = "Hair" | "Cosmetics" | "Salon" | "Editorial";

export type WorkItem = {
  id: string;
  title: string;
  category: WorkCategory;
  src: string;
  alt: string;
  ratio: "portrait" | "landscape" | "square";
};

export const workItems: WorkItem[] = [
  {
    id: "silk-hair-editorial",
    title: "Silk Hair Editorial",
    category: "Hair",
    src: "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=1400&q=85",
    alt: "Luxury hair editorial with glossy styled hair",
    ratio: "portrait"
  },
  {
    id: "golden-skincare",
    title: "Golden Skincare",
    category: "Cosmetics",
    src: "https://images.unsplash.com/photo-1596462502278-27bfdc403348?auto=format&fit=crop&w=1400&q=85",
    alt: "Premium cosmetics and makeup textures",
    ratio: "square"
  },
  {
    id: "salon-rituals",
    title: "Salon Rituals",
    category: "Salon",
    src: "https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&w=1400&q=85",
    alt: "High-end salon hair styling ritual",
    ratio: "landscape"
  },
  {
    id: "noir-beauty",
    title: "Noir Beauty",
    category: "Editorial",
    src: "https://images.unsplash.com/photo-1512316609839-ce289d3eba0a?auto=format&fit=crop&w=1400&q=85",
    alt: "Cinematic beauty portrait in soft shadows",
    ratio: "portrait"
  },
  {
    id: "fragrance-story",
    title: "Fragrance Story",
    category: "Cosmetics",
    src: "https://images.unsplash.com/photo-1594035910387-fea47794261f?auto=format&fit=crop&w=1400&q=85",
    alt: "Luxury fragrance bottle on a refined set",
    ratio: "portrait"
  },
  {
    id: "texture-study",
    title: "Texture Study",
    category: "Editorial",
    src: "https://images.unsplash.com/photo-1487412947147-5cebf100ffc2?auto=format&fit=crop&w=1400&q=85",
    alt: "Beauty makeup detail with editorial styling",
    ratio: "square"
  },
  {
    id: "soft-blonde",
    title: "Soft Blonde",
    category: "Hair",
    src: "https://images.unsplash.com/photo-1523263685509-57c1d050d19b?auto=format&fit=crop&w=1400&q=85",
    alt: "Soft blonde hair campaign portrait",
    ratio: "landscape"
  },
  {
    id: "atelier-light",
    title: "Atelier Light",
    category: "Salon",
    src: "https://images.unsplash.com/photo-1521590832167-7bcbfaa6381f?auto=format&fit=crop&w=1400&q=85",
    alt: "Premium salon interior with calm light",
    ratio: "portrait"
  }
];

export const featuredWork = workItems.slice(0, 6);

export const categories = ["All", "Hair", "Cosmetics", "Salon", "Editorial"] as const;
