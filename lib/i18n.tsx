"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";

export type Locale = "en" | "cz";

type Dictionary = {
  nav: {
    instagram: string;
    portfolio: string;
    about: string;
    contact: string;
    homeLabel: string;
  };
  hero: {
    eyebrow: string;
    cta: string;
    text: string;
  };
  home: {
    featuredEyebrow: string;
    featuredTitle: string;
    aboutEyebrow: string;
    aboutTitle: string;
    aboutText: string;
    aboutCta: string;
    servicesEyebrow: string;
    servicesTitle: string;
    services: Array<{ title: string; text: string }>;
    ctaEyebrow: string;
    ctaTitle: string;
    ctaButton: string;
  };
  portfolio: {
    eyebrow: string;
    title: string;
    text: string;
    categories: Record<string, string>;
  };
  about: {
    eyebrow: string;
    text: string;
    directionEyebrow: string;
    directionTitle: string;
    directionText: string;
    values: string[];
    ctaTitle: string;
    ctaButton: string;
  };
  contact: {
    eyebrow: string;
    title: string;
    text: string;
    location: string;
    name: string;
    email: string;
    project: string;
    submit: string;
  };
  footer: {
    portfolio: string;
    contact: string;
  };
};

export const dictionaries: Record<Locale, Dictionary> = {
  en: {
    nav: {
      instagram: "Instagram",
      portfolio: "Portfolio",
      about: "About",
      contact: "Contact",
      homeLabel: "Hana Brabcová home"
    },
    hero: {
      eyebrow: "Brand content for beauty brands",
      cta: "View portfolio",
      text: "Cinematic photography, short-form visuals, and polished brand stories for salons, hair artists, and cosmetics labels."
    },
    home: {
      featuredEyebrow: "Featured work",
      featuredTitle: "Selected beauty stories",
      aboutEyebrow: "About Hana",
      aboutTitle: "Beauty visuals with editorial restraint",
      aboutText:
        "Hana Brabcová creates polished photo and video content for beauty brands that want their online presence to feel elevated, tactile, and unmistakably premium. Her work balances clean composition with soft cinematic light.",
      aboutCta: "Meet Hana",
      servicesEyebrow: "Services",
      servicesTitle: "Made for premium beauty",
      services: [
        {
          title: "Photo & Video Content",
          text: "Campaign imagery, launch assets, reels, and refined detail shots shaped for beauty audiences."
        },
        {
          title: "Social Media Visuals",
          text: "Consistent visual systems for Instagram, TikTok, salon launches, and product-led storytelling."
        },
        {
          title: "Premium Brand Storytelling",
          text: "Editorial direction that makes hair, skin, fragrance, and service rituals feel cinematic and desirable."
        }
      ],
      ctaEyebrow: "Now booking",
      ctaTitle: "Create a visual world your clients can feel",
      ctaButton: "Start a project"
    },
    portfolio: {
      eyebrow: "Portfolio",
      title: "Hair, cosmetics, salons",
      text: "A focused selection of cinematic content for beauty campaigns, social launches, salon identities, and editorial moments.",
      categories: {
        All: "All",
        Hair: "Hair",
        Cosmetics: "Cosmetics",
        Salon: "Salon",
        Editorial: "Editorial"
      }
    },
    about: {
      eyebrow: "About",
      text: "Hana builds visual identities for beauty brands through polished photography, short-form video, and precise art direction. Her approach is minimal, elegant, and built for brands that understand the value of atmosphere.",
      directionEyebrow: "Direction",
      directionTitle: "Luxury without noise",
      directionText:
        "Every frame is planned around texture, touch, and the quiet confidence that makes a salon, product, or artist feel high-end before a client reads a single caption.",
      values: ["Quiet luxury", "Soft cinematic light", "Beauty-first composition", "Social-ready delivery"],
      ctaTitle: "Let the brand feel considered from the first glance",
      ctaButton: "Contact"
    },
    contact: {
      eyebrow: "Contact",
      title: "Start a beauty story",
      text: "Share the brand, campaign, salon, or launch you are shaping. Hana will respond with availability, direction, and the right content format for your goals.",
      location: "Prague and destination shoots",
      name: "Name",
      email: "Email",
      project: "Project",
      submit: "Send inquiry"
    },
    footer: {
      portfolio: "Portfolio",
      contact: "Contact"
    }
  },
  cz: {
    nav: {
      instagram: "Instagram",
      portfolio: "Portfolio",
      about: "O mně",
      contact: "Kontakt",
      homeLabel: "Domů Hana Brabcová"
    },
    hero: {
      eyebrow: "Brand content pro beauty značky",
      cta: "Zobrazit portfolio",
      text: "Cinematická fotografie, krátká videa a prémiový vizuální storytelling pro salony, vlasové stylisty a kosmetické značky."
    },
    home: {
      featuredEyebrow: "Vybrané práce",
      featuredTitle: "Beauty příběhy",
      aboutEyebrow: "O Haně",
      aboutTitle: "Beauty vizuály s elegancí a klidem",
      aboutText:
        "Hana Brabcová tvoří prémiový foto a video obsah pro beauty značky, které chtějí působit elegantně, hmatatelně a sebevědomě. Její práce propojuje čistou kompozici s jemným cinematickým světlem.",
      aboutCta: "Poznat Hanu",
      servicesEyebrow: "Služby",
      servicesTitle: "Tvořeno pro premium beauty",
      services: [
        {
          title: "Foto & Video Content",
          text: "Kampaňové vizuály, launch obsah, reels a detailní záběry navržené pro beauty publikum."
        },
        {
          title: "Vizuály pro sociální sítě",
          text: "Konzistentní obsah pro Instagram, TikTok, salonní prezentace a produktový storytelling."
        },
        {
          title: "Prémiový brand storytelling",
          text: "Editorial direction, díky kterému vlasy, pleť, vůně i salonní služby působí žádoucím a luxusním dojmem."
        }
      ],
      ctaEyebrow: "Volné termíny",
      ctaTitle: "Vytvořte vizuální svět, který klienti ucítí",
      ctaButton: "Začít projekt"
    },
    portfolio: {
      eyebrow: "Portfolio",
      title: "Vlasy, kosmetika, salony",
      text: "Výběr cinematického obsahu pro beauty kampaně, sociální sítě, salonní identity a editorial momenty.",
      categories: {
        All: "Vše",
        Hair: "Vlasy",
        Cosmetics: "Kosmetika",
        Salon: "Salon",
        Editorial: "Editorial"
      }
    },
    about: {
      eyebrow: "O mně",
      text: "Hana tvoří vizuální identity pro beauty značky skrze prémiovou fotografii, krátké video a přesný art direction. Její přístup je minimalistický, elegantní a určený pro značky, které rozumí síle atmosféry.",
      directionEyebrow: "Směr",
      directionTitle: "Luxus bez zbytečného hluku",
      directionText:
        "Každý záběr vzniká s důrazem na texturu, dotek a tichou jistotu, díky které salon, produkt nebo tvůrce působí prémiově ještě před první přečtenou větou.",
      values: ["Tichý luxus", "Jemné cinematické světlo", "Beauty-first kompozice", "Obsah připravený pro sítě"],
      ctaTitle: "Ať značka působí promyšleně od prvního pohledu",
      ctaButton: "Kontakt"
    },
    contact: {
      eyebrow: "Kontakt",
      title: "Začněme beauty příběh",
      text: "Napište značku, kampaň, salon nebo launch, který připravujete. Hana se ozve s dostupností, směrem a vhodným formátem obsahu pro vaše cíle.",
      location: "Praha a destination focení",
      name: "Jméno",
      email: "Email",
      project: "Projekt",
      submit: "Odeslat poptávku"
    },
    footer: {
      portfolio: "Portfolio",
      contact: "Kontakt"
    }
  }
};

type LanguageContextValue = {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  t: Dictionary;
};

const LanguageContext = createContext<LanguageContextValue | null>(null);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>("en");

  useEffect(() => {
    const stored = window.localStorage.getItem("hana-locale");
    if (stored === "en" || stored === "cz") {
      setLocaleState(stored);
    }
  }, []);

  function setLocale(nextLocale: Locale) {
    setLocaleState(nextLocale);
    window.localStorage.setItem("hana-locale", nextLocale);
  }

  const value = useMemo(() => ({ locale, setLocale, t: dictionaries[locale] }), [locale]);

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguage must be used inside LanguageProvider");
  }
  return context;
}
