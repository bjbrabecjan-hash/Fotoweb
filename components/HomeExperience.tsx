"use client";

import Image from "next/image";
import Link from "next/link";
import { AnimatePresence, motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import { ArrowRight, Play } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { heroSlides } from "@/lib/heroSlides";
import { portfolioCategories, type PortfolioItem } from "@/lib/portfolioData";
import { services } from "@/lib/services";
import { useExperience } from "@/lib/experience";
import { cn } from "@/lib/utils";

type HomeExperienceProps = {
  portfolioItems: PortfolioItem[];
};

const hero = heroSlides[0];

const processSteps = [
  "Mood and brand atmosphere",
  "Creative direction and shot list",
  "Cinematic production day",
  "Polished social-ready delivery"
];

const serviceCards = ["Beauty Content", "Portrait Sessions", "Reels & Social Content", "Brand Story"];

const categoryLabels: Record<(typeof portfolioCategories)[number], string> = {
  All: "All",
  Beauty: "Beauty",
  Portraits: "Portraits",
  Hair: "Hair",
  Branding: "Branding",
  Editorial: "Editorial",
  Reels: "Reels"
};

export function HomeExperience({ portfolioItems }: HomeExperienceProps) {
  const [activeCategory, setActiveCategory] = useState<(typeof portfolioCategories)[number]>("All");
  const { entered, enterExperience } = useExperience();
  const reducedMotion = useReducedMotion();
  const { scrollYProgress } = useScroll();
  const heroY = useTransform(scrollYProgress, [0, 0.45], reducedMotion ? [0, 0] : [0, -80]);

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

  return (
    <>
      <section className="grain relative min-h-screen overflow-hidden bg-emerald-deep">
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
            className="object-cover object-[43%_center]"
          />
        </motion.div>
        <div className="absolute inset-0 bg-[linear-gradient(120deg,rgba(5,20,16,0.78),rgba(7,36,28,0.28)_44%,rgba(10,10,8,0.9))]" />
        <div className="absolute inset-y-0 right-0 w-[42vw] bg-warm-black/44 backdrop-blur-2xl [mask-image:linear-gradient(90deg,transparent,rgba(0,0,0,0.36)_18%,#000_58%)]" />
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
                  Visual storytelling for beauty brands.
                </p>
                <button
                  type="button"
                  onClick={enterExperience}
                  className="mt-12 inline-flex min-h-14 items-center gap-3 border border-champagne/70 bg-cream/8 px-7 text-xs font-semibold uppercase tracking-[0.24em] text-cream shadow-[0_0_42px_rgba(214,190,132,0.16)] backdrop-blur-xl transition-all duration-300 hover:scale-[1.02] hover:bg-champagne hover:text-warm-black hover:shadow-[0_0_56px_rgba(214,190,132,0.28)]"
                >
                  Enter Experience
                  <ArrowRight size={16} />
                </button>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        <motion.div
          className="absolute left-5 top-5 z-20 font-display text-sm uppercase tracking-[0.3em] text-cream sm:left-8 sm:top-8"
          initial={false}
          animate={entered ? { opacity: 1, scale: 1, x: 0, y: 0 } : { opacity: 0, scale: 1.28, x: "42vw", y: "42vh" }}
          transition={{ duration: 1.15, ease: [0.22, 1, 0.36, 1] }}
        >
          Hana Brabcová
        </motion.div>

        <motion.div
          className="relative z-10 mx-auto flex min-h-screen max-w-7xl items-end px-5 pb-36 pt-32 sm:px-8 lg:px-12"
          initial={false}
          animate={entered ? "show" : "hide"}
          variants={{
            hide: { opacity: 0, y: 38, pointerEvents: "none" },
            show: { opacity: 1, y: 0, pointerEvents: "auto" }
          }}
          transition={{ duration: 0.85, delay: 0.55, ease: [0.22, 1, 0.36, 1] }}
        >
          <div className="grid w-full items-end gap-12 lg:grid-cols-[1.02fr_0.98fr]">
            <div>
              <p className="mb-5 text-xs uppercase tracking-[0.34em] text-champagne">Cinematic beauty direction</p>
              <h2 className="max-w-5xl font-display text-5xl uppercase leading-[0.92] tracking-[0.08em] text-cream sm:text-7xl lg:text-8xl">
                Visual content that makes your brand unforgettable.
              </h2>
              <p className="mt-7 max-w-xl text-base leading-8 text-cream/76">
                Photography, reels and premium visuals for beauty brands, salons and businesses.
              </p>
              <div className="mt-9 flex flex-col gap-4 sm:flex-row">
                <LuxuryButton href="#portfolio">View Portfolio</LuxuryButton>
                <LuxuryButton href="/contact" variant="ghost">
                  Book a Session
                </LuxuryButton>
              </div>
            </div>
            <div className="grid gap-4 sm:grid-cols-2 lg:pb-10">
              {serviceCards.map((card, index) => (
                <motion.div
                  key={card}
                  className="group border border-champagne/24 bg-cream/[0.075] p-6 shadow-[0_22px_80px_rgba(0,0,0,0.26)] backdrop-blur-2xl transition duration-300 hover:-translate-y-1 hover:border-champagne/58 hover:bg-cream/[0.11]"
                  animate={entered && !reducedMotion ? { y: [0, index % 2 ? 8 : -8, 0] } : undefined}
                  transition={{ duration: 6 + index, repeat: Infinity, ease: "easeInOut" }}
                >
                  <span className="text-[0.64rem] uppercase tracking-[0.28em] text-champagne">0{index + 1}</span>
                  <h3 className="mt-5 font-display text-2xl uppercase tracking-[0.1em] text-cream">{card}</h3>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>
      </section>

      <main className="relative overflow-hidden bg-warm-black">
        <SectionBand id="portfolio" eyebrow="Portfolio" title="Editorial stories in motion">
          <CategoryFilter activeCategory={activeCategory} onChange={setActiveCategory} />
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
              <p className="text-xs uppercase tracking-[0.32em] text-champagne">Signature style</p>
              <h2 className="mt-5 font-display text-5xl uppercase leading-none tracking-[0.1em] text-cream sm:text-7xl">
                Soft luxury. Cinematic texture. Emotional light.
              </h2>
            </div>
            <div className="grid gap-4 sm:grid-cols-3">
              {["Skin-like warmth", "Editorial restraint", "Beauty-first atmosphere"].map((item) => (
                <div key={item} className="border border-cream/10 bg-cream/[0.055] p-6 backdrop-blur-xl">
                  <p className="font-display text-2xl uppercase tracking-[0.08em] text-cream">{item}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <SectionBand eyebrow="Services" title="Created for premium beauty brands">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {services.map((service) => (
              <article key={service.title} className="border border-champagne/18 bg-cream/[0.055] p-7 backdrop-blur-xl">
                <h3 className="font-display text-2xl uppercase tracking-[0.1em] text-cream">{service.title}</h3>
                <p className="mt-5 text-sm leading-7 text-cream/66">{service.description}</p>
              </article>
            ))}
          </div>
        </SectionBand>

        <SectionBand eyebrow="Process" title="A calm production rhythm">
          <div className="grid gap-px overflow-hidden border border-champagne/14 bg-champagne/14 md:grid-cols-4">
            {processSteps.map((step, index) => (
              <div key={step} className="bg-warm-black p-7">
                <span className="text-xs uppercase tracking-[0.28em] text-champagne">0{index + 1}</span>
                <p className="mt-8 font-display text-2xl uppercase tracking-[0.1em] text-cream">{step}</p>
              </div>
            ))}
          </div>
        </SectionBand>

        <section className="px-5 py-24 sm:px-8 lg:px-12">
          <div className="mx-auto grid max-w-7xl items-center gap-12 lg:grid-cols-[1.1fr_0.9fr]">
            <div className="relative aspect-[16/10] overflow-hidden">
              <Image src={hero.src} alt={hero.alt} fill sizes="(min-width: 1024px) 58vw, 100vw" className="object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-warm-black/70 to-transparent" />
            </div>
            <div>
              <p className="text-xs uppercase tracking-[0.32em] text-champagne">Featured story</p>
              <h2 className="mt-5 font-display text-5xl uppercase leading-none tracking-[0.1em] text-cream sm:text-7xl">
                Hair as atmosphere, not decoration.
              </h2>
              <p className="mt-7 text-base leading-8 text-cream/70">
                A visual direction built around movement, warm shadows and tactile detail. The image becomes a brand mood before it becomes a post.
              </p>
            </div>
          </div>
        </section>

        <SectionBand eyebrow="About" title="Beauty content with editorial sensitivity">
          <div className="grid gap-10 lg:grid-cols-[0.72fr_1.28fr]">
            <p className="text-lg leading-9 text-cream/72">
              Hana creates visual systems for beauty brands that need more than documentation. The work is built around feeling, texture and the quiet confidence of premium presentation.
            </p>
            <div className="border border-champagne/18 bg-cream/[0.055] p-8 backdrop-blur-xl">
              <p className="font-display text-4xl uppercase leading-tight tracking-[0.1em] text-cream">
                Each frame should make the brand feel considered before a client reads a single word.
              </p>
            </div>
          </div>
        </SectionBand>

        <section className="px-5 py-24 sm:px-8 lg:px-12">
          <div className="mx-auto max-w-5xl border-y border-champagne/40 py-16 text-center">
            <p className="text-xs uppercase tracking-[0.32em] text-champagne">Booking</p>
            <h2 className="mt-5 font-display text-5xl uppercase leading-none tracking-[0.1em] text-cream sm:text-7xl">
              Build a beauty world your clients can feel.
            </h2>
            <div className="mt-9">
              <LuxuryButton href="/contact">Book a Session</LuxuryButton>
            </div>
          </div>
        </section>
      </main>
    </>
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
  onChange
}: {
  activeCategory: (typeof portfolioCategories)[number];
  onChange: (category: (typeof portfolioCategories)[number]) => void;
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
      <div className="absolute inset-0 bg-gradient-to-t from-warm-black/88 via-warm-black/12 to-transparent opacity-70 transition duration-500 group-hover:opacity-100" />
      <div className="absolute bottom-6 left-6 right-6 translate-y-3 opacity-0 transition duration-500 group-hover:translate-y-0 group-hover:opacity-100">
        <p className="text-[0.64rem] uppercase tracking-[0.28em] text-champagne">{item.category}</p>
        <h3 className="mt-2 font-display text-3xl uppercase tracking-[0.1em] text-cream">{item.title}</h3>
      </div>
    </motion.article>
  );
}
