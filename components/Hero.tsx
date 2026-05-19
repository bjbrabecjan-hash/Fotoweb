"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { Button } from "@/components/Button";
import { useLanguage } from "@/lib/i18n";

export function Hero() {
  const { t } = useLanguage();

  return (
    <section className="grain relative flex min-h-[92svh] items-end overflow-hidden px-5 pb-24 pt-32 sm:px-8 lg:px-12">
      <Image
        src="/assets/hero/hana-hair-cinematic.jpg"
        alt="Luxury brunette hair styling portrait"
        fill
        priority
        sizes="100vw"
        className="object-cover object-[43%_center] lg:object-center"
      />
      <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(0,0,0,0.42),rgba(0,0,0,0.08)_38%,rgba(0,0,0,0.78)_100%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_42%_42%,transparent_0,rgba(0,0,0,0.16)_34%,rgba(0,0,0,0.62)_100%)]" />
      <div className="absolute inset-y-0 right-0 w-[42vw] bg-ink/42 backdrop-blur-2xl [mask-image:linear-gradient(90deg,transparent,rgba(0,0,0,0.38)_18%,#000_52%)]" />
      <div className="absolute inset-y-0 right-0 w-[46vw] bg-[linear-gradient(90deg,transparent,rgba(11,11,11,0.32)_30%,rgba(11,11,11,0.76)_72%,#0B0B0B)]" />
      <div className="absolute inset-x-0 bottom-0 h-56 bg-gradient-to-t from-ink via-ink/54 to-transparent" />
      <motion.div
        className="relative z-10 mx-auto flex w-full max-w-7xl justify-end"
        initial={{ opacity: 0, y: 26 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
      >
        <div className="max-w-4xl text-left lg:text-right">
          <p className="mb-5 text-xs uppercase tracking-luxe text-gold">{t.hero.eyebrow}</p>
          <h1 className="font-display text-6xl uppercase leading-[0.86] tracking-wider text-ivory sm:text-8xl lg:text-[7.2rem] xl:text-[8rem]">
            Hana Brabcová
          </h1>
          <div className="mt-8 flex flex-col gap-5 sm:flex-row sm:items-center lg:justify-end">
            <Button href="/portfolio">{t.hero.cta}</Button>
            <p className="max-w-md text-sm leading-7 text-ivory/76 lg:order-first">
              {t.hero.text}
            </p>
          </div>
        </div>
      </motion.div>
    </section>
  );
}
