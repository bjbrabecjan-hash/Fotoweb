"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { useMemo, useState } from "react";
import { Lightbox } from "@/components/Lightbox";
import { useLanguage } from "@/lib/i18n";
import { categories, type WorkItem } from "@/lib/work";
import { cn } from "@/lib/utils";

export type GalleryCategory = string;
export type GalleryItem = Omit<WorkItem, "category"> & {
  category: GalleryCategory;
};

type GalleryGridProps = {
  items: GalleryItem[];
  categories?: readonly GalleryCategory[];
  filterable?: boolean;
  featured?: boolean;
};

const ratioClasses = {
  portrait: "aspect-[4/5]",
  landscape: "aspect-[5/3]",
  square: "aspect-square"
};

export function GalleryGrid({ items, categories: categoryOptions = categories, filterable = false, featured = false }: GalleryGridProps) {
  const { t } = useLanguage();
  const [category, setCategory] = useState<GalleryCategory>("All");
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  const visibleItems = useMemo(
    () => (category === "All" ? items : items.filter((item) => item.category === category)),
    [category, items]
  );

  return (
    <>
      {filterable && (
        <div className="mb-10 flex gap-2 overflow-x-auto pb-2">
          {categoryOptions.map((item) => (
            <button
              key={item}
              className={cn(
                "shrink-0 border px-4 py-2 text-[0.68rem] uppercase tracking-luxe transition",
                category === item ? "border-gold bg-gold text-white" : "border-ink/14 text-ash hover:border-gold hover:text-gold"
              )}
              onClick={() => setCategory(item)}
            >
              {t.portfolio.categories[item] ?? item}
            </button>
          ))}
        </div>
      )}
      <div className={featured ? "grid gap-4 sm:grid-cols-2 lg:grid-cols-3" : "masonry"}>
        {visibleItems.map((item, index) => (
          <motion.button
            key={item.id}
            type="button"
            className={cn(
              "group relative mb-4 block w-full overflow-hidden bg-charcoal text-left",
              featured ? ratioClasses[item.ratio] : `${ratioClasses[item.ratio]} break-inside-avoid`
            )}
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.55, delay: Math.min(index * 0.04, 0.24) }}
            onClick={() => setActiveIndex(index)}
          >
            <Image
              src={item.src}
              alt={item.alt}
              fill
              sizes={featured ? "(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw" : "(min-width: 1024px) 33vw, 100vw"}
              className="object-cover transition duration-700 group-hover:scale-105"
            />
            <span className="absolute inset-0 bg-gradient-to-t from-black/88 via-black/24 to-transparent opacity-[0.82] transition group-hover:opacity-100" />
            <span className="absolute bottom-5 left-5 right-5 translate-y-3 opacity-0 transition duration-300 group-hover:translate-y-0 group-hover:opacity-100">
              <span className="block text-[0.65rem] uppercase tracking-luxe text-white/70 drop-shadow-[0_2px_12px_rgba(0,0,0,0.78)]">
                {t.portfolio.categories[item.category] ?? item.category}
              </span>
              <span className="mt-1 block font-display text-2xl uppercase tracking-wider text-white drop-shadow-[0_4px_20px_rgba(0,0,0,0.82)]">{item.title}</span>
            </span>
          </motion.button>
        ))}
      </div>
      <Lightbox items={visibleItems} index={activeIndex} onClose={() => setActiveIndex(null)} onChange={setActiveIndex} />
    </>
  );
}
