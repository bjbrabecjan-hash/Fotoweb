"use client";

import Image from "next/image";
import { motion, useReducedMotion } from "framer-motion";
import { useMemo, useState } from "react";
import { Lightbox } from "@/components/Lightbox";
import { useLanguage } from "@/lib/i18n";
import { categories, type WorkItem } from "@/lib/work";
import { cn } from "@/lib/utils";

export type GalleryCategory = string;
export type GalleryItem = Omit<WorkItem, "category"> & { category: GalleryCategory };
type GalleryGridProps = { items: GalleryItem[]; categories?: readonly GalleryCategory[]; filterable?: boolean; featured?: boolean };
const ratioClasses = { portrait: "aspect-[4/5]", landscape: "aspect-[5/3]", square: "aspect-square" };

export function GalleryGrid({ items, categories: categoryOptions = categories, filterable = false, featured = false }: GalleryGridProps) {
  const { t, locale } = useLanguage();
  const reducedMotion = useReducedMotion();
  const [category, setCategory] = useState<GalleryCategory>("All");
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const visibleItems = useMemo(() => category === "All" ? items : items.filter((item) => item.category === category), [category, items]);

  return <>
    {filterable && <div className="mb-10 flex gap-2 overflow-x-auto pb-2" aria-label={locale === "cz" ? "Filtrovat portfolio" : "Filter portfolio"}>{categoryOptions.map((item) => <button key={item} type="button" className={cn("shrink-0 border px-4 py-2 text-[0.68rem] uppercase tracking-luxe transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold", category === item ? "border-gold bg-gold text-white" : "border-ink/20 text-ash hover:border-gold hover:text-gold")} onClick={() => setCategory(item)}>{t.portfolio.categories[item] ?? item}</button>)}</div>}
    <div className={featured ? "grid gap-4 sm:grid-cols-2 lg:grid-cols-3" : "masonry"}>
      {visibleItems.map((item,index) => <motion.button key={item.id} type="button" aria-label={`${locale === "cz" ? "Otevřít fotografii" : "Open photograph"}: ${item.title}`} className={cn("group relative mb-4 block w-full overflow-hidden bg-charcoal text-left focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-gold focus-visible:ring-offset-2", featured ? ratioClasses[item.ratio] : `${ratioClasses[item.ratio]} break-inside-avoid`)} initial={reducedMotion ? false : {opacity:0,y:18}} whileInView={reducedMotion ? undefined : {opacity:1,y:0}} viewport={{once:true,margin:"-80px"}} transition={{duration:.45,delay:Math.min(index*.03,.18)}} onClick={() => setActiveIndex(index)}>
        <Image src={item.src} alt={item.alt} fill sizes={featured ? "(min-width:1280px) 400px, (min-width:1024px) 31vw, (min-width:640px) 48vw, 100vw" : "(min-width:1280px) 400px, (min-width:1024px) 31vw, (min-width:640px) 48vw, 100vw"} className="object-cover transition-transform duration-700 group-hover:scale-[1.025]" />
        <span className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-80"/><span className="absolute inset-x-5 bottom-5"><span className="block text-[.62rem] uppercase tracking-luxe text-white/90">{t.portfolio.categories[item.category] ?? item.category}</span><span className="mt-1 block font-display text-2xl text-white">{item.title}</span></span>
      </motion.button>)}
    </div>
    <Lightbox items={visibleItems} index={activeIndex} onClose={() => setActiveIndex(null)} onChange={setActiveIndex}/>
  </>;
}
