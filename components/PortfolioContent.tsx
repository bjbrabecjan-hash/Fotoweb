"use client";

import { GalleryGrid } from "@/components/GalleryGrid";
import { Section } from "@/components/Section";
import { useLanguage } from "@/lib/i18n";
import { portfolioCategories, type PortfolioItem } from "@/lib/portfolioData";

export function PortfolioContent({ portfolioItems }: { portfolioItems?: PortfolioItem[] }) {
  const { t } = useLanguage();

  return (
    <Section className="pt-32 lg:pt-40">
      <p className="mb-4 text-xs uppercase tracking-luxe text-gold">{t.portfolio.eyebrow}</p>
      <h1 className="font-display text-5xl uppercase leading-none tracking-wider text-ink sm:text-7xl">{t.portfolio.title}</h1>
      <p className="mb-12 max-w-2xl text-base leading-8 text-ash">{t.portfolio.text}</p>
      <GalleryGrid items={portfolioItems ?? []} categories={portfolioCategories} filterable />
    </Section>
  );
}
