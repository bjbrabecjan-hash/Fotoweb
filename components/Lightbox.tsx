"use client";

import Image from "next/image";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import { createPortal } from "react-dom";
import { useEffect, useRef, useState } from "react";
import { useLanguage } from "@/lib/i18n";
import type { GalleryItem } from "@/components/GalleryGrid";

type Props = { items: GalleryItem[]; index: number | null; onClose: () => void; onChange: (index: number) => void };

export function Lightbox({ items, index, onClose, onChange }: Props) {
  const { t, locale } = useLanguage();
  const reducedMotion = useReducedMotion();
  const closeRef = useRef<HTMLButtonElement>(null);
  const previousFocus = useRef<HTMLElement | null>(null);
  const [mounted, setMounted] = useState(false);
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const active = index !== null ? items[index] : null;
  const activeTitle = active ? (locale === "en" ? active.titleEn ?? active.title : active.title) : "";
  const activeAlt = active ? (locale === "en" ? active.altEn ?? active.alt : active.alt) : "";
  useEffect(() => setMounted(true), []);

  useEffect(() => {
    if (index === null) return;
    previousFocus.current = document.activeElement as HTMLElement;
    const modal = document.querySelector<HTMLElement>("[data-lightbox]");
    const siblings = [...document.body.children].filter((element) => element !== modal);
    siblings.forEach((element) => element.setAttribute("inert", ""));
    const oldOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    closeRef.current?.focus();

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") onClose();
      if (event.key === "ArrowRight") onChange(((index ?? 0) + 1) % items.length);
      if (event.key === "ArrowLeft") onChange(((index ?? 0) - 1 + items.length) % items.length);
      if (event.key === "Tab" && modal) {
        const controls = [...modal.querySelectorAll<HTMLElement>('button,[href],[tabindex]:not([tabindex="-1"])')].filter((el) => !el.hasAttribute("disabled"));
        const first = controls[0], last = controls[controls.length - 1];
        if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last?.focus(); }
        else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first?.focus(); }
      }
    }
    window.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = oldOverflow;
      siblings.forEach((element) => element.removeAttribute("inert"));
      window.removeEventListener("keydown", onKeyDown);
      previousFocus.current?.focus();
    };
  }, [index, items.length, onChange, onClose]);

  if (!mounted) return null;
  const previous = () => index !== null && onChange((index - 1 + items.length) % items.length);
  const next = () => index !== null && onChange((index + 1) % items.length);
  const labels = locale === "cz" ? { dialog: "Náhled fotografie", close: "Zavřít náhled", previous: "Předchozí fotografie", next: "Další fotografie" } : { dialog: "Photograph preview", close: "Close preview", previous: "Previous photograph", next: "Next photograph" };

  return createPortal(<AnimatePresence>{active && index !== null && <motion.div data-lightbox data-protected-media role="dialog" aria-modal="true" aria-label={labels.dialog} className="fixed inset-0 z-[100] flex items-center justify-center bg-black/95 px-4 py-20" initial={reducedMotion ? false : {opacity:0}} animate={{opacity:1}} exit={reducedMotion ? undefined : {opacity:0}}>
    <button ref={closeRef} type="button" aria-label={labels.close} className="absolute right-4 top-4 z-10 rounded-full bg-black/60 p-3 text-white hover:text-gold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white" onClick={onClose}><X size={26}/></button>
    <button type="button" aria-label={labels.previous} className="absolute bottom-5 left-5 z-10 rounded-full bg-black/60 p-3 text-white hover:text-gold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white sm:bottom-auto sm:top-1/2 sm:-translate-y-1/2" onClick={previous}><ChevronLeft size={30}/></button>
    <button type="button" aria-label={labels.next} className="absolute bottom-5 right-5 z-10 rounded-full bg-black/60 p-3 text-white hover:text-gold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white sm:bottom-auto sm:top-1/2 sm:-translate-y-1/2" onClick={next}><ChevronRight size={30}/></button>
    <motion.div key={active.id} className="relative h-full max-h-[78vh] w-full max-w-6xl" initial={reducedMotion ? false : {opacity:0,scale:.98}} animate={{opacity:1,scale:1}} exit={reducedMotion ? undefined : {opacity:0,scale:.98}} onTouchStart={(event) => setTouchStart(event.touches[0].clientX)} onTouchEnd={(event) => {
      if (touchStart !== null && Math.abs(touchStart - event.changedTouches[0].clientX) > 48) {
        if (touchStart > event.changedTouches[0].clientX) next();
        else previous();
      }
      setTouchStart(null);
    }}><Image src={active.src} alt={activeAlt} fill sizes="100vw" className="object-contain" priority/></motion.div>
    <div className="pointer-events-none absolute inset-x-16 bottom-7 text-center"><p className="text-xs uppercase tracking-luxe text-gold">{t.portfolio.categories[active.category] ?? active.category}</p><h2 className="mt-1 font-display text-xl text-white sm:text-2xl">{activeTitle}</h2></div>
  </motion.div>}</AnimatePresence>, document.body);
}
