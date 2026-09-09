"use client";

import Image from "next/image";
import { motion, useReducedMotion } from "framer-motion";
import { Button } from "@/components/Button";
import { Section } from "@/components/Section";
import { useLanguage } from "@/lib/i18n";

export function AboutContent() {
  const { t, locale } = useLanguage();
  const reducedMotion = useReducedMotion();

  return (
    <>
      <Section className="pt-32 lg:pt-40">
        <div className="grid items-end gap-12 lg:grid-cols-[1fr_0.82fr]">
          <div>
            <p className="mb-5 text-xs uppercase tracking-luxe text-gold">{t.about.eyebrow}</p>
            <h1 className="font-display text-5xl uppercase leading-none tracking-wider text-ink sm:text-7xl lg:text-8xl">
              Hana Brabcová
            </h1>
            <p className="mt-8 max-w-3xl text-lg leading-9 text-ash">{t.about.text}</p>
          </div>
          <motion.article
            data-protected-media
            className="group relative aspect-[4/5] overflow-hidden border border-gold/30 bg-charcoal shadow-[0_28px_100px_rgba(0,0,0,0.36)]"
            initial={reducedMotion ? false : { opacity: 0, y: 28, scale: 0.985 }}
            whileInView={reducedMotion ? undefined : { opacity: 1, y: 0, scale: 1 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          >
            <Image
              src="/assets/about/hana-owner-portrait.png"
              alt={locale === "cz" ? "Hana Brabcová, rodinná fotografka" : "Hana Brabcová, family photographer"}
              fill
              sizes="(min-width: 1024px) 38vw, 100vw"
              className="object-cover object-[50%_24%] transition duration-[1400ms] group-hover:scale-[1.035]"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-t from-ink/90 via-ink/20 to-transparent" />
            <div className="absolute inset-x-5 bottom-5 border border-white/10 bg-ink/40 p-5 shadow-[0_18px_70px_rgba(0,0,0,0.32)] backdrop-blur-xl">
              <p className="text-[0.62rem] uppercase tracking-luxe text-white/70 drop-shadow-[0_2px_12px_rgba(0,0,0,0.62)]">{t.about.ownerRole}</p>
              <h2 className="mt-2 font-display text-3xl uppercase tracking-wider text-white drop-shadow-[0_3px_18px_rgba(0,0,0,0.72)]">
                Hana Brabcová
              </h2>
            </div>
          </motion.article>
        </div>
      </Section>
      <Section className="border-y border-ink/10 bg-white/50" eyebrow={t.about.directionEyebrow} title={t.about.directionTitle}>
        <div className="grid gap-10 lg:grid-cols-[0.8fr_1.2fr]">
          <p className="text-base leading-8 text-ash">{t.about.directionText}</p>
          <div className="grid gap-px overflow-hidden border border-ink/10 bg-ink/10 sm:grid-cols-2">
            {t.about.values.map((value) => (
              <div key={value} className="bg-white p-6 text-sm uppercase tracking-luxe text-ink">
                {value}
              </div>
            ))}
          </div>
        </div>
      </Section>
      <Section>
        <div className="flex flex-col gap-8 md:flex-row md:items-center md:justify-between">
          <h2 className="max-w-3xl font-display text-4xl uppercase leading-tight tracking-wider text-ink sm:text-6xl">
            {t.about.ctaTitle}
          </h2>
          <Button href="/contact">{t.about.ctaButton}</Button>
        </div>
      </Section>
    </>
  );
}
