"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { Button } from "@/components/Button";

export function Hero() {
  return (
    <section className="grain relative flex min-h-[92svh] items-end overflow-hidden px-5 pb-16 pt-32 sm:px-8 lg:px-12">
      <Image
        src="https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=2200&q=88"
        alt="Cinematic luxury hair portrait"
        fill
        priority
        sizes="100vw"
        className="object-cover object-[62%_center]"
      />
      <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(0,0,0,0.74),rgba(0,0,0,0.16),rgba(0,0,0,0.48))]" />
      <div className="absolute inset-x-0 bottom-0 h-44 bg-gradient-to-t from-ink to-transparent" />
      <motion.div
        className="relative z-10 mx-auto w-full max-w-7xl"
        initial={{ opacity: 0, y: 26 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
      >
        <p className="mb-5 text-xs uppercase tracking-luxe text-gold">Brand content for beauty brands</p>
        <h1 className="max-w-5xl font-display text-6xl uppercase leading-[0.86] tracking-wider text-ivory sm:text-8xl lg:text-[9.5rem]">
          Hana Brabcová
        </h1>
        <div className="mt-8 flex flex-col gap-5 sm:flex-row sm:items-center">
          <Button href="/portfolio">View portfolio</Button>
          <p className="max-w-md text-sm leading-7 text-ivory/72">
            Cinematic photography, short-form visuals, and polished brand stories for salons, hair artists, and cosmetics labels.
          </p>
        </div>
      </motion.div>
    </section>
  );
}
