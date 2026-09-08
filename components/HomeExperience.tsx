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
// Keep the homepage edit visually consistent: every selected frame is portrait,
// so a landscape image can no longer leave an empty half-row beside it.
const selectedIndexes = [0, 3, 5, 6, 7, 18, 21, 27, 30];

const copy = {
  cz: {
    heroTitle: "Přirozené rodinné focení v Moravsko­slezském kraji",
    heroText: "Zachytím těhotenství, první měsíce s miminkem i společné chvíle vaší rodiny. V klidu, bez strojených póz a s prostorem pro děti.",
    inquiry: "Poptat termín", photos: "Prohlédnout fotografie", from: "Rodinné focení od 2 600 Kč",
    selected: "Vybrané příběhy", selectedTitle: "Skutečné chvíle, které zůstanou", wholePortfolio: "Prohlédnout celé portfolio",
    studioEyebrow: "Ateliér", studioTitle: "Čisté světlo, klid a prostor být sami sebou", studioText: "Ateliérové focení je ideální pro nadčasové dětské a sourozenecké portréty. Bez rušivého pozadí vyniknou výrazy, blízkost i drobné detaily.", studioCta: "Prohlédnout Ateliér",
    services: "Typy focení", servicesTitle: "Pro každou etapu vaší rodiny",
    serviceItems: [["Těhotenské focení", "Jemná vzpomínka na očekávání a období před příchodem miminka."], ["Newborn a miminka", "První měsíce doma nebo venku, v klidném rytmu vaší rodiny."], ["Rodinné focení", "Společné chvíle, smích a blízkost bez nucených póz."], ["Děti a sourozenci", "Hravé portréty s prostorem pro pohyb a skutečnou povahu dětí."]],
    pricing: "Ceník", pricingTitle: "Vyberte si focení, které vám sedí", familyPricing: "Rodinné focení", weddingPricing: "Svatební balíčky", ask: "Poptat",
    familyPlans: [
      { id: "family-mini", name: "Mini balíček", price: "2 600 Kč", text: "Přirozené rodinné focení v ateliéru nebo venku.", features: ["10 profesionálně upravených fotografií", "1 lokalita – ateliér nebo exteriér", "Focení cca 60 minut"], note: "Ideální pro menší rodiny." },
      { id: "family-standard", name: "Standardní balíček", price: "3 800 Kč", text: "Více času, míst i společných kombinací.", features: ["20+ upravených fotografií – všechny povedené z focení", "2 lokality, například město + příroda", "Focení cca 90–120 minut"], note: "Skvělé pro větší rodiny a příběhy, které si zaslouží víc." }
    ],
    weddingPlans: [
      { id: "wedding-ceremony", name: "Obřad", price: "5 900 Kč", text: "Až 3 hodiny", features: ["Obřad, gratulace a skupinové fotografie", "Uvolněné novomanželské portréty", "Minimálně 100 upravených fotografií", "Soukromá online galerie"], note: "To nejdůležitější v kratším čase." },
      { id: "wedding-half-day", name: "Půl dne", price: "10 900 Kč", text: "6 hodin", features: ["Přípravy, obřad a začátek hostiny", "Skupinové i novomanželské fotografie", "Minimálně 250 upravených fotografií", "Soukromá online galerie"], note: "Kompletní začátek vašeho dne." },
      { id: "wedding-full-day", name: "Celý den", price: "19 900 Kč", text: "12 hodin", features: ["Reportáž až po večerní zábavu", "Minimálně 550 upravených fotografií", "30 vytištěných fotografií 10 × 15 cm", "Soukromá online galerie"], note: "Váš celý příběh od rána až do noci." }
    ],
    weddingNote: "V ceně je předsvatební konzultace, pomoc s harmonogramem, doprava do 30 km od Suchdolu nad Odrou a první fotografie do 7 dnů. Každá další započatá hodina stojí 1 800 Kč. Termín je závazně rezervován po uhrazení zálohy.",
    christmasTitle: "Vánoční focení 2026",
    christmasText: "Termíny jsou již v předprodeji. Rezervujte si vánoční rodinné focení včas; podrobnosti a dostupné časy vám pošlu obratem.",
    christmasCta: "Poptat Vánoce 2026",
    process: "Jak focení probíhá", processTitle: "Nemusíte umět pózovat", processText: "Focení vedu přirozeně a citlivě. Povídáme si, děti si hrají a já zachycuji skutečné momenty mezi vámi.",
    steps: [["01", "Domluvíme záměr", "Vybereme typ focení, místo a vhodný termín."], ["02", "Připravíme se", "Před focením probereme vše potřebné, abyste mohli přijít v klidu."], ["03", "Budeme spolu", "Bez tlaku a strojených póz. Jen vaše rodina taková, jaká je."]],
    about: "O Haně", aboutTitle: "Fotím rodinné příběhy s citem a klidem", aboutText: "Pomohu vám cítit se před objektivem přirozeně. Dávám prostor dětem, blízkosti i drobným momentům, které dělají váš příběh vaším.", aboutCta: "Poznat Hanu",
    story: "Rodinný příběh", storyTitle: "Jedna fotografka pro vaše společné etapy", storyText: "Od těhotenství přes první měsíce miminka až po rodinné chvíle. Fotografie na sebe navazují jedním stylem a děti už vědí, koho před objektivem potkají.",
    contactTitle: "Chcete uchovat právě váš příběh?", contactText: "Napište mi nezávazně. Společně vybereme focení, které bude vaší rodině sedět."
  },
  en: {
    heroTitle: "Natural family photography in the Moravian-Silesian Region",
    heroText: "I photograph pregnancy, your baby's first months and time together as a family—calmly, without stiff poses and with room for children to be themselves.",
    inquiry: "Ask about a date", photos: "View photographs", from: "Family sessions from CZK 2,600",
    selected: "Selected stories", selectedTitle: "Real moments that stay", wholePortfolio: "View the full portfolio",
    studioEyebrow: "Studio", studioTitle: "Clean light, calm and room to be yourselves", studioText: "Studio sessions are ideal for timeless portraits of children and siblings. With no distracting background, expressions, closeness and small details take centre stage.", studioCta: "View studio work",
    services: "Sessions", servicesTitle: "For every stage of family life",
    serviceItems: [["Maternity", "A gentle memory of anticipation and the time before your baby arrives."], ["Newborn & babies", "The first months at home or outside, following your family's calm rhythm."], ["Family sessions", "Time together, laughter and closeness without forced poses."], ["Children & siblings", "Playful portraits with room for movement and real personality."]],
    pricing: "Pricing", pricingTitle: "Choose the session that suits you", familyPricing: "Family sessions", weddingPricing: "Wedding packages", ask: "Ask about",
    familyPlans: [
      { id: "family-mini", name: "Mini package", price: "CZK 2,600", text: "A natural family session in the studio or outdoors.", features: ["10 professionally edited photographs", "1 location – studio or outdoors", "Approx. 60 minutes"], note: "Ideal for smaller families." },
      { id: "family-standard", name: "Standard package", price: "CZK 3,800", text: "More time, locations and family combinations.", features: ["20+ edited photographs – all successful images", "2 locations, such as town + nature", "Approx. 90–120 minutes"], note: "Great for larger families and a more complete story." }
    ],
    weddingPlans: [
      { id: "wedding-ceremony", name: "Ceremony", price: "CZK 5,900", text: "Up to 3 hours", features: ["Ceremony, congratulations and group photographs", "Relaxed newlywed portraits", "At least 100 edited photographs", "Private online gallery"], note: "The most important moments in a shorter time." },
      { id: "wedding-half-day", name: "Half day", price: "CZK 10,900", text: "6 hours", features: ["Preparations, ceremony and start of the reception", "Group and newlywed photographs", "At least 250 edited photographs", "Private online gallery"], note: "The complete beginning of your day." },
      { id: "wedding-full-day", name: "Full day", price: "CZK 19,900", text: "12 hours", features: ["Coverage through the evening celebrations", "At least 550 edited photographs", "30 printed photographs, 10 × 15 cm", "Private online gallery"], note: "Your whole story, from morning until night." }
    ],
    weddingNote: "The price includes a pre-wedding consultation, timeline assistance, travel within 30 km of Suchdol nad Odrou and first photographs within 7 days. Each additional started hour is CZK 1,800. A date is confirmed after the booking deposit is paid.",
    christmasTitle: "Christmas sessions 2026",
    christmasText: "Dates are already on presale. Reserve your Christmas family session early; I will send current times and details in reply.",
    christmasCta: "Ask about Christmas 2026",
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
  const studioItems = portfolioItems.filter((item) => item.category === "Studio");
  const studioLandscape = studioItems.find((item) => item.ratio === "landscape") ?? studioItems[0];
  const studioPortraits = studioItems.filter((item) => item.id !== studioLandscape?.id).slice(0, 4);

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
    {studioLandscape && <Section className="border-y border-ink/10 bg-[#eef0eb]">
      <div id="studio" className="scroll-mt-28">
        <div className="mb-9 flex flex-col gap-6 md:flex-row md:items-end md:justify-between"><div><p className="text-xs uppercase tracking-luxe text-gold">{t.studioEyebrow}</p><h2 className="mt-4 max-w-3xl font-display text-4xl leading-none text-ink sm:text-6xl">{t.studioTitle}</h2><p className="mt-5 max-w-2xl text-base leading-8 text-ash">{t.studioText}</p></div><Button href="/portfolio" variant="ghost" className="shrink-0">{t.studioCta}<ArrowRight className="ml-2" size={16}/></Button></div>
        <div className="grid gap-4 lg:grid-cols-[1.35fr_1fr]">
          <StudioImage item={studioLandscape} className="aspect-[5/4] lg:h-full lg:min-h-[38rem]" />
          <div className="grid grid-cols-2 gap-4">{studioPortraits.map((item) => <StudioImage key={item.id} item={item} className="aspect-[4/5]" />)}</div>
        </div>
      </div>
    </Section>}
    <Section className="border-y border-ink/10 bg-white/50" eyebrow={t.services} title={t.servicesTitle}><div id="services" className="grid scroll-mt-28 gap-px overflow-hidden border border-ink/10 bg-ink/10 md:grid-cols-2 lg:grid-cols-4">{t.serviceItems.map(([title,text]) => <article key={title} className="bg-white p-7"><h3 className="font-display text-2xl text-ink">{title}</h3><p className="mt-4 text-sm leading-7 text-ash">{text}</p></article>)}</div></Section>
    <Section eyebrow={t.pricing} title={t.pricingTitle}><div id="pricing" className="scroll-mt-28">
      <h3 className="font-display text-3xl text-ink sm:text-4xl">{t.familyPricing}</h3>
      <div className="mt-6 grid gap-5 lg:grid-cols-2">{t.familyPlans.map((plan) => <PricingCard key={plan.id} plan={plan} ask={t.ask}/>)}</div>
      <h3 className="mt-14 font-display text-3xl text-ink sm:text-4xl">{t.weddingPricing}</h3>
      <div className="mt-6 grid gap-5 lg:grid-cols-3">{t.weddingPlans.map((plan) => <PricingCard key={plan.id} plan={plan} ask={t.ask}/>)}</div>
      <p className="mt-6 border-l-2 border-gold pl-5 text-sm leading-7 text-ash">{t.weddingNote}</p>
      <article className="mt-10 border border-gold/30 bg-[#eef0eb] p-7 sm:p-9"><p className="text-xs font-semibold uppercase tracking-luxe text-gold">2026</p><div className="mt-3 flex flex-col gap-6 md:flex-row md:items-end md:justify-between"><div><h3 className="font-display text-4xl text-ink">{t.christmasTitle}</h3><p className="mt-4 max-w-3xl text-sm leading-7 text-ash">{t.christmasText}</p></div><Button href="/contact?package=christmas-2026" className="shrink-0">{t.christmasCta}</Button></div></article>
    </div></Section>
    <Section className="border-y border-ink/10 bg-white/50" eyebrow={t.process} title={t.processTitle}><p className="max-w-2xl text-base leading-8 text-ash">{t.processText}</p><div id="process" className="mt-10 grid scroll-mt-28 gap-8 md:grid-cols-3">{t.steps.map(([number,title,text]) => <article key={number}><p className="font-display text-4xl text-gold">{number}</p><h3 className="mt-3 text-sm font-semibold uppercase tracking-luxe text-ink">{title}</h3><p className="mt-3 text-sm leading-7 text-ash">{text}</p></article>)}</div></Section>
    <Section><div id="about" className="grid scroll-mt-28 items-center gap-10 lg:grid-cols-[.75fr_1fr]"><div className="relative aspect-[4/5] overflow-hidden bg-charcoal"><Image src="/assets/about/hana-owner-portrait.png" alt="Hana Brabcová, rodinná fotografka" fill sizes="(min-width:1024px) 38vw, 100vw" className="object-cover object-[50%_24%]"/></div><div><p className="text-xs uppercase tracking-luxe text-gold">{t.about}</p><h2 className="mt-4 font-display text-4xl leading-none text-ink sm:text-6xl">{t.aboutTitle}</h2><p className="mt-6 text-base leading-8 text-ash">{t.aboutText}</p><Button href="/about" variant="ghost" className="mt-8">{t.aboutCta}</Button></div></div></Section>
    <Section className="border-y border-ink/10 bg-[#eef0eb]" eyebrow={t.story} title={t.storyTitle}><p className="max-w-3xl text-base leading-8 text-ash">{t.storyText}</p></Section>
    <Section><div className="flex flex-col gap-7 md:flex-row md:items-end md:justify-between"><div><h2 className="font-display text-4xl text-ink sm:text-6xl">{t.contactTitle}</h2><p className="mt-4 max-w-2xl text-ash">{t.contactText}</p></div><Button href="/contact" className="shrink-0">{t.inquiry}</Button></div></Section>
  </>;
}

type PricingPlan = { id: string; name: string; price: string; text: string; features: string[]; note: string };

function PricingCard({ plan, ask }: { plan: PricingPlan; ask: string }) {
  return <article className="flex h-full flex-col border border-ink/10 bg-white p-7 shadow-[0_20px_60px_rgba(38,37,34,.07)] sm:p-9"><p className="text-xs font-semibold uppercase tracking-luxe text-gold">{plan.name}</p><p className="mt-3 font-display text-5xl text-ink">{plan.price}</p><p className="mt-4 text-ash">{plan.text}</p><ul className="my-7 space-y-3">{plan.features.map((feature) => <li key={feature} className="flex gap-3 text-sm text-ink"><Check className="mt-0.5 shrink-0 text-gold" size={17}/>{feature}</li>)}</ul><p className="mb-7 text-sm leading-6 text-ash">{plan.note}</p><Button href={`/contact?package=${plan.id}`} className="mt-auto">{ask} {plan.name}</Button></article>;
}

function StudioImage({ item, className }: { item: PortfolioItem; className: string }) {
  return <figure className={`group relative overflow-hidden bg-charcoal ${className}`}><Image src={item.src} alt={item.alt} fill sizes="(min-width:1024px) 50vw, 100vw" className="object-cover transition-transform duration-700 group-hover:scale-[1.025]"/><span className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"/><figcaption className="absolute inset-x-5 bottom-5 font-display text-xl text-white sm:text-2xl">{item.title}</figcaption></figure>;
}
