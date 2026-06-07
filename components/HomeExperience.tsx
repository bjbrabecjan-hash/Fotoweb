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
import { ArrowRight, Camera, Diamond, Play, UserRound } from "lucide-react";
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
      en: "Portrait\nSessions",
      cz: "Portrétní\nfocení"
    },
    text: {
      en: "Personal branding\n& professional portraits",
      cz: "Osobní brand\n& profesionální portréty"
    },
    icon: Camera,
    offset: "xl:-translate-y-5"
  },
  {
    title: {
      en: "Reels &\nSocial Content",
      cz: "Reels &\nobsah na sítě"
    },
    text: {
      en: "Short videos\n& engaging content for social media",
      cz: "Krátká videa\n& obsah pro sociální sítě"
    },
    icon: Play,
    offset: "xl:translate-y-6"
  },
  {
    title: {
      en: "Brand\nStory",
      cz: "Brand\nStory"
    },
    text: {
      en: "Visual identity\n& content for your brand",
      cz: "Vizuální identita\n& obsah pro značku"
    },
    icon: Diamond,
    offset: "xl:-translate-y-2"
  }
];

const signatureTiles = [
  {
    title: "Skin-like warmth",
    src: "/assets/signature/skin-like-warmth.png",
    alt: "Glossy serum treatment detail with warm skin-like light"
  },
  {
    title: "Editorial restraint",
    src: "/assets/signature/editorial-restraint.png",
    alt: "Minimal luxury beauty still life with gold tools and cream textures"
  },
  {
    title: "Beauty-first atmosphere",
    src: "/assets/signature/beauty-first-atmosphere.png",
    alt: "Cinematic beauty studio detail with emerald, ivory and champagne tones"
  }
];

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
  }
> = {
  en: {
    introKicker: "Visual content that",
    introTitleTop: "Makes your",
    introTitleMiddle: "Brand",
    introScript: "Unforgettable.",
    introText: "Photography, reels and premium visuals\nfor beauty brands, salons and businesses\nthat want to stand out.",
    viewPortfolio: "View Portfolio",
    bookSession: "Book a Session",
    footerLine: "Elegant visuals. Real emotions. Lasting impact.",
    portfolioEyebrow: "Portfolio",
    portfolioTitle: "Editorial stories in motion",
    signatureEyebrow: "Signature style",
    signatureTitle: "Soft luxury. Cinematic texture. Emotional light.",
    servicesEyebrow: "Services",
    servicesTitle: "Created for premium beauty brands",
    processEyebrow: "Process",
    processTitle: "A calm production rhythm",
    processSteps: ["Mood and brand atmosphere", "Creative direction and shot list", "Cinematic production day", "Polished social-ready delivery"],
    featuredEyebrow: "Featured story",
    featuredTitle: "Hair as atmosphere, not decoration.",
    featuredText: "A visual direction built around movement, warm shadows and tactile detail. The image becomes a brand mood before it becomes a post.",
    aboutEyebrow: "About",
    aboutTitle: "Beauty content with editorial sensitivity",
    aboutText:
      "Hana creates visual systems for beauty brands that need more than documentation. The work is built around feeling, texture and the quiet confidence of premium presentation.",
    aboutQuote: "Each frame should make the brand feel considered before a client reads a single word.",
    bookingEyebrow: "Booking",
    bookingTitle: "Build a beauty world your clients can feel.",
    services: [
      {
        title: "Beauty Content",
        description: "Campaign imagery and detail-led visuals for beauty launches, skincare rituals and salon identities."
      },
      {
        title: "Portrait Sessions",
        description: "Soft, editorial portraits for founders, artists and personal beauty brands."
      },
      {
        title: "Reels & Social Content",
        description: "Short-form movement, process moments and premium vertical assets shaped for social platforms."
      },
      {
        title: "Brand Story",
        description: "Visual direction that turns atmosphere, texture and tone into a coherent beauty narrative."
      }
    ]
  },
  cz: {
    introKicker: "Vizuální obsah, který",
    introTitleTop: "zviditelní",
    introTitleMiddle: "značku",
    introScript: "Nezapomenutelně.",
    introText: "Fotografie, reels a prémiové vizuály\npro beauty značky, salony a podnikání,\nkteré má působit profesionálně.",
    viewPortfolio: "Zobrazit portfolio",
    bookSession: "Rezervovat focení",
    footerLine: "Elegantní vizuály. Reálné emoce. Trvalý dojem.",
    portfolioEyebrow: "Portfolio",
    portfolioTitle: "Editorial příběhy v pohybu",
    signatureEyebrow: "Signature style",
    signatureTitle: "Jemný luxus. Cinematická textura. Emoční světlo.",
    servicesEyebrow: "Služby",
    servicesTitle: "Tvořeno pro prémiové beauty značky",
    processEyebrow: "Proces",
    processTitle: "Klidný produkční rytmus",
    processSteps: ["Mood a atmosféra značky", "Kreativní směr a shot list", "Cinematický produkční den", "Vyladěné výstupy pro sítě"],
    featuredEyebrow: "Vybraný příběh",
    featuredTitle: "Vlasy jako atmosféra, ne dekorace.",
    featuredText: "Vizuální směr postavený na pohybu, teplých stínech a hmatatelném detailu. Fotka se stává náladou značky dřív, než je z ní post.",
    aboutEyebrow: "O Haně",
    aboutTitle: "Beauty obsah s editorial citlivostí",
    aboutText:
      "Hana tvoří vizuální systémy pro beauty značky, které potřebují víc než dokumentaci. Její práce stojí na pocitu, textuře a tiché jistotě prémiové prezentace.",
    aboutQuote: "Každý záběr má působit promyšleně ještě předtím, než klient přečte první větu.",
    bookingEyebrow: "Rezervace",
    bookingTitle: "Vytvořte beauty svět, který klienti ucítí.",
    services: [
      {
        title: "Beauty Content",
        description: "Kampaňové fotografie a detailní vizuály pro beauty launch, salonní identitu a rituály péče."
      },
      {
        title: "Portrétní focení",
        description: "Jemné editorial portréty pro zakladatelky, tvůrce, specialistky a osobní beauty brandy."
      },
      {
        title: "Reels & obsah na sítě",
        description: "Krátká videa, procesní momenty a prémiové vertikální výstupy pro sociální platformy."
      },
      {
        title: "Brand Story",
        description: "Vizuální směr, který propojí atmosféru, texturu a tón do jednotného beauty příběhu."
      }
    ]
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
                  {locale === "cz" ? "Vizuální storytelling pro beauty značky." : "Visual storytelling for beauty brands."}
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
              {signatureTiles.map((item, index) => (
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
                <Image src={hero.src} alt={hero.alt} fill sizes="(min-width: 1024px) 58vw, 100vw" className="object-cover" />
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
