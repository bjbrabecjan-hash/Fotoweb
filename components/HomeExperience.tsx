"use client";

import Image from "next/image";
import Link from "next/link";
import {
  AnimatePresence,
  motion,
  useReducedMotion,
  useScroll,
  useTransform
} from "framer-motion";
import { ArrowRight, Play } from "lucide-react";
import { useEffect } from "react";
import { heroSlides } from "@/lib/heroSlides";
import type { PortfolioItem } from "@/lib/portfolioData";
import { useExperience } from "@/lib/experience";
import { type Locale, useLanguage } from "@/lib/i18n";
import { cn } from "@/lib/utils";

type HomeExperienceProps = {
  portfolioItems: PortfolioItem[];
};

const hero = heroSlides[0];

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
    introText: "Natural family photography for pregnancy, babies,\nchildren and shared moments that deserve\nto remain close.",
    viewPortfolio: "View Portfolio",
    bookSession: "Book a Session",
    footerLine: "Elegant visuals. Real emotions. Lasting impact.",
    portfolioEyebrow: "Portfolio",
    portfolioTitle: "Family stories in every season",
    signatureEyebrow: "Signature style",
    signatureTitle: "Soft light. Real emotion. Editorial calm.",
    servicesEyebrow: "Services",
    servicesTitle: "Created for every stage of family life",
    processEyebrow: "Process",
    processTitle: "A calm rhythm before, during and after the shoot",
    processSteps: ["Mood, place and intention", "Creative direction or simple family plan", "Calm production day", "Polished gallery and social-ready delivery"],
    featuredEyebrow: "Featured story",
    featuredTitle: "Family moments with the same editorial care.",
    featuredText: "Natural family photography can feel refined without losing warmth. The direction stays gentle, the light stays cinematic, and the final images keep real emotion intact.",
    aboutEyebrow: "About",
    aboutTitle: "Family stories with sensitivity and calm",
    aboutText:
      "Hana photographs pregnancy, babies, children and families with a gentle, natural approach. Her work is built around trust, soft light and real connection rather than perfect poses.",
    aboutQuote: "Each frame should feel considered, but still honest to the person or story in front of the camera.",
    bookingEyebrow: "Booking",
    bookingTitle: "Book a shoot that feels personal and polished.",
    services: [
      {
        title: "Maternity",
        description: "A gentle record of anticipation, closeness and the chapter before your baby arrives."
      },
      {
        title: "Newborn & Babies",
        description: "The first months photographed calmly at home or outside, with space for your natural rhythm."
      },
      {
        title: "Family Sessions",
        description: "Shared moments, laughter and closeness photographed without stiff posing or pressure."
      },
      {
        title: "Children & Siblings",
        description: "Playful portraits that keep personality, movement and the bond between children intact."
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
    introText: "Přirozené rodinné focení těhotenství, miminek,\ndětí a společných chvil, které si zaslouží\nzůstat nablízku.",
    viewPortfolio: "Zobrazit portfolio",
    bookSession: "Rezervovat focení",
    footerLine: "Elegantní vizuály. Reálné emoce. Trvalý dojem.",
    portfolioEyebrow: "Portfolio",
    portfolioTitle: "Rodinné příběhy v každé životní etapě",
    signatureEyebrow: "Signature style",
    signatureTitle: "Jemné světlo. Reálné emoce. Editorial klid.",
    servicesEyebrow: "Služby",
    servicesTitle: "Pro každou etapu vašeho rodinného příběhu",
    processEyebrow: "Proces",
    processTitle: "Klidný rytmus před focením, během něj i po něm",
    processSteps: ["Nálada, místo a záměr", "Kreativní směr nebo jednoduchý rodinný plán", "Klidný den focení", "Vyladěná galerie a výstupy pro sítě"],
    featuredEyebrow: "Vybraný příběh",
    featuredTitle: "Rodinné momenty se stejnou editorial péčí.",
    featuredText: "Rodinné focení může být přirozené a zároveň kultivované. Směr zůstává jemný, světlo cinematické a výsledné snímky drží opravdovou emoci.",
    aboutEyebrow: "O Haně",
    aboutTitle: "Rodinné příběhy s citem a klidem",
    aboutText:
      "Hana fotografuje těhotenství, miminka, děti a rodiny jemně a přirozeně. Její práce stojí na důvěře, měkkém světle a skutečné blízkosti namísto dokonalých póz.",
    aboutQuote: "Každý záběr má působit promyšleně, ale pořád pravdivě k člověku nebo příběhu před objektivem.",
    bookingEyebrow: "Rezervace",
    bookingTitle: "Rezervujte focení, které bude osobní a vyladěné.",
    services: [
      {
        title: "Těhotenské focení",
        description: "Jemná vzpomínka na očekávání, blízkost a období před příchodem miminka."
      },
      {
        title: "Newborn a miminka",
        description: "První měsíce v klidu domova nebo venku, s dostatkem prostoru pro váš přirozený rytmus."
      },
      {
        title: "Rodinné focení",
        description: "Společné chvíle, smích a blízkost bez strojených póz a nepříjemného tlaku."
      },
      {
        title: "Děti a sourozenci",
        description: "Hravé portréty, které zachovají osobnost, pohyb a vztah mezi dětmi."
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
  const { entered, enterExperience } = useExperience();
  const reducedMotion = useReducedMotion();
  const { scrollYProgress } = useScroll();
  const heroY = useTransform(scrollYProgress, [0, 0.45], reducedMotion ? [0, 0] : [0, -80]);
  const featuredImageY = useTransform(scrollYProgress, [0.42, 0.86], reducedMotion ? [0, 0] : [24, -24]);
  const featuredImageScale = useTransform(scrollYProgress, [0.42, 0.86], reducedMotion ? [1, 1] : [1.035, 1]);
  const copy = homeExperienceCopy[locale];
  const localizedSignatureTiles = signatureTiles.map((tile) => ({
    ...tile,
    title: tile.title[locale]
  }));
  useEffect(() => {
    document.body.style.overflow = entered ? "" : "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, [entered]);

  return (
    <>
      <section className="grain relative min-h-[92svh] overflow-hidden bg-emerald-deep">
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
            className="object-cover"
            style={{ objectPosition: hero.focalPoint }}
          />
        </motion.div>
        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(0,0,0,0.04)_18%,rgba(0,0,0,0.72)_100%)] lg:bg-[linear-gradient(270deg,rgba(14,14,13,0.78)_0%,rgba(16,16,15,0.5)_34%,rgba(12,12,11,0.08)_68%,transparent_100%)]" />

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
                <h1 className="font-display text-5xl uppercase leading-none tracking-[0.24em] text-white sm:text-7xl lg:text-8xl">
                  Hana Brabcová
                </h1>
                <p className="mt-6 text-sm uppercase tracking-[0.34em] text-white/76">
                  {locale === "cz" ? "Přirozené rodinné focení plné emocí." : "Natural family photography filled with emotion."}
                </p>
                <button
                  type="button"
                  onClick={enterExperience}
                  className="mt-12 inline-flex min-h-14 items-center gap-3 border border-white/70 bg-white/10 px-7 text-xs font-semibold uppercase tracking-[0.24em] text-white shadow-[0_0_42px_rgba(255,255,255,0.12)] backdrop-blur-xl transition-all duration-300 hover:scale-[1.02] hover:bg-white hover:text-ink"
                >
                  {locale === "cz" ? "Vstoupit" : "Enter Experience"}
                  <ArrowRight size={16} />
                </button>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        <motion.div
          className="relative z-10 mx-auto flex min-h-[92svh] max-w-[92rem] items-end justify-end px-5 pb-28 pt-28 sm:px-8 lg:items-center lg:px-12 lg:pb-20 lg:pt-32"
          initial={false}
          animate={entered ? "show" : "hide"}
          variants={{
            hide: { opacity: 0, y: 38, pointerEvents: "none" },
            show: { opacity: 1, y: 0, pointerEvents: "auto" }
          }}
          transition={{ duration: 0.85, delay: 0.55, ease: [0.22, 1, 0.36, 1] }}
        >
          <div className="w-full max-w-[38rem] lg:max-w-[42rem]">
              <h1 className="font-display text-[clamp(3.1rem,12vw,5rem)] uppercase leading-[0.9] tracking-[0.045em] text-white drop-shadow-[0_3px_28px_rgba(0,0,0,0.32)] sm:text-[5.4rem] lg:text-[5.8rem] xl:text-[6.4rem]">
                {copy.family.title}
              </h1>
              <p className="mt-7 max-w-xl text-base leading-8 tracking-[0.02em] text-white/82 sm:text-lg">
                {copy.family.lead}
              </p>
              <div className="mt-9 flex flex-col gap-4 sm:flex-row">
                <LuxuryButton href="#portfolio">{copy.viewPortfolio}</LuxuryButton>
                <LuxuryButton href="/contact" variant="hero">
                  {copy.bookSession}
                </LuxuryButton>
              </div>
          </div>
        </motion.div>

        <motion.div
          className="pointer-events-none absolute bottom-8 left-1/2 z-20 hidden -translate-x-1/2 text-center md:block"
          initial={false}
          animate={entered ? { opacity: 1, y: 0 } : { opacity: 0, y: 16 }}
          transition={{ duration: 0.8, delay: 1.05, ease: [0.22, 1, 0.36, 1] }}
        >
          <p className="text-[0.58rem] uppercase tracking-[0.34em] text-white/54">
            {copy.footerLine}
          </p>
          <div className="mx-auto mt-4 h-10 w-px overflow-hidden bg-white/18">
            <motion.div
              className="h-5 w-px bg-white/70"
              animate={reducedMotion ? undefined : { y: [-22, 42] }}
              transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
            />
          </div>
        </motion.div>
      </section>

      <main className="relative overflow-hidden bg-warm-black">
        <section id="services" className="border-b border-ink/12 px-5 py-14 sm:px-8 lg:px-12 lg:py-20">
          <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[0.72fr_1.28fr] lg:gap-16">
            <div>
              <p className="text-xs uppercase tracking-[0.32em] text-champagne">{copy.servicesEyebrow}</p>
              <h2 className="mt-4 max-w-lg font-display text-4xl uppercase leading-none tracking-[0.08em] text-cream sm:text-5xl">
                {copy.servicesTitle}
              </h2>
            </div>
            <div className="grid gap-x-8 gap-y-7 sm:grid-cols-2">
              {copy.services.map((service) => (
                <article key={service.title} className="border-t border-ink/16 pt-4">
                  <h3 className="font-display text-2xl uppercase tracking-[0.08em] text-cream">{service.title}</h3>
                  <p className="mt-3 text-sm leading-7 text-cream/66">{service.description}</p>
                </article>
              ))}
            </div>
          </div>
        </section>
        <SectionBand id="portfolio" eyebrow={copy.portfolioEyebrow} title={copy.portfolioTitle}>
          <div className="masonry">
            {portfolioItems.map((item, index) => (
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
                  <div className="absolute inset-0 bg-gradient-to-t from-black/88 via-black/18 to-transparent" />
                  <div className="absolute bottom-5 left-5 right-5">
                    <p className="font-display text-2xl uppercase leading-tight tracking-[0.08em] text-white drop-shadow-[0_3px_18px_rgba(0,0,0,0.7)]">{item.title}</p>
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
              <div className="absolute inset-0 bg-gradient-to-t from-black/52 via-transparent to-transparent" />
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
              <div className="absolute inset-0 bg-gradient-to-t from-black/58 via-black/10 to-transparent" />
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
              <div className="absolute inset-0 bg-gradient-to-t from-black/58 to-transparent" />
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
              <div className="absolute inset-0 bg-gradient-to-t from-black/92 via-black/16 to-transparent" />
              <div className="absolute bottom-5 left-5 right-5">
                <p className="text-[0.58rem] uppercase tracking-[0.28em] text-white/72 drop-shadow-[0_2px_12px_rgba(0,0,0,0.72)]">{t.about.ownerRole}</p>
                <h3 className="mt-2 font-display text-2xl uppercase tracking-[0.1em] text-white drop-shadow-[0_4px_20px_rgba(0,0,0,0.82)]">Hana Brabcová</h3>
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

function LuxuryButton({ href, children, variant = "solid" }: { href: string; children: React.ReactNode; variant?: "solid" | "ghost" | "hero" }) {
  return (
    <Link
      href={href}
      className={cn(
        "inline-flex min-h-14 items-center justify-center gap-3 border px-7 text-xs font-semibold uppercase tracking-[0.22em] transition-all duration-300",
        variant === "solid"
          ? "border-champagne bg-champagne text-warm-black shadow-[0_18px_60px_rgba(214,190,132,0.2)] hover:bg-transparent hover:text-champagne"
          : variant === "hero"
            ? "border-white/55 bg-white/[0.08] text-white backdrop-blur-md hover:border-white hover:bg-white hover:text-ink"
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
      <div className="absolute inset-0 bg-gradient-to-t from-black/94 via-black/32 to-transparent opacity-[0.82] transition duration-500 group-hover:opacity-100" />
      <div className="absolute bottom-6 left-6 right-6 translate-y-3 opacity-0 transition duration-500 group-hover:translate-y-0 group-hover:opacity-100">
        <p className="text-[0.64rem] uppercase tracking-[0.28em] text-white/68 drop-shadow-[0_2px_12px_rgba(0,0,0,0.78)]">{item.category}</p>
        <h3 className="mt-2 font-display text-3xl uppercase tracking-[0.1em] text-white drop-shadow-[0_4px_20px_rgba(0,0,0,0.82)]">{item.title}</h3>
      </div>
    </motion.article>
  );
}
