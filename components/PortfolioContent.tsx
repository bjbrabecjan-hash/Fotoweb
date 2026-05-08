"use client";

import { GalleryGrid } from "@/components/GalleryGrid";
import { Section } from "@/components/Section";
import { useLanguage } from "@/lib/i18n";
import { workItems } from "@/lib/work";

export function PortfolioContent() {
  const { t } = useLanguage();

  return (
    <Section className="pt-32 lg:pt-40" eyebrow={t.portfolio.eyebrow} title={t.portfolio.title}>
      <p className="mb-12 max-w-2xl text-base leading-8 text-ash">{t.portfolio.text}</p>
      <GalleryGrid items={workItems} filterable />
    </Section>
  );
}
