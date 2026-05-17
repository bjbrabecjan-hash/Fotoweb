"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { useExperience } from "@/lib/experience";
import type { Locale } from "@/lib/i18n";
import { useLanguage } from "@/lib/i18n";
import { cn } from "@/lib/utils";

const leftLinks = [
  { href: "https://www.instagram.com/brabcova_content_/", key: "instagram", external: true },
  { href: "/portfolio", key: "portfolio", external: false },
] as const;

const rightLinks = [
  { href: "/about", key: "about", external: false },
  { href: "/contact", key: "contact", external: false }
] as const;

const navLinkClasses =
  "whitespace-nowrap text-[0.58rem] font-semibold uppercase tracking-[0.18em] text-cream/72 transition-colors duration-300 hover:text-champagne sm:text-[0.68rem] sm:tracking-luxe";

export function Navbar() {
  const pathname = usePathname();
  const { locale, setLocale, t } = useLanguage();
  const { entered } = useExperience();

  if (pathname === "/" && !entered) {
    return null;
  }

  return (
    <motion.header
      className="fixed inset-x-0 bottom-0 z-50 border-t border-champagne/70 bg-warm-black/92 shadow-[0_-18px_60px_rgba(0,0,0,0.56)] backdrop-blur-xl"
      initial={pathname === "/" ? { opacity: 0, y: 28 } : false}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
    >
      <nav
        aria-label="Primary navigation"
        className="relative mx-auto grid h-[4.75rem] max-w-7xl grid-cols-[1fr_auto_1fr] items-center gap-3 px-4 pb-[env(safe-area-inset-bottom)] sm:h-20 sm:gap-6 sm:px-8 lg:px-12"
      >
        <div className="flex min-w-0 items-center justify-end gap-3 sm:gap-8 lg:gap-12">
          {leftLinks.map((link) => (
            link.external ? (
              <a
                key={link.href}
                href={link.href}
                target="_blank"
                rel="noreferrer"
                className={navLinkClasses}
              >
                {t.nav[link.key]}
              </a>
            ) : (
              <Link
                key={link.href}
                href={link.href}
                className={cn(navLinkClasses, pathname === link.href && "text-champagne")}
              >
                {t.nav[link.key]}
              </Link>
            )
          ))}
        </div>
        <Link
          href="/"
          aria-label={t.nav.homeLabel}
          className="group relative -mt-16 flex size-14 items-center justify-center rounded-full border border-champagne bg-warm-black shadow-[0_0_0_8px_#090A08] transition-all duration-300 hover:scale-105 hover:bg-champagne hover:shadow-[0_0_0_8px_#090A08,0_0_34px_rgba(214,190,132,0.34)] sm:-mt-20 sm:size-16"
        >
          <span className="pl-[0.18em] text-[0.74rem] font-semibold uppercase tracking-luxe text-champagne transition-colors duration-300 group-hover:text-warm-black">
            HB
          </span>
        </Link>
        <div className="flex min-w-0 items-center justify-start gap-3 sm:gap-8 lg:gap-12">
          {rightLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={cn(navLinkClasses, pathname === link.href && "text-champagne")}
            >
              {t.nav[link.key]}
            </Link>
          ))}
        </div>
        <div className="absolute -top-12 right-4 sm:-top-14 sm:right-8">
          <div className="flex items-center border border-champagne/40 bg-warm-black/90 p-0.5 shadow-[0_12px_34px_rgba(0,0,0,0.38)] backdrop-blur-xl">
            {(["en", "cz"] as Locale[]).map((item) => (
              <button
                key={item}
                type="button"
                className={cn(
                  "min-w-8 px-2 py-1 text-[0.58rem] font-semibold uppercase tracking-[0.16em] transition-all duration-300",
                  locale === item ? "bg-champagne text-warm-black" : "text-ash hover:text-champagne"
                )}
                onClick={() => setLocale(item)}
                aria-pressed={locale === item}
              >
                {item}
              </button>
            ))}
          </div>
        </div>
      </nav>
    </motion.header>
  );
}
