"use client";

import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import { useEffect, useState } from "react";
import type { WorkItem } from "@/lib/work";

type LightboxProps = {
  items: WorkItem[];
  index: number | null;
  onClose: () => void;
  onChange: (index: number) => void;
};

export function Lightbox({ items, index, onClose, onChange }: LightboxProps) {
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const active = index !== null ? items[index] : null;

  useEffect(() => {
    if (index === null) {
      return;
    }

    const currentIndex = index;

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        onClose();
      }
      if (event.key === "ArrowRight") {
        onChange((currentIndex + 1) % items.length);
      }
      if (event.key === "ArrowLeft") {
        onChange((currentIndex - 1 + items.length) % items.length);
      }
    }

    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [index, items.length, onChange, onClose]);

  function previous() {
    if (index !== null) {
      onChange((index - 1 + items.length) % items.length);
    }
  }

  function next() {
    if (index !== null) {
      onChange((index + 1) % items.length);
    }
  }

  function onTouchEnd(clientX: number) {
    if (touchStart === null) {
      return;
    }

    const distance = touchStart - clientX;
    if (Math.abs(distance) > 48) {
      if (distance > 0) {
        next();
      } else {
        previous();
      }
    }
    setTouchStart(null);
  }

  return (
    <AnimatePresence>
      {active && index !== null && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black px-4 py-20"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <button aria-label="Close lightbox" className="absolute right-5 top-5 z-10 p-3 text-ivory" onClick={onClose}>
            <X size={24} />
          </button>
          <button
            aria-label="Previous image"
            className="absolute left-3 top-1/2 z-10 hidden -translate-y-1/2 p-4 text-ivory transition hover:text-gold sm:block"
            onClick={previous}
          >
            <ChevronLeft size={30} />
          </button>
          <button
            aria-label="Next image"
            className="absolute right-3 top-1/2 z-10 hidden -translate-y-1/2 p-4 text-ivory transition hover:text-gold sm:block"
            onClick={next}
          >
            <ChevronRight size={30} />
          </button>
          <motion.div
            key={active.id}
            className="relative h-full max-h-[78vh] w-full max-w-6xl"
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
            transition={{ duration: 0.3 }}
            onTouchStart={(event) => setTouchStart(event.touches[0].clientX)}
            onTouchEnd={(event) => onTouchEnd(event.changedTouches[0].clientX)}
          >
            <Image src={active.src} alt={active.alt} fill sizes="100vw" className="object-contain" priority />
          </motion.div>
          <div className="absolute bottom-7 left-1/2 w-full max-w-5xl -translate-x-1/2 px-5 text-center">
            <p className="text-xs uppercase tracking-luxe text-gold">{active.category}</p>
            <h2 className="mt-2 font-display text-2xl uppercase tracking-wider text-ivory">{active.title}</h2>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
