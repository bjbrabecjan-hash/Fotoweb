"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { useExperience } from "@/lib/experience";
import type { Locale } from "@/lib/i18n";
import { useLanguage } from "@/lib/i18n";
import { cn } from "@/lib/utils";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/portfolio", label: "Portfolio" },
  { href: "/#services", label: "Services" },
  { href: "/#process", label: "Process" },
  { href: "/#about", label: "About" },
  { href: "/contact", label: "Contact" }
] as const;

const navLinkClasses =
  "whitespace-nowrap text-[0.62rem] font-semibold uppercase tracking-[0.2em] text-cream/66 transition-colors duration-300 hover:text-champagne";

export function Navbar() {
  const pathname = usePathname();
  const { locale, setLocale } = useLanguage();
  const { entered } = useExperience();

  if (pathname === "/" && !entered) {
    return null;
  }

  return (
    <motion.header
      className="fixed inset-x-0 top-0 z-50 border-b border-champagne/12 bg-warm-black/28 backdrop-blur-2xl"
      initial={pathname === "/" ? { opacity: 0, y: -18 } : false}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
    >
      <nav
        aria-label="Primary navigation"
        className="mx-auto flex h-20 max-w-7xl items-center justify-between gap-5 px-5 sm:px-8 lg:px-12"
      >
        <Link href="/" className="font-display text-lg uppercase tracking-[0.24em] text-champagne">
          Hana Brabcová
        </Link>
        <div className="hidden items-center gap-6 lg:flex">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={cn(navLinkClasses, pathname === link.href && link.href !== "/" && "text-champagne")}
            >
              {link.label}
            </Link>
          ))}
        </div>
        <div className="flex items-center gap-3">
          <div className="hidden items-center border border-champagne/32 bg-cream/[0.04] p-0.5 backdrop-blur-xl sm:flex">
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
          <Link
            href="/contact"
            className="hidden border border-champagne/60 bg-cream/[0.04] px-5 py-3 text-[0.62rem] font-semibold uppercase tracking-[0.22em] text-champagne backdrop-blur-xl transition duration-300 hover:bg-champagne hover:text-warm-black md:inline-flex"
          >
            Book a Session
          </Link>
        </div>
      </nav>
    </motion.header>
  );
}
