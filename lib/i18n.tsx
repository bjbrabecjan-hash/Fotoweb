"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";

export type Locale = "en" | "cz";

type Dictionary = {
  nav: {
    home: string;
    instagram: string;
    facebook: string;
    portfolio: string;
    services: string;
    process: string;
    about: string;
    contact: string;
    bookSession: string;
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
    ownerRole: string;
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
      home: "Home",
      instagram: "Instagram",
      facebook: "Facebook",
      portfolio: "Portfolio",
      services: "Services",
      process: "Process",
      about: "About",
      contact: "Contact",
      bookSession: "Book a Session",
      homeLabel: "Hana Brabcová home"
    },
    hero: {
      eyebrow: "Photography for brands, portraits and families",
      cta: "View portfolio",
      text: "Cinematic photography, short-form visuals, polished brand stories, natural portraits, and family sessions with feeling."
    },
    home: {
      featuredEyebrow: "Featured work",
      featuredTitle: "Selected visual stories",
      aboutEyebrow: "About Hana",
      aboutTitle: "Photography with editorial restraint",
      aboutText:
        "Hana Brabcová creates polished photo and video content for beauty brands, entrepreneurs and families who want images to feel elevated, tactile and honest. Her work balances clean composition with soft cinematic light.",
      aboutCta: "Meet Hana",
      servicesEyebrow: "Services",
      servicesTitle: "Made for brands, portraits and families",
      services: [
        {
          title: "Photo & Video Content",
          text: "Campaign imagery, launch assets, reels, portraits and refined details shaped for a polished presence."
        },
        {
          title: "Family Photography",
          text: "Natural outdoor and lifestyle sessions for families, children and moments that should stay close."
        },
        {
          title: "Brand & Personal Storytelling",
          text: "Editorial direction that makes products, services and people feel cinematic, clear and memorable."
        }
      ],
      ctaEyebrow: "Now booking",
      ctaTitle: "Create a visual world your clients can feel",
      ctaButton: "Start a project"
    },
    portfolio: {
      eyebrow: "Portfolio",
      title: "Hair, cosmetics, salons, families",
      text: "A focused selection of cinematic content for beauty campaigns, social launches, salon identities, family portraits, and editorial moments.",
      categories: {
        All: "All",
        Beauty: "Beauty",
        Hair: "Hair",
        Salon: "Salon",
        Family: "Family",
        Cosmetics: "Cosmetics",
        Editorial: "Editorial"
      }
    },
    about: {
      eyebrow: "About",
      text: "Hana builds visual stories through polished photography, short-form video, and precise direction. Her approach is minimal, elegant, and equally attentive to beauty brands, portraits and family moments.",
      ownerRole: "Owner & visual director",
      directionEyebrow: "Direction",
      directionTitle: "Emotion without noise",
      directionText:
        "Every frame is planned around light, texture, touch and expression, so a salon, product, portrait or family story feels considered before a viewer reads a single caption.",
      values: ["Quiet emotion", "Soft cinematic light", "Human-first composition", "Social-ready delivery"],
      ctaTitle: "Let the story feel considered from the first glance",
      ctaButton: "Contact"
    },
    contact: {
      eyebrow: "Contact",
      title: "Start a visual story",
      text: "Share the brand, salon, portrait session, family shoot or launch you are shaping. Hana will respond with availability and the right visual format for your goals.",
      location: "Moravian-Silesian Region and nearby areas",
      name: "Name",
      email: "Email",
      project: "Project / message",
      submit: "Send inquiry"
    },
    footer: {
      portfolio: "Portfolio",
      contact: "Contact"
    }
  },
  cz: {
    nav: {
      home: "Domů",
      instagram: "Instagram",
      facebook: "Facebook",
      portfolio: "Portfolio",
      services: "Služby",
      process: "Proces",
      about: "O mně",
      contact: "Kontakt",
      bookSession: "Rezervovat focení",
      homeLabel: "Domů Hana Brabcová"
    },
    hero: {
      eyebrow: "Fotografie pro značky, portréty a rodiny",
      cta: "Zobrazit portfolio",
      text: "Cinematická fotografie, krátká videa, promyšlené brand příběhy, přirozené portréty a rodinné focení s atmosférou."
    },
    home: {
      featuredEyebrow: "Vybrané práce",
      featuredTitle: "Vybrané vizuální příběhy",
      aboutEyebrow: "O Haně",
      aboutTitle: "Fotografie s elegancí a klidem",
      aboutText:
        "Hana Brabcová tvoří promyšlený foto a video obsah pro beauty značky, podnikatele i rodiny, které chtějí snímky s atmosférou, citem a profesionálním dojmem.",
      aboutCta: "Poznat Hanu",
      servicesEyebrow: "Služby",
      servicesTitle: "Tvořeno pro značky, portréty a rodiny",
      services: [
        {
          title: "Foto & Video Content",
          text: "Kampaňové vizuály, launch obsah, reels, portréty a detaily navržené pro kultivovanou prezentaci."
        },
        {
          title: "Rodinné focení",
          text: "Přirozené venkovní a lifestyle focení pro rodiny, děti a momenty, které mají zůstat blízko."
        },
        {
          title: "Brand & osobní storytelling",
          text: "Editorial direction, díky kterému produkty, služby i lidé působí cinematicky, jasně a zapamatovatelně."
        }
      ],
      ctaEyebrow: "Volné termíny",
      ctaTitle: "Vytvořte vizuální svět, který klienti ucítí",
      ctaButton: "Začít projekt"
    },
    portfolio: {
      eyebrow: "Portfolio",
      title: "Vlasy, kosmetika, salony, rodiny",
      text: "Výběr cinematického obsahu pro beauty kampaně, sociální sítě, salonní identity, rodinné portréty a editorial momenty.",
      categories: {
        All: "Vše",
        Beauty: "Beauty",
        Hair: "Vlasy",
        Salon: "Salon",
        Family: "Rodina",
        Cosmetics: "Kosmetika",
        Editorial: "Editorial"
      }
    },
    about: {
      eyebrow: "O mně",
      text: "Hana tvoří vizuální příběhy skrze prémiovou fotografii, krátké video a přesné vedení focení. Její přístup je minimalistický, elegantní a stejně citlivý k beauty značkám, portrétům i rodinným momentům.",
      ownerRole: "Majitelka webu",
      directionEyebrow: "Směr",
      directionTitle: "Emoce bez zbytečného hluku",
      directionText:
        "Každý záběr vzniká s důrazem na světlo, texturu, dotek a výraz, aby salon, produkt, portrét nebo rodinný příběh působil promyšleně ještě před první přečtenou větou.",
      values: ["Tichá emoce", "Jemné cinematické světlo", "Kompozice zaměřená na člověka", "Obsah připravený pro sítě"],
      ctaTitle: "Ať příběh působí promyšleně od prvního pohledu",
      ctaButton: "Kontakt"
    },
    contact: {
      eyebrow: "Kontakt",
      title: "Začněme vizuální příběh",
      text: "Napište značku, salon, portrét, rodinné focení nebo launch, který připravujete. Hana se ozve s dostupností a vhodným vizuálním formátem pro vaše cíle.",
      location: "Moravskoslezský kraj a okolí",
      name: "Jméno",
      email: "Email",
      project: "Projekt / zpráva",
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
  const [locale, setLocaleState] = useState<Locale>("cz");

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
