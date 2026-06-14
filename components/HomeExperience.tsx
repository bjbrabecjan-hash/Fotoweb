"use client";

import Image from "next/image";
import Link from "next/link";
import {
  AnimatePresence,
  motion,
  useMotionValue,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
  type MotionValue
} from "framer-motion";
import { ArrowRight, Camera, Heart, Play, Sparkles, UserRound } from "lucide-react";
import type { CSSProperties } from "react";
import { useEffect, useMemo, useState } from "react";
import { heroSlides } from "@/lib/heroSlides";
import { portfolioCategories, type PortfolioItem } from "@/lib/portfolioData";
import { useExperience } from "@/lib/experience";
import { type Locale, useLanguage } from "@/lib/i18n";
import { cn } from "@/lib/utils";

type HomeExperienceProps = {
  portfolioItems: PortfolioItem[];
};

const hero = heroSlides[0];

const heroCards = [
  {
    title: {
      en: "Beauty Content",
      cz: "Beauty\nContent"
    },
    text: {
      en: "Skincare, makeup,\ntreatments & beauty brands",
      cz: "Kosmetika, péče,\nošetření & salony"
    },
    icon: UserRound,
    offset: "xl:translate-y-3"
  },
  {
    title: {
      en: "Family\nSessions",
      cz: "Rodinné\nfocení"
    },
    text: {
      en: "Natural moments,\nchildren & family stories",
      cz: "Přirozené momenty,\nděti & rodinné příběhy"
    },
    icon: Heart,
    offset: "xl:-translate-y-5"
  },
  {
    title: {
      en: "Portrait\nSessions",
      cz: "Portrétní\nfocení"
    },
    text: {
      en: "Personal branding\n& professional portraits",
      cz: "Osobní brand\n& profesionální portréty"
    },
    icon: Camera,
    offset: "xl:translate-y-6"
  },
  {
    title: {
      en: "Brand &\nSocial Story",
      cz: "Brand &\nobsah na sítě"
    },
    text: {
      en: "Short videos,\nvisual identity & campaigns",
      cz: "Krátká videa,\nvizuální identita & kampaně"
    },
    icon: Sparkles,
    offset: "xl:-translate-y-2"
  }
];

const signatureTiles = [
  {
    title: {
      en: "Family closeness",
      cz: "Rodinná blízkost"
    },
    src: "/assets/portfolio/family/13-father-daughter-field-landscape.jpg",
    alt: "Father and daughter in a warm field portrait"
  },
  {
    title: {
      en: "Maternity story",
      cz: "Těhotenský příběh"
    },
    src: "/assets/portfolio/family/17-maternity-water-couple-landscape.jpg",
    alt: "Maternity couple portrait in water"
  },
  {
    title: {
      en: "Children naturally",
      cz: "Děti přirozeně"
    },
    src: "/assets/portfolio/family/20-siblings-green-landscape.jpg",
    alt: "Children photographed naturally in greenery"
  }
];

const familyStoryImage = "/assets/portfolio/family/14-father-children-field-landscape.jpg";
const familyStoryAlt = "Father with children in a field photographed by Hana Brabcová";
const continuityImage = "/assets/portfolio/family/18-maternity-dog-river-landscape.jpg";
const continuityAlt = "Maternity session by a river with family dog";
const featuredStoryImage = "/assets/portfolio/family/24-maternity-water-solo-landscape.jpg";
const featuredStoryAlt = "Natural maternity portrait outdoors by Hana Brabcová";

const homeExperienceCopy: Record<
  Locale,
  {
    introKicker: string;
    introTitleTop: string;
    introTitleMiddle: string;
    introScript: string;
    introText: string;
    viewPortfolio: string;
    bookSession: string;
    footerLine: string;
    portfolioEyebrow: string;
    portfolioTitle: string;
    signatureEyebrow: string;
    signatureTitle: string;
    servicesEyebrow: string;
    servicesTitle: string;
    processEyebrow: string;
    processTitle: string;
    processSteps: string[];
    featuredEyebrow: string;
    featuredTitle: string;
    featuredText: string;
    aboutEyebrow: string;
    aboutTitle: string;
    aboutText: string;
    aboutQuote: string;
    bookingEyebrow: string;
    bookingTitle: string;
    services: Array<{ title: string; description: string }>;
    family: {
      eyebrow: string;
      title: string;
      lead: string;
      paragraphs: string[];
      audienceTitle: string;
      audienceItems: string[];
    };
    continuity: {
      eyebrow: string;
      title: string;
      paragraphs: string[];
      benefits: string[];
      closing: string;
    };
    pricing: {
      eyebrow: string;
      title: string;
      plans: Array<{
        name: string;
        price: string;
        description: string;
        features: string[];
        ideal: string;
      }>;
      storyTitle: string;
      storyOptions: string[];
      storyNote: string;
    };
    naturalProcess: {
      eyebrow: string;
      title: string;
      paragraphs: string[];
      reservation: string;
    };
  }
> = {
  en: {
    introKicker: "Photography that",
    introTitleTop: "keeps your",
    introTitleMiddle: "story",
    introScript: "Alive.",
    introText: "Cinematic photography, portraits and visual content\nfor beauty brands, salons, families and people\nwho want images with feeling.",
    viewPortfolio: "View Portfolio",
    bookSession: "Book a Session",
    footerLine: "Elegant visuals. Real emotions. Lasting impact.",
    portfolioEyebrow: "Portfolio",
    portfolioTitle: "Beauty, portraits and family stories",
    signatureEyebrow: "Signature style",
    signatureTitle: "Soft light. Real emotion. Editorial calm.",
    servicesEyebrow: "Services",
    servicesTitle: "Created for brands, portraits and families",
    processEyebrow: "Process",
    processTitle: "A calm rhythm before, during and after the shoot",
    processSteps: ["Mood, place and intention", "Creative direction or simple family plan", "Calm production day", "Polished gallery and social-ready delivery"],
    featuredEyebrow: "Featured story",
    featuredTitle: "Family moments with the same editorial care.",
    featuredText: "Natural family photography can feel refined without losing warmth. The direction stays gentle, the light stays cinematic, and the final images keep real emotion intact.",
    aboutEyebrow: "About",
    aboutTitle: "Visual stories with editorial sensitivity",
    aboutText:
      "Hana creates polished visuals for beauty brands, entrepreneurs and families. Her work is built around feeling, texture and quiet confidence, whether the subject is a salon ritual, a portrait session or a family afternoon outside.",
    aboutQuote: "Each frame should feel considered, but still honest to the person or story in front of the camera.",
    bookingEyebrow: "Booking",
    bookingTitle: "Book a shoot that feels personal and polished.",
    services: [
      {
        title: "Beauty Content",
        description: "Campaign imagery and detail-led visuals for beauty launches, skincare rituals and salon identities."
      },
      {
        title: "Family Photography",
        description: "Natural outdoor and lifestyle sessions for families, children and moments that should stay close."
      },
      {
        title: "Portrait Sessions",
        description: "Soft, editorial portraits for founders, artists, personal brands and anyone who needs a refined presence."
      },
      {
        title: "Reels & Social Content",
        description: "Short-form movement, process moments and premium vertical assets shaped for social platforms."
      }
    ],
    family: {
      eyebrow: "Family photography",
      title: "I photograph emotions that stay",
      lead: "Family sessions that capture your story naturally, without stiff posing.",
      paragraphs: [
        "Pregnancy. The first kicks. A baby in your arms. Laughing children. Hugs you will come back to one day.",
        "I do not believe in perfect poses. I believe in real moments.",
        "Laughter, restless children, gentle touches, glances and ordinary moments that become the most precious ones over time.",
        "I photograph families, maternity, babies and shared family moments so the images feel honest, soft and timeless."
      ],
      audienceTitle: "Who is it for?",
      audienceItems: ["Maternity sessions", "Newborns and babies", "Family sessions at home or outside", "Children and siblings", "Family stages throughout the year"]
    },
    continuity: {
      eyebrow: "New",
      title: "Your story from the beginning",
      paragraphs: [
        "No more searching for a new photographer for every life stage.",
        "We photograph your story together, from pregnancy through the first months with your baby to shared family moments."
      ],
      benefits: [
        "One photographer for every stage",
        "A consistent visual style across the whole story",
        "Children get used to me, so emotions become more natural",
        "Priority dates during the year",
        "Better value than separate sessions",
        "A complete story of your family"
      ],
      closing: "The most beautiful memories do not happen in one hour. They grow over time."
    },
    pricing: {
      eyebrow: "Pricing",
      title: "Family session options",
      plans: [
        {
          name: "Mini",
          price: "5 900 Kč",
          description: "For quickly capturing a beautiful season.",
          features: ["45-60 min session", "20 edited photographs", "Online gallery", "1 short memory video"],
          ideal: "Ideal for maternity, children or smaller family sessions."
        },
        {
          name: "Full",
          price: "8 500 Kč",
          description: "More emotion, more space, more story.",
          features: ["60-90 min session", "40 edited photographs", "Online gallery", "3 short videos"],
          ideal: "Ideal for larger families, more combinations and a fuller story."
        }
      ],
      storyTitle: "Family Story - the whole year together",
      storyOptions: ["3 sessions from 15 900 Kč, for example pregnancy + baby + family", "5 sessions from 24 900 Kč, a full story of your baby's first year"],
      storyNote: "Better value, secure dates, one visual style and one photographer who already knows your family."
    },
    naturalProcess: {
      eyebrow: "How it works",
      title: "You do not need to know how to pose",
      paragraphs: [
        "I guide the session naturally and gently. We talk, laugh, children play and I photograph the real moments between you.",
        "No pressure. No awkward stress.",
        "Just your family as it truly is."
      ],
      reservation: "Send me a message and we will choose the session that fits your family. I photograph in the Moravian-Silesian Region and nearby areas."
    }
  },
  cz: {
    introKicker: "Fotografie, které",
    introTitleTop: "uchovají",
    introTitleMiddle: "příběh",
    introScript: "Naživu.",
    introText: "Cinematické fotografie, portréty a vizuální obsah\npro beauty značky, salony, rodiny i jednotlivce,\nkteří chtějí snímky s atmosférou.",
    viewPortfolio: "Zobrazit portfolio",
    bookSession: "Rezervovat focení",
    footerLine: "Elegantní vizuály. Reálné emoce. Trvalý dojem.",
    portfolioEyebrow: "Portfolio",
    portfolioTitle: "Beauty, portréty a rodinné příběhy",
    signatureEyebrow: "Signature style",
    signatureTitle: "Jemné světlo. Reálné emoce. Editorial klid.",
    servicesEyebrow: "Služby",
    servicesTitle: "Tvořeno pro značky, portréty i rodiny",
    processEyebrow: "Proces",
    processTitle: "Klidný rytmus před focením, během něj i po něm",
    processSteps: ["Nálada, místo a záměr", "Kreativní směr nebo jednoduchý rodinný plán", "Klidný den focení", "Vyladěná galerie a výstupy pro sítě"],
    featuredEyebrow: "Vybraný příběh",
    featuredTitle: "Rodinné momenty se stejnou editorial péčí.",
    featuredText: "Rodinné focení může být přirozené a zároveň kultivované. Směr zůstává jemný, světlo cinematické a výsledné snímky drží opravdovou emoci.",
    aboutEyebrow: "O Haně",
    aboutTitle: "Vizuální příběhy s editorial citlivostí",
    aboutText:
      "Hana tvoří promyšlené vizuály pro beauty značky, podnikatele i rodiny. Její práce stojí na pocitu, textuře a tiché jistotě, ať jde o salonní rituál, portrét nebo rodinné odpoledne venku.",
    aboutQuote: "Každý záběr má působit promyšleně, ale pořád pravdivě k člověku nebo příběhu před objektivem.",
    bookingEyebrow: "Rezervace",
    bookingTitle: "Rezervujte focení, které bude osobní a vyladěné.",
    services: [
      {
        title: "Beauty Content",
        description: "Kampaňové fotografie a detailní vizuály pro beauty launch, salonní identitu a rituály péče."
      },
      {
        title: "Rodinné focení",
        description: "Přirozené venkovní a lifestyle focení pro rodiny, děti a momenty, které mají zůstat blízko."
      },
      {
        title: "Portrétní focení",
        description: "Jemné editorial portréty pro zakladatelky, tvůrce, osobní značky i kohokoliv, kdo potřebuje kultivovanou prezentaci."
      },
      {
        title: "Reels & obsah na sítě",
        description: "Krátká videa, procesní momenty a prémiové vertikální výstupy pro sociální platformy."
      }
    ],
    family: {
      eyebrow: "Rodinné focení",
      title: "Fotím emoce, které zůstanou",
      lead: "Rodinné focení, které zachytí váš příběh přirozeně a bez strojených póz.",
      paragraphs: [
        "Těhotenství. První kopnutí. Miminko v náručí. Rozesmáté děti. Obejmutí, na která jednou budete vzpomínat.",
        "Nevěřím na dokonalé pózy. Věřím na skutečné momenty.",
        "Na smích, neposedné děti, pohlazení, pohledy a obyčejné chvíle, které se časem stanou těmi nejvzácnějšími.",
        "Fotím rodiny, těhotenské období, miminka i společné rodinné momenty tak, aby fotky působily opravdově, jemně a nadčasově."
      ],
      audienceTitle: "Pro koho je focení?",
      audienceItems: ["Těhotenské focení", "Newborn a miminka", "Rodinné focení venku i doma", "Děti a sourozenci", "Rodinné etapy během roku"]
    },
    continuity: {
      eyebrow: "Nově",
      title: "Fotíme váš příběh od začátku",
      paragraphs: [
        "Už žádné znovu hledání fotografa na každou životní etapu.",
        "Váš příběh fotíme spolu. Od těhotenství přes první měsíce miminka až po společné rodinné chvíle."
      ],
      benefits: [
        "Nemusíte pokaždé hledat nového fotografa",
        "Fotky mají jednotný styl a krásně na sebe navazují",
        "Děti si na mě zvyknou, takže emoce jsou přirozenější",
        "Přednostní termíny během roku",
        "Výhodnější cena než jednotlivá focení",
        "Vznikne ucelený příběh vaší rodiny"
      ],
      closing: "Protože ty nejkrásnější vzpomínky nevzniknou během jedné hodiny. Vznikají časem."
    },
    pricing: {
      eyebrow: "Ceník",
      title: "Rodinné focení a návazná spolupráce",
      plans: [
        {
          name: "Mini",
          price: "5 900 Kč",
          description: "Pro rychlé zachycení krásného období.",
          features: ["Focení cca 45-60 min", "20 upravených fotografií", "Online galerie", "1 krátké video na památku"],
          ideal: "Ideální pro těhotenské, děti a menší rodinné focení."
        },
        {
          name: "Full",
          price: "8 500 Kč",
          description: "Více emocí, více prostoru, více příběhu.",
          features: ["Focení cca 60-90 min", "40 upravených fotografií", "Online galerie", "3 krátká videa"],
          ideal: "Ideální pro větší rodiny, více kombinací a kompletní příběh."
        }
      ],
      storyTitle: "Rodinný příběh - fotíme spolu celý rok",
      storyOptions: ["3 focení od 15 900 Kč, například těhotenství + miminko + rodina", "5 focení od 24 900 Kč, kompletní příběh prvního roku dítěte"],
      storyNote: "Výhodnější cena, jistota termínů, jeden styl a jeden fotograf, který už vaši rodinu zná."
    },
    naturalProcess: {
      eyebrow: "Jak focení probíhá",
      title: "Nemusíte umět pózovat",
      paragraphs: [
        "Focení vedu přirozeně a citlivě. Povídáme si, smějeme se, děti si hrají a já zachycuji skutečné momenty mezi vámi.",
        "Bez tlaku. Bez nepříjemného stresu.",
        "Jen vaše rodina taková, jaká opravdu je."
      ],
      reservation: "Napište mi zprávu a společně vybereme focení, které bude sedět právě vaší rodině. Fotím v Moravskoslezském kraji a okolí."
    }
  }
};

export function HomeExperience({ portfolioItems }: HomeExperienceProps) {
  const { locale, t } = useLanguage();
  const [activeCategory, setActiveCategory] = useState<(typeof portfolioCategories)[number]>("All");
  const { entered, enterExperience } = useExperience();
  const reducedMotion = useReducedMotion();
  const { scrollYProgress } = useScroll();
  const heroY = useTransform(scrollYProgress, [0, 0.45], reducedMotion ? [0, 0] : [0, -80]);
  const featuredImageY = useTransform(scrollYProgress, [0.42, 0.86], reducedMotion ? [0, 0] : [24, -24]);
  const featuredImageScale = useTransform(scrollYProgress, [0.42, 0.86], reducedMotion ? [1, 1] : [1.035, 1]);
  const pointerX = useMotionValue(0);
  const pointerY = useMotionValue(0);
  const copy = homeExperienceCopy[locale];
  const localizedHeroCards = heroCards.map((card) => ({
    ...card,
    title: card.title[locale],
    text: card.text[locale]
  }));
  const localizedSignatureTiles = signatureTiles.map((tile) => ({
    ...tile,
    title: tile.title[locale]
  }));
  const localizedCategoryLabels: Record<(typeof portfolioCategories)[number], string> = {
    All: t.portfolio.categories.All,
    Beauty: t.portfolio.categories.Beauty,
    Hair: t.portfolio.categories.Hair,
    Salon: t.portfolio.categories.Salon,
    Family: t.portfolio.categories.Family
  };

  const visibleItems = useMemo(
    () =>
      activeCategory === "All"
        ? portfolioItems
        : portfolioItems.filter((item) => item.category === activeCategory),
    [activeCategory, portfolioItems]
  );

  useEffect(() => {
    document.body.style.overflow = entered ? "" : "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, [entered]);

  const handleHeroPointer = (event: React.PointerEvent<HTMLElement>) => {
    if (reducedMotion) {
      return;
    }

    const rect = event.currentTarget.getBoundingClientRect();
    pointerX.set((event.clientX - rect.left) / rect.width - 0.5);
    pointerY.set((event.clientY - rect.top) / rect.height - 0.5);
  };

  return (
    <>
      <section
        className="grain relative min-h-[100svh] overflow-hidden bg-emerald-deep"
        onPointerMove={handleHeroPointer}
        onPointerLeave={() => {
          pointerX.set(0);
          pointerY.set(0);
        }}
      >
        <motion.div
          className="absolute inset-0"
          initial={false}
          animate={{
            scale: entered ? 1 : 1.08,
            filter: entered ? "blur(0px)" : "blur(18px)"
          }}
          transition={{ duration: 1.45, ease: [0.22, 1, 0.36, 1] }}
          style={{ y: heroY }}
        >
          <Image
            src={hero.src}
            alt={hero.alt}
            fill
            priority
            sizes="100vw"
            className="object-cover object-[38%_center] sm:object-[32%_center] xl:object-[26%_center]"
          />
        </motion.div>
        <div className="absolute inset-0 bg-[linear-gradient(105deg,rgba(5,20,16,0.88),rgba(7,36,28,0.42)_34%,rgba(10,10,8,0.76)_70%,rgba(9,10,8,0.95))]" />
        <div className="absolute inset-y-0 right-0 hidden w-[52vw] bg-warm-black/48 backdrop-blur-2xl [mask-image:linear-gradient(90deg,transparent,rgba(0,0,0,0.2)_8%,rgba(0,0,0,0.82)_44%,#000_76%)] lg:block" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_72%_20%,rgba(214,190,132,0.2),transparent_28rem),radial-gradient(circle_at_20%_72%,rgba(20,88,68,0.28),transparent_34rem)]" />
        <AmbientParticles active={entered} />

        <AnimatePresence>
          {!entered && (
            <motion.div
              className="absolute inset-0 z-20 flex items-center justify-center px-6 text-center"
              exit={{ opacity: 0 }}
              transition={{ duration: 0.7 }}
            >
              <motion.div
                initial={{ opacity: 0, y: 22 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
                className="max-w-4xl"
              >
                <h1 className="font-display text-5xl uppercase leading-none tracking-[0.24em] text-cream sm:text-7xl lg:text-8xl">
                  Hana Brabcová
                </h1>
                <p className="mt-6 text-sm uppercase tracking-[0.34em] text-champagne/82">
                  {locale === "cz" ? "Fotografie pro značky, portréty a rodiny." : "Photography for brands, portraits and families."}
                </p>
                <button
                  type="button"
                  onClick={enterExperience}
                  className="mt-12 inline-flex min-h-14 items-center gap-3 border border-champagne/70 bg-cream/8 px-7 text-xs font-semibold uppercase tracking-[0.24em] text-cream shadow-[0_0_42px_rgba(214,190,132,0.16)] backdrop-blur-xl transition-all duration-300 hover:scale-[1.02] hover:bg-champagne hover:text-warm-black hover:shadow-[0_0_56px_rgba(214,190,132,0.28)]"
                >
                  {locale === "cz" ? "Vstoupit" : "Enter Experience"}
                  <ArrowRight size={16} />
                </button>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        <motion.div
          className="relative z-10 mx-auto flex min-h-[100svh] max-w-[92rem] items-center px-5 pb-36 pt-28 sm:px-8 sm:pb-32 lg:px-12 lg:pb-24 lg:pt-32"
          initial={false}
          animate={entered ? "show" : "hide"}
          variants={{
            hide: { opacity: 0, y: 38, pointerEvents: "none" },
            show: { opacity: 1, y: 0, pointerEvents: "auto" }
          }}
          transition={{ duration: 0.85, delay: 0.55, ease: [0.22, 1, 0.36, 1] }}
        >
          <div className="grid w-full items-center gap-9 lg:gap-10 xl:grid-cols-[minmax(0,30rem)_minmax(0,1fr)] xl:gap-12 2xl:grid-cols-[minmax(0,33rem)_minmax(0,1fr)]">
            <div className="max-w-[30rem] xl:max-w-none">
              <p className="mb-5 text-xs uppercase tracking-[0.42em] text-champagne drop-shadow-[0_0_18px_rgba(214,190,132,0.22)]">
                {copy.introKicker}
              </p>
              <h1 className="font-display text-[clamp(2.8rem,13vw,4.4rem)] uppercase leading-[0.86] tracking-[0.045em] text-cream drop-shadow-[0_0_36px_rgba(247,241,230,0.08)] sm:text-[clamp(4rem,9vw,5.9rem)] sm:tracking-[0.07em] xl:text-[clamp(4.15rem,5.15vw,5.25rem)] 2xl:text-[5.9rem]">
                <span className="block whitespace-nowrap">{copy.introTitleTop}</span>
                <span className="block">{copy.introTitleMiddle}</span>
              </h1>
              <p className="-mt-1 pl-1 font-script text-[clamp(3rem,13vw,4.4rem)] leading-none text-champagne drop-shadow-[0_0_26px_rgba(214,190,132,0.34)] sm:text-[clamp(4rem,8vw,5rem)] xl:-mt-3 xl:text-[4.9rem] 2xl:text-[5.6rem]">
                {copy.introScript}
              </p>
              <p className="mt-8 max-w-md whitespace-pre-line text-base leading-8 tracking-[0.02em] text-cream/76">
                {copy.introText}
              </p>
              <div className="mt-9 flex flex-col gap-4 sm:flex-row">
                <LuxuryButton href="#portfolio">{copy.viewPortfolio}</LuxuryButton>
                <LuxuryButton href="/contact" variant="ghost">
                  {copy.bookSession}
                </LuxuryButton>
              </div>
            </div>
            <div className="grid w-full max-w-[34rem] grid-cols-2 gap-3 sm:gap-4 lg:max-w-3xl lg:grid-cols-4 xl:ml-auto xl:max-w-[36rem] xl:grid-cols-2 xl:gap-5 2xl:max-w-[40rem]">
              {localizedHeroCards.map((card, index) => {
                return (
                  <HeroFeatureCard
                    key={card.title}
                    card={card}
                    index={index}
                    entered={entered}
                    reducedMotion={reducedMotion}
                    pointerX={pointerX}
                    pointerY={pointerY}
                  />
                );
              })}
            </div>
          </div>
        </motion.div>

        <motion.div
          className="pointer-events-none absolute bottom-8 left-1/2 z-20 hidden -translate-x-1/2 text-center md:block"
          initial={false}
          animate={entered ? { opacity: 1, y: 0 } : { opacity: 0, y: 16 }}
          transition={{ duration: 0.8, delay: 1.05, ease: [0.22, 1, 0.36, 1] }}
        >
          <p className="text-[0.58rem] uppercase tracking-[0.34em] text-cream/44">
            {copy.footerLine}
          </p>
          <div className="mx-auto mt-4 h-10 w-px overflow-hidden bg-cream/12">
            <motion.div
              className="h-5 w-px bg-champagne/70"
              animate={reducedMotion ? undefined : { y: [-22, 42] }}
              transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
            />
          </div>
        </motion.div>
      </section>

      <main className="relative overflow-hidden bg-warm-black">
        <SectionBand id="portfolio" eyebrow={copy.portfolioEyebrow} title={copy.portfolioTitle}>
          <CategoryFilter activeCategory={activeCategory} onChange={setActiveCategory} categoryLabels={localizedCategoryLabels} />
          <div className="masonry mt-10">
            {visibleItems.map((item, index) => (
              <PortfolioCard key={item.id} item={item} index={index} />
            ))}
          </div>
        </SectionBand>

        <section className="relative border-y border-champagne/10 px-5 py-24 sm:px-8 lg:px-12">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(12,64,48,0.4),transparent_32rem)]" />
          <div className="relative mx-auto grid max-w-7xl gap-12 lg:grid-cols-[0.82fr_1.18fr]">
            <div>
              <p className="text-xs uppercase tracking-[0.32em] text-champagne">{copy.signatureEyebrow}</p>
              <h2 className="mt-5 font-display text-5xl uppercase leading-none tracking-[0.1em] text-cream sm:text-7xl">
                {copy.signatureTitle}
              </h2>
            </div>
            <div className="grid gap-4 sm:grid-cols-3">
              {localizedSignatureTiles.map((item, index) => (
                <motion.article
                  key={item.title}
                  className="group relative aspect-[4/5] overflow-hidden border border-cream/10 bg-emerald-deep"
                  initial={reducedMotion ? false : { opacity: 0, y: 24, scale: 0.985 }}
                  whileInView={reducedMotion ? undefined : { opacity: 1, y: 0, scale: 1 }}
                  viewport={{ once: true, margin: "-80px" }}
                  transition={{ duration: 0.7, delay: Math.min(index * 0.09, 0.18), ease: [0.22, 1, 0.36, 1] }}
                  whileHover={reducedMotion ? undefined : { y: -4 }}
                >
                  <Image
                    src={item.src}
                    alt={item.alt}
                    fill
                    sizes="(min-width: 1024px) 24vw, (min-width: 640px) 33vw, 100vw"
                    className="object-cover transition duration-[1400ms] group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-warm-black/88 via-warm-black/18 to-transparent" />
                  <div className="absolute bottom-5 left-5 right-5">
                    <p className="font-display text-2xl uppercase leading-tight tracking-[0.08em] text-cream drop-shadow-[0_3px_18px_rgba(0,0,0,0.7)]">{item.title}</p>
                  </div>
                </motion.article>
              ))}
            </div>
          </div>
        </section>

        <section id="family" className="relative px-5 py-24 sm:px-8 lg:px-12 lg:py-32">
          <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(247,241,230,0.035),transparent_44%,rgba(214,190,132,0.035))]" />
          <div className="relative mx-auto grid max-w-7xl items-center gap-12 lg:grid-cols-[0.95fr_1.05fr]">
            <motion.div
              className="relative aspect-[4/5] overflow-hidden border border-champagne/18 bg-emerald-deep shadow-[0_28px_90px_rgba(0,0,0,0.3)] sm:aspect-[5/4] lg:aspect-[4/5]"
              initial={reducedMotion ? false : { opacity: 0, y: 26 }}
              whileInView={reducedMotion ? undefined : { opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-90px" }}
              transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            >
              <Image src={familyStoryImage} alt={familyStoryAlt} fill sizes="(min-width: 1024px) 45vw, 100vw" className="object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-warm-black/72 via-transparent to-transparent" />
            </motion.div>
            <div>
              <p className="text-xs uppercase tracking-[0.32em] text-champagne">{copy.family.eyebrow}</p>
              <h2 className="mt-5 font-display text-5xl uppercase leading-none tracking-[0.1em] text-cream sm:text-7xl">
                {copy.family.title}
              </h2>
              <p className="mt-7 max-w-2xl text-xl leading-9 text-cream/82">{copy.family.lead}</p>
              <div className="mt-8 space-y-5 text-base leading-8 text-cream/68">
                {copy.family.paragraphs.map((paragraph) => (
                  <p key={paragraph}>{paragraph}</p>
                ))}
              </div>
              <div className="mt-10 border-y border-champagne/22 py-7">
                <h3 className="font-display text-2xl uppercase tracking-[0.1em] text-cream">{copy.family.audienceTitle}</h3>
                <div className="mt-5 flex flex-wrap gap-2">
                  {copy.family.audienceItems.map((item) => (
                    <span key={item} className="border border-cream/14 bg-cream/[0.045] px-4 py-2 text-[0.66rem] uppercase tracking-[0.18em] text-cream/72">
                      {item}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="relative border-y border-champagne/10 px-5 py-24 sm:px-8 lg:px-12">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_82%_26%,rgba(214,190,132,0.12),transparent_30rem)]" />
          <div className="relative mx-auto grid max-w-7xl gap-12 lg:grid-cols-[1fr_0.9fr]">
            <div>
              <p className="text-xs uppercase tracking-[0.32em] text-champagne">{copy.continuity.eyebrow}</p>
              <h2 className="mt-5 max-w-4xl font-display text-5xl uppercase leading-none tracking-[0.1em] text-cream sm:text-7xl">
                {copy.continuity.title}
              </h2>
              <div className="mt-7 max-w-2xl space-y-4 text-base leading-8 text-cream/70">
                {copy.continuity.paragraphs.map((paragraph) => (
                  <p key={paragraph}>{paragraph}</p>
                ))}
              </div>
              <div className="mt-10 grid gap-px overflow-hidden border border-champagne/14 bg-champagne/14 sm:grid-cols-2">
                {copy.continuity.benefits.map((benefit) => (
                  <div key={benefit} className="bg-warm-black p-5 text-sm leading-7 text-cream/74">
                    <span className="mr-3 text-champagne">+</span>
                    {benefit}
                  </div>
                ))}
              </div>
              <p className="mt-8 max-w-2xl font-display text-3xl uppercase leading-tight tracking-[0.1em] text-cream">
                {copy.continuity.closing}
              </p>
            </div>
            <motion.div
              className="relative min-h-[32rem] overflow-hidden border border-champagne/18 bg-emerald-deep"
              initial={reducedMotion ? false : { opacity: 0, y: 26 }}
              whileInView={reducedMotion ? undefined : { opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-90px" }}
              transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            >
              <Image src={continuityImage} alt={continuityAlt} fill sizes="(min-width: 1024px) 42vw, 100vw" className="object-cover object-center" />
              <div className="absolute inset-0 bg-gradient-to-t from-warm-black/80 via-warm-black/10 to-transparent" />
            </motion.div>
          </div>
        </section>

        <SectionBand id="pricing" eyebrow={copy.pricing.eyebrow} title={copy.pricing.title}>
          <div className="grid gap-5 lg:grid-cols-[1fr_1fr_1.18fr]">
            {copy.pricing.plans.map((plan) => (
              <article key={plan.name} className="border border-champagne/18 bg-cream/[0.055] p-7 backdrop-blur-xl">
                <p className="text-xs uppercase tracking-[0.28em] text-champagne">{plan.name}</p>
                <h3 className="mt-5 font-display text-4xl uppercase tracking-[0.08em] text-cream">{plan.price}</h3>
                <p className="mt-5 text-sm leading-7 text-cream/66">{plan.description}</p>
                <ul className="mt-7 space-y-3 text-sm leading-6 text-cream/78">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex gap-3">
                      <span className="mt-1 text-champagne">+</span>
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
                <p className="mt-7 border-t border-cream/12 pt-5 text-sm leading-7 text-cream/58">{plan.ideal}</p>
              </article>
            ))}
            <article className="border border-champagne/36 bg-champagne/[0.09] p-7 backdrop-blur-xl">
              <p className="text-xs uppercase tracking-[0.28em] text-champagne">{locale === "cz" ? "Předplacená spolupráce" : "Ongoing collaboration"}</p>
              <h3 className="mt-5 font-display text-3xl uppercase leading-tight tracking-[0.08em] text-cream">
                {copy.pricing.storyTitle}
              </h3>
              <ul className="mt-7 space-y-4 text-sm leading-7 text-cream/78">
                {copy.pricing.storyOptions.map((option) => (
                  <li key={option} className="flex gap-3">
                    <span className="mt-1 text-champagne">+</span>
                    <span>{option}</span>
                  </li>
                ))}
              </ul>
              <p className="mt-7 border-t border-cream/12 pt-5 text-sm leading-7 text-cream/66">{copy.pricing.storyNote}</p>
            </article>
          </div>
        </SectionBand>

        <section className="px-5 py-24 sm:px-8 lg:px-12">
          <div className="mx-auto grid max-w-7xl gap-10 border-y border-champagne/22 py-16 lg:grid-cols-[0.7fr_1fr]">
            <div>
              <p className="text-xs uppercase tracking-[0.32em] text-champagne">{copy.naturalProcess.eyebrow}</p>
              <h2 className="mt-5 font-display text-5xl uppercase leading-none tracking-[0.1em] text-cream sm:text-7xl">
                {copy.naturalProcess.title}
              </h2>
            </div>
            <div>
              <div className="space-y-5 text-base leading-8 text-cream/72">
                {copy.naturalProcess.paragraphs.map((paragraph) => (
                  <p key={paragraph}>{paragraph}</p>
                ))}
              </div>
              <p className="mt-9 text-lg leading-9 text-cream/82">{copy.naturalProcess.reservation}</p>
              <div className="mt-8">
                <LuxuryButton href="/contact">{copy.bookSession}</LuxuryButton>
              </div>
            </div>
          </div>
        </section>

        <SectionBand id="services" eyebrow={copy.servicesEyebrow} title={copy.servicesTitle}>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {copy.services.map((service) => (
              <article key={service.title} className="border border-champagne/18 bg-cream/[0.055] p-7 backdrop-blur-xl">
                <h3 className="font-display text-2xl uppercase tracking-[0.1em] text-cream">{service.title}</h3>
                <p className="mt-5 text-sm leading-7 text-cream/66">{service.description}</p>
              </article>
            ))}
          </div>
        </SectionBand>

        <SectionBand id="process" eyebrow={copy.processEyebrow} title={copy.processTitle}>
          <div className="grid gap-px overflow-hidden border border-champagne/14 bg-champagne/14 md:grid-cols-4">
            {copy.processSteps.map((step, index) => (
              <div key={step} className="bg-warm-black p-7">
                <span className="text-xs uppercase tracking-[0.28em] text-champagne">0{index + 1}</span>
                <p className="mt-8 font-display text-2xl uppercase tracking-[0.1em] text-cream">{step}</p>
              </div>
            ))}
          </div>
        </SectionBand>

        <section className="px-5 py-24 sm:px-8 lg:px-12">
          <div className="mx-auto grid max-w-7xl items-center gap-12 lg:grid-cols-[1.1fr_0.9fr]">
            <motion.div
              className="relative aspect-[16/10] overflow-hidden"
              initial={reducedMotion ? false : { opacity: 0, y: 26 }}
              whileInView={reducedMotion ? undefined : { opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-90px" }}
              transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            >
              <motion.div className="absolute inset-0" style={{ y: featuredImageY, scale: featuredImageScale }}>
                <Image src={featuredStoryImage} alt={featuredStoryAlt} fill sizes="(min-width: 1024px) 58vw, 100vw" className="object-cover" />
              </motion.div>
              <div className="absolute inset-0 bg-gradient-to-t from-warm-black/70 to-transparent" />
            </motion.div>
            <div>
              <p className="text-xs uppercase tracking-[0.32em] text-champagne">{copy.featuredEyebrow}</p>
              <h2 className="mt-5 font-display text-5xl uppercase leading-none tracking-[0.1em] text-cream sm:text-7xl">
                {copy.featuredTitle}
              </h2>
              <p className="mt-7 text-base leading-8 text-cream/70">
                {copy.featuredText}
              </p>
            </div>
          </div>
        </section>

        <SectionBand id="about" eyebrow={copy.aboutEyebrow} title={copy.aboutTitle}>
          <div className="grid items-end gap-10 lg:grid-cols-[0.72fr_0.58fr_1fr]">
            <p className="text-lg leading-9 text-cream/72">{copy.aboutText}</p>
            <motion.article
              className="group relative aspect-[4/5] overflow-hidden border border-champagne/26 bg-emerald-deep shadow-[0_26px_90px_rgba(0,0,0,0.34)]"
              initial={reducedMotion ? false : { opacity: 0, y: 24, scale: 0.985 }}
              whileInView={reducedMotion ? undefined : { opacity: 1, y: 0, scale: 1 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.75, ease: [0.22, 1, 0.36, 1] }}
            >
              <Image
                src="/assets/about/hana-owner-portrait.png"
                alt="Hana Brabcova owner portrait"
                fill
                sizes="(min-width: 1024px) 24vw, 100vw"
                className="object-cover object-[50%_24%] transition duration-[1400ms] group-hover:scale-[1.035]"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-warm-black/92 via-warm-black/16 to-transparent" />
              <div className="absolute bottom-5 left-5 right-5">
                <p className="text-[0.58rem] uppercase tracking-[0.28em] text-champagne drop-shadow-[0_2px_12px_rgba(0,0,0,0.72)]">{t.about.ownerRole}</p>
                <h3 className="mt-2 font-display text-2xl uppercase tracking-[0.1em] text-cream drop-shadow-[0_4px_20px_rgba(0,0,0,0.82)]">Hana Brabcová</h3>
              </div>
            </motion.article>
            <div className="border border-champagne/18 bg-cream/[0.055] p-8 backdrop-blur-xl">
              <p className="font-display text-4xl uppercase leading-tight tracking-[0.1em] text-cream">
                {copy.aboutQuote}
              </p>
            </div>
          </div>
        </SectionBand>

        <section className="px-5 py-24 sm:px-8 lg:px-12">
          <div className="mx-auto max-w-5xl border-y border-champagne/40 py-16 text-center">
            <p className="text-xs uppercase tracking-[0.32em] text-champagne">{copy.bookingEyebrow}</p>
            <h2 className="mt-5 font-display text-5xl uppercase leading-none tracking-[0.1em] text-cream sm:text-7xl">
              {copy.bookingTitle}
            </h2>
            <div className="mt-9">
              <LuxuryButton href="/contact">{copy.bookSession}</LuxuryButton>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}

type HeroFeatureCardProps = {
  card: {
    title: string;
    text: string;
    icon: (typeof heroCards)[number]["icon"];
    offset: string;
  };
  index: number;
  entered: boolean;
  reducedMotion: boolean | null;
  pointerX: MotionValue<number>;
  pointerY: MotionValue<number>;
};

function HeroFeatureCard({ card, index, entered, reducedMotion, pointerX, pointerY }: HeroFeatureCardProps) {
  const Icon = card.icon;
  const parallaxX = useSpring(useTransform(pointerX, (value) => value * (4 + index * 2)), {
    stiffness: 120,
    damping: 24,
    mass: 0.45
  });
  const parallaxY = useSpring(useTransform(pointerY, (value) => value * (3 + index * 2)), {
    stiffness: 120,
    damping: 24,
    mass: 0.45
  });
  const floatDistance = index % 2 ? "5px" : "-5px";

  return (
    <motion.div
      className={cn("hero-card-parallax", card.offset)}
      style={{
        x: reducedMotion ? 0 : parallaxX,
        y: reducedMotion ? 0 : parallaxY
      }}
    >
      <div
        className={cn("hero-card-float", entered && !reducedMotion && "is-floating")}
        style={
          {
            "--hero-card-float-y": floatDistance,
            animationDuration: `${7 + index}s`,
            animationDelay: `${index * -1.2}s`
          } as CSSProperties
        }
      >
        <article className="hero-card group min-h-40 border border-champagne/24 bg-cream/[0.075] p-4 shadow-[0_28px_100px_rgba(0,0,0,0.34)] backdrop-blur-2xl transition-[background-color,border-color,transform] duration-300 hover:-translate-y-1.5 hover:scale-[1.02] hover:border-champagne/64 hover:bg-cream/[0.12] sm:min-h-48 sm:p-5 lg:min-h-52 xl:min-h-56 xl:p-6">
          <div className="flex size-10 items-center justify-center rounded-full border border-champagne/42 bg-warm-black/22 text-champagne shadow-[0_0_34px_rgba(214,190,132,0.14)] transition duration-300 group-hover:shadow-[0_0_46px_rgba(214,190,132,0.26)] sm:size-12">
            <Icon size={18} strokeWidth={1.35} fill={card.title.startsWith("Reels") ? "currentColor" : "none"} />
          </div>
          <h3 className="mt-5 whitespace-pre-line font-display text-lg uppercase leading-[0.92] tracking-[0.1em] text-cream sm:mt-7 sm:text-xl 2xl:text-2xl">
            {card.title}
          </h3>
          <p className="mt-4 whitespace-pre-line text-[0.68rem] leading-5 text-cream/62 sm:mt-5 sm:text-[0.72rem] sm:leading-6 2xl:text-[0.8rem]">
            {card.text}
          </p>
        </article>
      </div>
    </motion.div>
  );
}

function AmbientParticles({ active }: { active: boolean }) {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      {[0, 1, 2, 3, 4, 5].map((item) => (
        <motion.span
          key={item}
          className="absolute size-1 rounded-full bg-champagne/35 blur-[1px]"
          style={{ left: `${14 + item * 15}%`, top: `${18 + (item % 3) * 22}%` }}
          animate={active ? { opacity: [0.08, 0.28, 0.08], y: [0, -16, 0] } : { opacity: 0.08 }}
          transition={{ duration: 7 + item, repeat: Infinity, ease: "easeInOut" }}
        />
      ))}
    </div>
  );
}

function LuxuryButton({ href, children, variant = "solid" }: { href: string; children: React.ReactNode; variant?: "solid" | "ghost" }) {
  return (
    <Link
      href={href}
      className={cn(
        "inline-flex min-h-14 items-center justify-center gap-3 border px-7 text-xs font-semibold uppercase tracking-[0.22em] transition-all duration-300",
        variant === "solid"
          ? "border-champagne bg-champagne text-warm-black shadow-[0_18px_60px_rgba(214,190,132,0.2)] hover:bg-transparent hover:text-champagne"
          : "border-champagne/45 bg-cream/[0.05] text-cream backdrop-blur-xl hover:border-champagne hover:text-champagne"
      )}
    >
      {children}
      <ArrowRight size={15} />
    </Link>
  );
}

function SectionBand({ id, eyebrow, title, children }: { id?: string; eyebrow: string; title: string; children: React.ReactNode }) {
  return (
    <section id={id} className="relative px-5 py-24 sm:px-8 lg:px-12 lg:py-32">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_85%_12%,rgba(214,190,132,0.08),transparent_28rem)]" />
      <div className="relative mx-auto max-w-7xl">
        <div className="mb-12 max-w-4xl">
          <p className="text-xs uppercase tracking-[0.32em] text-champagne">{eyebrow}</p>
          <h2 className="mt-5 font-display text-5xl uppercase leading-none tracking-[0.1em] text-cream sm:text-7xl">
            {title}
          </h2>
        </div>
        {children}
      </div>
    </section>
  );
}

function CategoryFilter({
  activeCategory,
  onChange,
  categoryLabels
}: {
  activeCategory: (typeof portfolioCategories)[number];
  onChange: (category: (typeof portfolioCategories)[number]) => void;
  categoryLabels: Record<(typeof portfolioCategories)[number], string>;
}) {
  return (
    <div className="flex gap-2 overflow-x-auto pb-2">
      {portfolioCategories.map((category) => (
        <button
          key={category}
          type="button"
          className={cn(
            "shrink-0 border px-4 py-2 text-[0.66rem] uppercase tracking-[0.22em] transition duration-300",
            activeCategory === category
              ? "border-champagne bg-champagne text-warm-black"
              : "border-cream/14 text-cream/58 hover:border-champagne hover:text-champagne"
          )}
          onClick={() => onChange(category)}
        >
          {categoryLabels[category]}
        </button>
      ))}
    </div>
  );
}

function PortfolioCard({ item, index }: { item: PortfolioItem; index: number }) {
  const ratioClass = item.ratio === "portrait" ? "aspect-[4/5]" : item.ratio === "landscape" ? "aspect-[5/3]" : "aspect-square";

  return (
    <motion.article
      className={cn("group relative mb-5 break-inside-avoid overflow-hidden bg-emerald-deep", ratioClass)}
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-90px" }}
      transition={{ duration: 0.65, delay: Math.min(index * 0.035, 0.22), ease: [0.22, 1, 0.36, 1] }}
    >
      {item.type === "video" ? (
        <>
          <Image src={item.src} alt={item.alt} fill sizes="(min-width: 1024px) 33vw, 100vw" className="object-cover transition duration-[1400ms] group-hover:scale-105 group-hover:blur-[1px]" />
          <div className="absolute left-5 top-5 flex size-11 items-center justify-center rounded-full border border-champagne/50 bg-black/20 text-champagne backdrop-blur-xl">
            <Play size={16} fill="currentColor" />
          </div>
        </>
      ) : (
        <Image src={item.src} alt={item.alt} fill sizes="(min-width: 1024px) 33vw, 100vw" className="object-cover transition duration-[1400ms] group-hover:scale-105 group-hover:blur-[1px]" />
      )}
      <div className="absolute inset-0 bg-gradient-to-t from-warm-black/94 via-warm-black/32 to-transparent opacity-[0.82] transition duration-500 group-hover:opacity-100" />
      <div className="absolute bottom-6 left-6 right-6 translate-y-3 opacity-0 transition duration-500 group-hover:translate-y-0 group-hover:opacity-100">
        <p className="text-[0.64rem] uppercase tracking-[0.28em] text-champagne drop-shadow-[0_2px_12px_rgba(0,0,0,0.78)]">{item.category}</p>
        <h3 className="mt-2 font-display text-3xl uppercase tracking-[0.1em] text-cream drop-shadow-[0_4px_20px_rgba(0,0,0,0.82)]">{item.title}</h3>
      </div>
    </motion.article>
  );
}
