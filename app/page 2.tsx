"use client";

import Image from "next/image";
import { Button } from "@/components/Button";
import { GalleryGrid } from "@/components/GalleryGrid";
import { Hero } from "@/components/Hero";
import { Section } from "@/components/Section";
import { useLanguage } from "@/lib/i18n";
import { featuredWork } from "@/lib/work";

export default function Home() {
  const { t } = useLanguage();

  return (
    <>
      <Hero />
      <Section eyebrow={t.home.featuredEyebrow} title={t.home.featuredTitle}>
        <GalleryGrid items={featuredWork} featured />
      </Section>
      <Section className="border-y border-white/10 bg-white/[0.02]">
        <div className="grid items-center gap-12 lg:grid-cols-[0.95fr_1.05fr]">
          <div className="relative aspect-[4/5] overflow-hidden bg-charcoal">
            <Image
              src="/assets/portfolio/hair/brunette-curls-final-look.jpg"
              alt="Portrait of a beauty content creator"
              fill
              sizes="(min-width: 1024px) 45vw, 100vw"
              className="object-cover"
            />
          </div>
          <div className="max-w-2xl lg:pl-10">
            <p className="mb-4 text-xs uppercase tracking-luxe text-gold">{t.home.aboutEyebrow}</p>
            <h2 className="font-display text-4xl uppercase leading-none tracking-wider text-ivory sm:text-6xl">
              {t.home.aboutTitle}
            </h2>
            <p className="mt-7 text-base leading-8 text-ash">
              {t.home.aboutText}
            </p>
            <Button href="/about" variant="ghost" className="mt-9">
              {t.home.aboutCta}
            </Button>
          </div>
        </div>
      </Section>
      <Section eyebrow={t.home.servicesEyebrow} title={t.home.servicesTitle}>
        <div className="grid gap-px overflow-hidden border border-white/10 bg-white/10 md:grid-cols-3">
          {t.home.services.map((service) => (
            <article key={service.title} className="bg-ink p-7 sm:p-9">
              <h3 className="font-display text-2xl uppercase tracking-wider text-ivory">{service.title}</h3>
              <p className="mt-5 text-sm leading-7 text-ash">{service.text}</p>
            </article>
          ))}
        </div>
      </Section>
      <Section className="pt-0">
        <div className="border-y border-gold/40 py-16 text-center">
          <p className="text-xs uppercase tracking-luxe text-gold">{t.home.ctaEyebrow}</p>
          <h2 className="mx-auto mt-5 max-w-4xl font-display text-4xl uppercase leading-tight tracking-wider text-ivory sm:text-6xl">
            {t.home.ctaTitle}
          </h2>
          <Button href="/contact" className="mt-9">
            {t.home.ctaButton}
          </Button>
        </div>
      </Section>
    </>
  );
}
