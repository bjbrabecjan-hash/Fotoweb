"use client";

import Image from "next/image";
import { ArrowRight, Check } from "lucide-react";
import { Button } from "@/components/Button";
import { GalleryGrid } from "@/components/GalleryGrid";
import { Section } from "@/components/Section";
import { heroSlides } from "@/lib/heroSlides";
import type { PortfolioItem } from "@/lib/portfolioData";
import { useLanguage } from "@/lib/i18n";

type HomeExperienceProps = { portfolioItems: PortfolioItem[] };
const selectedIndexes = [0, 1, 3, 5, 12, 16, 19, 24];

const copy = {
  cz: {
    heroTitle: "Přirozené rodinné focení v Moravsko­slezském kraji",
    heroText: "Zachytím těhotenství, první měsíce s miminkem i společné chvíle vaší rodiny. V klidu, bez strojených póz a s prostorem pro děti.",
    inquiry: "Poptat termín", photos: "Prohlédnout fotografie", from: "Focení od 5 900 Kč",
    selected: "Vybrané příběhy", selectedTitle: "Skutečné chvíle, které zůstanou", wholePortfolio: "Prohlédnout celé portfolio",
    services: "Typy focení", servicesTitle: "Pro každou etapu vaší rodiny",
    serviceItems: [["Těhotenské focení", "Jemná vzpomínka na očekávání a období před příchodem miminka."], ["Newborn a miminka", "První měsíce doma nebo venku, v klidném rytmu vaší rodiny."], ["Rodinné focení", "Společné chvíle, smích a blízkost bez nucených póz."], ["Děti a sourozenci", "Hravé portréty s prostorem pro pohyb a skutečnou povahu dětí."]],
    pricing: "Ceník", pricingTitle: "Vyberte si rozsah focení", ask: "Poptat",
    plans: [
      { id: "mini", name: "Mini", price: "5 900 Kč", text: "Pro rychlé zachycení krásného období.", features: ["Focení cca 45–60 min", "20 upravených fotografií", "Online galerie", "1 krátké video na památku"], note: "Ideální pro těhotenské, děti a menší rodinné focení." },
      { id: "full", name: "Full", price: "8 500 Kč", text: "Více emocí, více prostoru, více příběhu.", features: ["Focení cca 60–90 min", "40 upravených fotografií", "Online galerie", "3 krátká videa"], note: "Ideální pro větší rodiny, více kombinací a kompletní příběh." }
    ],
    year: "Rodinný příběh – fotíme spolu celý rok", yearOptions: ["3 focení od 15 900 Kč, například těhotenství + miminko + rodina", "5 focení od 24 900 Kč, kompletní příběh prvního roku dítěte"], yearNote: "Výhodnější cena, jistota termínů, jeden styl a jeden fotograf, který už vaši rodinu zná.",
    process: "Jak focení probíhá", processTitle: "Nemusíte umět pózovat", processText: "Focení vedu přirozeně a citlivě. Povídáme si, děti si hrají a já zachycuji skutečné momenty mezi vámi.",
    steps: [["01", "Domluvíme záměr", "Vybereme typ focení, místo a vhodný termín."], ["02", "Připravíme se", "Před focením probereme vše potřebné, abyste mohli přijít v klidu."], ["03", "Budeme spolu", "Bez tlaku a strojených póz. Jen vaše rodina taková, jaká je."]],
    about: "O Haně", aboutTitle: "Fotím rodinné příběhy s citem a klidem", aboutText: "Pomohu vám cítit se před objektivem přirozeně. Dávám prostor dětem, blízkosti i drobným momentům, které dělají váš příběh vaším.", aboutCta: "Poznat Hanu",
    story: "Rodinný příběh", storyTitle: "Jedna fotografka pro vaše společné etapy", storyText: "Od těhotenství přes první měsíce miminka až po rodinné chvíle. Fotografie na sebe navazují jedním stylem a děti už vědí, koho před objektivem potkají.",
    contactTitle: "Chcete uchovat právě váš příběh?", contactText: "Napište mi nezávazně. Společně vybereme focení, které bude vaší rodině sedět."
  },
  en: {
    heroTitle: "Natural family photography in the Moravian-Silesian Region",
    heroText: "I photograph pregnancy, your baby's first months and time together as a family—calmly, without stiff poses and with room for children to be themselves.",
    inquiry: "Ask about a date", photos: "View photographs", from: "Sessions from CZK 5,900",
    selected: "Selected stories", selectedTitle: "Real moments that stay", wholePortfolio: "View the full portfolio",
    services: "Sessions", servicesTitle: "For every stage of family life",
    serviceItems: [["Maternity", "A gentle memory of anticipation and the time before your baby arrives."], ["Newborn & babies", "The first months at home or outside, following your family's calm rhythm."], ["Family sessions", "Time together, laughter and closeness without forced poses."], ["Children & siblings", "Playful portraits with room for movement and real personality."]],
    pricing: "Pricing", pricingTitle: "Choose your session", ask: "Ask about",
    plans: [
      { id: "mini", name: "Mini", price: "CZK 5,900", text: "A shorter session for a beautiful season.", features: ["Approx. 45–60 min", "20 edited photographs", "Online gallery", "1 short memory video"], note: "Ideal for maternity, children and smaller families." },
      { id: "full", name: "Full", price: "CZK 8,500", text: "More emotion, space and story.", features: ["Approx. 60–90 min", "40 edited photographs", "Online gallery", "3 short videos"], note: "Ideal for larger families and a fuller story." }
    ],
    year: "Family Story – a year together", yearOptions: ["3 sessions from CZK 15,900, e.g. pregnancy + baby + family", "5 sessions from CZK 24,900, your baby's complete first year"], yearNote: "Better value, secure dates, one style and a photographer who already knows your family.",
    process: "How it works", processTitle: "You do not need to know how to pose", processText: "I guide the session gently. We talk, children play and I photograph the real moments between you.",
    steps: [["01", "We choose the direction", "We agree on the session, place and a suitable date."], ["02", "We prepare", "We cover the details beforehand so you can arrive at ease."], ["03", "We spend time together", "No pressure or stiff poses. Just your family as it is."]],
    about: "About Hana", aboutTitle: "Family stories photographed with care and calm", aboutText: "I help you feel natural in front of the camera and leave room for children, closeness and small moments that make your story yours.", aboutCta: "Meet Hana",
    story: "Family Story", storyTitle: "One photographer for the stages you share", storyText: "From pregnancy through your baby's first months to family time. The photographs connect through one visual style, and the children know who they will meet behind the camera.",
    contactTitle: "Would you like to keep your story close?", contactText: "Send a no-obligation inquiry. Together we will choose the session that suits your family."
  }
};

export function HomeExperience({ portfolioItems }: HomeExperienceProps) {
  const { locale } = useLanguage();
  const t = copy[locale];
  const selected = selectedIndexes.map((index) => portfolioItems[index]).filter(Boolean);

  return <>
    <section className="relative flex min-h-[92svh] items-end overflow-hidden bg-ink pt-20 text-white lg:items-center">
      <Image src={heroSlides[0].src} alt={heroSlides[0].alt} fill priority sizes="100vw" className="object-cover" style={{ objectPosition: heroSlides[0].focalPoint }} />
      <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(20,20,18,.2)_0%,rgba(20,20,18,.78)_78%,rgba(20,20,18,.9)_100%)] lg:bg-[linear-gradient(90deg,rgba(20,20,18,.2)_0%,rgba(20,20,18,.25)_42%,rgba(20,20,18,.88)_75%,rgba(20,20,18,.95)_100%)]" />
      <div className="relative mx-auto w-full max-w-7xl px-5 pb-16 sm:px-8 lg:flex lg:justify-end lg:px-12 lg:pb-0"><div className="max-w-2xl rounded-sm bg-black/65 p-6 shadow-2xl backdrop-blur-sm sm:p-9">
        <p className="text-xs font-semibold uppercase tracking-[.28em] text-white">Hana Brabcová</p><h1 className="mt-5 font-display text-5xl leading-[.94] tracking-[.02em] text-white sm:text-6xl lg:text-7xl">{t.heroTitle}</h1><p className="mt-6 max-w-xl text-base leading-8 text-white sm:text-lg">{t.heroText}</p>
        <div className="mt-8 flex flex-col gap-3 sm:flex-row"><Button href="/contact">{t.inquiry}</Button><Button href="#portfolio" variant="ghost" className="border-white/70 bg-black/25 text-white hover:border-white hover:text-white">{t.photos}</Button></div><p className="mt-5 text-sm font-semibold text-white">{t.from}</p>
      </div></div>
    </section>

    <Section eyebrow={t.selected} title={t.selectedTitle}><div id="portfolio" className="scroll-mt-28"><GalleryGrid items={selected} featured /></div><Button href="/portfolio" variant="ghost" className="mt-8">{t.wholePortfolio}<ArrowRight className="ml-2" size={16}/></Button></Section>
    <Section className="border-y border-ink/10 bg-white/50" eyebrow={t.services} title={t.servicesTitle}><div id="services" className="grid scroll-mt-28 gap-px overflow-hidden border border-ink/10 bg-ink/10 md:grid-cols-2 lg:grid-cols-4">{t.serviceItems.map(([title,text]) => <article key={title} className="bg-white p-7"><h3 className="font-display text-2xl text-ink">{title}</h3><p className="mt-4 text-sm leading-7 text-ash">{text}</p></article>)}</div></Section>
    <Section eyebrow={t.pricing} title={t.pricingTitle}><div id="pricing" className="grid scroll-mt-28 gap-5 lg:grid-cols-2">{t.plans.map((plan) => <article key={plan.id} className="flex flex-col border border-ink/10 bg-white p-7 shadow-[0_20px_60px_rgba(38,37,34,.07)] sm:p-9"><p className="text-xs font-semibold uppercase tracking-luxe text-gold">{plan.name}</p><p className="mt-3 font-display text-5xl text-ink">{plan.price}</p><p className="mt-4 text-ash">{plan.text}</p><ul className="my-7 space-y-3">{plan.features.map((feature) => <li key={feature} className="flex gap-3 text-sm text-ink"><Check className="mt-0.5 shrink-0 text-gold" size={17}/>{feature}</li>)}</ul><p className="mb-7 text-sm leading-6 text-ash">{plan.note}</p><Button href={`/contact?package=${plan.id}`} className="mt-auto">{t.ask} {plan.name}</Button></article>)}
      <article className="border border-gold/30 bg-[#eef0eb] p-7 lg:col-span-2 sm:p-9"><p className="text-xs font-semibold uppercase tracking-luxe text-gold">{t.story}</p><h3 className="mt-3 font-display text-4xl text-ink">{t.year}</h3><ul className="mt-6 grid gap-3 md:grid-cols-2">{t.yearOptions.map((item) => <li key={item} className="flex gap-3 text-sm leading-6 text-ink"><Check className="mt-0.5 shrink-0 text-gold" size={17}/>{item}</li>)}</ul><p className="mt-5 text-sm text-ash">{t.yearNote}</p><div className="mt-7 flex flex-wrap gap-3"><Button href="/contact?package=story-3" variant="ghost">{t.ask} 3×</Button><Button href="/contact?package=story-5" variant="ghost">{t.ask} 5×</Button></div></article>
    </div></Section>
    <Section className="border-y border-ink/10 bg-white/50" eyebrow={t.process} title={t.processTitle}><p className="max-w-2xl text-base leading-8 text-ash">{t.processText}</p><div id="process" className="mt-10 grid scroll-mt-28 gap-8 md:grid-cols-3">{t.steps.map(([number,title,text]) => <article key={number}><p className="font-display text-4xl text-gold">{number}</p><h3 className="mt-3 text-sm font-semibold uppercase tracking-luxe text-ink">{title}</h3><p className="mt-3 text-sm leading-7 text-ash">{text}</p></article>)}</div></Section>
    <Section><div id="about" className="grid scroll-mt-28 items-center gap-10 lg:grid-cols-[.75fr_1fr]"><div className="relative aspect-[4/5] overflow-hidden bg-charcoal"><Image src="/assets/about/hana-owner-portrait.png" alt="Hana Brabcová, rodinná fotografka" fill sizes="(min-width:1024px) 38vw, 100vw" className="object-cover object-[50%_24%]"/></div><div><p className="text-xs uppercase tracking-luxe text-gold">{t.about}</p><h2 className="mt-4 font-display text-4xl leading-none text-ink sm:text-6xl">{t.aboutTitle}</h2><p className="mt-6 text-base leading-8 text-ash">{t.aboutText}</p><Button href="/about" variant="ghost" className="mt-8">{t.aboutCta}</Button></div></div></Section>
    <Section className="border-y border-ink/10 bg-[#eef0eb]" eyebrow={t.story} title={t.storyTitle}><p className="max-w-3xl text-base leading-8 text-ash">{t.storyText}</p></Section>
    <Section><div className="flex flex-col gap-7 md:flex-row md:items-end md:justify-between"><div><h2 className="font-display text-4xl text-ink sm:text-6xl">{t.contactTitle}</h2><p className="mt-4 max-w-2xl text-ash">{t.contactText}</p></div><Button href="/contact" className="shrink-0">{t.inquiry}</Button></div></Section>
  </>;
}
