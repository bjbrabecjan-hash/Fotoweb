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
    src: "/assets/portfolio/hair/brunette-curls-final-look.jpg",
    alt: "Luxury hair editorial with glossy styled hair",
    ratio: "portrait"
  },
  {
    id: "golden-skincare",
    title: "Golden Skincare",
    category: "Cosmetics",
    src: "/assets/portfolio/beauty/gold-facial-mask-application.jpg",
    alt: "Premium cosmetics and makeup textures",
    ratio: "square"
  },
  {
    id: "salon-rituals",
    title: "Salon Rituals",
    category: "Salon",
    src: "/assets/portfolio/salon/green-beauty-studio-interior.jpg",
    alt: "High-end salon hair styling ritual",
    ratio: "landscape"
  },
  {
    id: "noir-beauty",
    title: "Noir Beauty",
    category: "Editorial",
    src: "/assets/portfolio/beauty/lip-treatment-detail.jpg",
    alt: "Cinematic beauty portrait in soft shadows",
    ratio: "portrait"
  },
  {
    id: "fragrance-story",
    title: "Fragrance Story",
    category: "Cosmetics",
    src: "/assets/portfolio/beauty/beauty-client-treatment-bed.jpg",
    alt: "Luxury fragrance bottle on a refined set",
    ratio: "portrait"
  },
  {
    id: "texture-study",
    title: "Texture Study",
    category: "Editorial",
    src: "/assets/portfolio/beauty/facial-cupping-treatment.jpg",
    alt: "Beauty makeup detail with editorial styling",
    ratio: "square"
  },
  {
    id: "soft-blonde",
    title: "Soft Blonde",
    category: "Hair",
    src: "/assets/portfolio/hair/brunette-curls-iron-detail.jpg",
    alt: "Soft blonde hair campaign portrait",
    ratio: "landscape"
  },
  {
    id: "atelier-light",
    title: "Atelier Light",
    category: "Salon",
    src: "/assets/portfolio/hair/blowout-brush-dryer-detail.jpg",
    alt: "Premium salon interior with calm light",
    ratio: "portrait"
  }
];

export const featuredWork = workItems.slice(0, 6);

export const categories = ["All", "Hair", "Cosmetics", "Salon", "Editorial"] as const;
