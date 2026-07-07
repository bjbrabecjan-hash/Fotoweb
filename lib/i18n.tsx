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
      eyebrow: "Natural family photography",
      cta: "View portfolio",
      text: "Maternity, newborn, children and family sessions that preserve real emotion without stiff posing."
    },
    home: {
      featuredEyebrow: "Featured work",
      featuredTitle: "Selected visual stories",
      aboutEyebrow: "About Hana",
      aboutTitle: "Photography with editorial restraint",
      aboutText:
        "Hana Brabcová photographs pregnancy, babies, children and families with a gentle approach, soft light and space for real connection.",
      aboutCta: "Meet Hana",
      servicesEyebrow: "Services",
      servicesTitle: "For every stage of your family story",
      services: [
        {
          title: "Maternity",
          text: "A calm and sensitive record of anticipation and the beginning of a new family chapter."
        },
        {
          title: "Newborn & Babies",
          text: "First months photographed naturally at home or outside, following your family's rhythm."
        },
        {
          title: "Families & Children",
          text: "Laughter, movement and closeness without pressure, stress or forced posing."
        }
      ],
      ctaEyebrow: "Now booking",
      ctaTitle: "Keep the moments that change too quickly",
      ctaButton: "Book a session"
    },
    portfolio: {
      eyebrow: "Portfolio",
      title: "Families, maternity, babies and children",
      text: "A selection of natural family stories photographed with sensitivity, soft light and attention to real emotion.",
      categories: {
        All: "All",
        Family: "Family"
      }
    },
    about: {
      eyebrow: "About",
      text: "Hana photographs family stories through real moments, soft light and gentle guidance. Her approach is calm, natural and sensitive to children and every family stage.",
      ownerRole: "Family photographer",
      directionEyebrow: "Direction",
      directionTitle: "Real emotion without pressure",
      directionText:
        "The session follows your family's rhythm. Children can play, adults can breathe and the photographs emerge from touch, glances, movement and closeness.",
      values: ["Real emotion", "Soft natural light", "Gentle guidance", "Timeless editing"],
      ctaTitle: "Let your family story stay close",
      ctaButton: "Contact"
    },
    contact: {
      eyebrow: "Contact",
      title: "Let's preserve your story",
      text: "Tell me which family stage you would like to capture. Together we will choose the right session, place and date.",
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
      eyebrow: "Přirozené rodinné focení",
      cta: "Zobrazit portfolio",
      text: "Těhotenství, miminka, děti a rodinné chvíle zachycené s opravdovou emocí a bez strojených póz."
    },
    home: {
      featuredEyebrow: "Vybrané práce",
      featuredTitle: "Vybrané vizuální příběhy",
      aboutEyebrow: "O Haně",
      aboutTitle: "Fotografie s elegancí a klidem",
      aboutText:
        "Hana Brabcová fotografuje těhotenství, miminka, děti a rodiny jemně, v přirozeném světle a s prostorem pro skutečnou blízkost.",
      aboutCta: "Poznat Hanu",
      servicesEyebrow: "Služby",
      servicesTitle: "Pro každou etapu vašeho rodinného příběhu",
      services: [
        {
          title: "Těhotenské focení",
          text: "Klidná a citlivá vzpomínka na očekávání a začátek nové rodinné etapy."
        },
        {
          title: "Newborn a miminka",
          text: "První měsíce zachycené přirozeně doma nebo venku, v rytmu vaší rodiny."
        },
        {
          title: "Rodiny a děti",
          text: "Smích, pohyb a blízkost bez tlaku, stresu a vynucených póz."
        }
      ],
      ctaEyebrow: "Volné termíny",
      ctaTitle: "Uchovejte chvíle, které se mění příliš rychle",
      ctaButton: "Rezervovat focení"
    },
    portfolio: {
      eyebrow: "Portfolio",
      title: "Rodiny, těhotenství, miminka a děti",
      text: "Výběr přirozených rodinných příběhů fotografovaných s citem, jemným světlem a důrazem na opravdové emoce.",
      categories: {
        All: "Vše",
        Family: "Rodina"
      }
    },
    about: {
      eyebrow: "O mně",
      text: "Hana zachycuje rodinné příběhy skrze skutečné momenty, jemné světlo a citlivé vedení. Její přístup je klidný, přirozený a respektuje děti i každou rodinnou etapu.",
      ownerRole: "Rodinná fotografka",
      directionEyebrow: "Směr",
      directionTitle: "Skutečné emoce bez tlaku",
      directionText:
        "Focení se přizpůsobuje rytmu vaší rodiny. Děti si mohou hrát, dospělí vydechnout a fotografie vznikají z doteků, pohledů, pohybu a blízkosti.",
      values: ["Opravdové emoce", "Jemné přirozené světlo", "Citlivé vedení", "Nadčasové úpravy"],
      ctaTitle: "Ať váš rodinný příběh zůstane nablízku",
      ctaButton: "Kontakt"
    },
    contact: {
      eyebrow: "Kontakt",
      title: "Uchovejme váš příběh",
      text: "Napište mi, kterou rodinnou etapu chcete zachytit. Společně vybereme vhodné focení, místo a termín.",
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
