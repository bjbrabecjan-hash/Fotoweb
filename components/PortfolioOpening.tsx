"use client";

import Image from "next/image";
import { useEffect, useRef } from "react";
import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import type { PortfolioItem } from "@/lib/portfolioData";
import styles from "./PortfolioOpening.module.css";

const introKey = "hana:opening:v1";

export function PortfolioOpening({ items, locale }: { items: PortfolioItem[]; locale: "cz" | "en" }) {
  const intro = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (intro.current?.dataset.bootstrapped === "true") return;
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    let seen = false;
    try { seen = sessionStorage.getItem(introKey) === "seen"; } catch { /* Storage can be disabled. */ }
    if (seen || media.matches || window.location.hash || window.scrollY > 0) return;
    try { sessionStorage.setItem(introKey, "seen"); } catch { /* The portfolio remains available. */ }
    const overlay = intro.current;
    if (!overlay) return;
    overlay.dataset.playing = "true";
    const finish = () => {
      delete overlay.dataset.playing;
    };
    const timer = window.setTimeout(finish, 1500);
    const onPreference = () => { if (media.matches) finish(); };
    media.addEventListener("change", onPreference);
    return () => { clearTimeout(timer); finish(); media.removeEventListener("change", onPreference); };
  }, []);

  return <>
    <div ref={intro} className={styles.intro} aria-hidden="true" suppressHydrationWarning>
      <script dangerouslySetInnerHTML={{ __html: `(function(){var el=document.currentScript.parentElement;el.dataset.bootstrapped="true";var media=matchMedia("(prefers-reduced-motion: reduce)");try{if(media.matches||sessionStorage.getItem("${introKey}")||location.hash||scrollY>0)return;sessionStorage.setItem("${introKey}","seen")}catch(e){if(media.matches)return}el.dataset.playing="true";setTimeout(function(){delete el.dataset.playing},1500)})()` }} />
      {["Světlo.", "Pohyb.", "Příběh.", "Teď."].map((word, index) => <span key={word} style={{ animationDelay: `${index * 280}ms` }}>{word}</span>)}
    </div>
    <section id="portfolio" className={styles.gallery} aria-label={locale === "cz" ? "Fotografické portfolio" : "Photography portfolio"}>
      {items.filter(item => item.type === "image").map((item, index) => <Frame key={item.id} item={item} index={index} locale={locale} />)}
    </section>
  </>;
}

function Frame({ item, index, locale }: { item: PortfolioItem; index: number; locale: "cz" | "en" }) {
  const ref = useRef<HTMLElement>(null);
  const reduced = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "start start"] });
  const y = useTransform(scrollYProgress, [0, 1], [90, 0]);
  const scale = useTransform(scrollYProgress, [0, 1], [0.94, 1]);
  const title = locale === "en" ? item.titleEn ?? item.title : item.title;
  return <figure ref={ref} data-protected-media className={`${styles.frame} ${item.ratio === "landscape" ? styles.landscape : styles.portrait}`}>
    <motion.div className={styles.photo} style={index === 0 || reduced ? undefined : { y, scale }}>
      <Image src={item.src} alt={locale === "en" ? item.altEn ?? item.alt : item.alt} fill priority={index === 0} sizes="(min-width: 1024px) 88vw, 100vw" className={styles.image} />
    </motion.div>
    <figcaption><span>{String(index + 1).padStart(2, "0")}</span><span>{title}</span></figcaption>
  </figure>;
}
