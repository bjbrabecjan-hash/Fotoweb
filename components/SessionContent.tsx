"use client";

import Link from "next/link";
import { Button } from "@/components/Button";
import { GalleryGrid } from "@/components/GalleryGrid";
import { useLanguage } from "@/lib/i18n";
import { findPhotoSession, photoSessions } from "@/lib/photoSessions";
import type { PortfolioItem } from "@/lib/portfolioData";

export function SessionContent({ slug, images }: { slug: string; images: PortfolioItem[] }) {
  const { locale } = useLanguage();
  const session = findPhotoSession(slug);
  if (!session) return null;
  const copy = session[locale];
  const cz = locale === "cz";
  return <main className="mx-auto max-w-7xl px-5 pb-16 pt-32 sm:px-8 lg:px-12 lg:pt-40">
    <nav aria-label={cz ? "Drobečková navigace" : "Breadcrumb"} className="mb-8 text-sm text-ash">
      <Link href="/" className="underline underline-offset-4">{cz ? "Úvod" : "Home"}</Link>
      <span aria-hidden="true" className="mx-3">/</span><span aria-current="page">{copy.name}</span>
    </nav>
    <header className="max-w-4xl">
      <p className="text-sm text-gold">Hana Brabcová</p>
      <h1 className="mt-4 font-display text-4xl leading-tight text-ink sm:text-6xl">{copy.heading}</h1>
      <p className="mt-6 max-w-3xl text-lg leading-8 text-ash">{copy.intro}</p>
      <div className="mt-8 flex flex-wrap gap-3"><Button href="/contact">{cz ? "Poptat termín" : "Ask about a date"}</Button><Button href="/#pricing" variant="ghost">{cz ? "Prohlédnout ceník" : "View pricing"}</Button></div>
    </header>
    <section className="mt-14" aria-label={cz ? "Ukázky focení" : "Session photographs"}><GalleryGrid items={images} featured /></section>
    <section className="mt-16 max-w-3xl">
      <h2 className="font-display text-3xl text-ink sm:text-4xl">{copy.detailHeading}</h2>
      {copy.paragraphs.map((paragraph) => <p key={paragraph} className="mt-6 text-base leading-8 text-ash">{paragraph}</p>)}
    </section>
    <section className="mt-14 max-w-3xl">
      <h2 className="font-display text-3xl text-ink sm:text-4xl">{cz ? "Co vás zajímá před focením" : "Before your session"}</h2>
      <div className="mt-6 divide-y divide-ink/15 border-y border-ink/15">{copy.questions.map(({ question, answer }) => <details key={question} className="py-5"><summary className="cursor-pointer text-base font-semibold text-ink focus-visible:outline-gold">{question}</summary><p className="mt-4 text-base leading-8 text-ash">{answer}</p></details>)}</div>
    </section>
    <section className="mt-14 border border-ink/10 bg-white/50 p-6 sm:p-9">
      <h2 className="font-display text-3xl text-ink">{cz ? "Domluvme vaše focení" : "Let’s plan your session"}</h2>
      <p className="mt-4 max-w-2xl text-base leading-8 text-ash">{cz ? "Napište mi svou představu a preferovaný termín. Společně probereme místo a rozsah focení." : "Tell me your ideas and preferred date. We will discuss the location and scope together."}</p>
      <Button href="/contact" className="mt-6">{cz ? "Nezávazně poptat focení" : "Send a no-obligation inquiry"}</Button>
    </section>
    <nav aria-label={cz ? "Další typy focení" : "Other sessions"} className="mt-10 flex flex-wrap gap-x-8 gap-y-4 text-base text-ink">
      {photoSessions.filter((item) => item.slug !== slug).map((item) => <Link key={item.slug} href={`/${item.slug}`} className="underline underline-offset-4">{item[locale].name}</Link>)}
      <Link href="/portfolio" className="underline underline-offset-4">{cz ? "Celé portfolio" : "Full portfolio"}</Link>
    </nav>
  </main>;
}
