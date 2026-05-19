"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { useExperience } from "@/lib/experience";
import type { Locale } from "@/lib/i18n";
import { useLanguage } from "@/lib/i18n";
import { cn } from "@/lib/utils";

const instagramUrl = "https://www.instagram.com/brabcovahana_content_/";

const navLinkClasses =
  "whitespace-nowrap text-[0.62rem] font-semibold uppercase tracking-[0.2em] text-cream/66 transition-colors duration-300 hover:text-champagne";

export function Navbar() {
  const pathname = usePathname();
  const { locale, setLocale, t } = useLanguage();
  const { entered } = useExperience();
  const navLinks = [
    { href: "/", label: t.nav.home },
    { href: "/portfolio", label: t.nav.portfolio },
    { href: "/#services", label: t.nav.services },
    { href: "/#process", label: t.nav.process },
    { href: "/#about", label: t.nav.about },
    { href: "/contact", label: t.nav.contact }
  ] as const;
  const mobileNavLinks = [
    { href: instagramUrl, label: t.nav.instagram, external: true },
    { href: "/portfolio", label: t.nav.portfolio, external: false },
    { href: "/#about", label: t.nav.about, external: false },
    { href: "/contact", label: t.nav.contact, external: false }
  ] as const;

  if (pathname === "/" && !entered) {
    return null;
  }

  return (
    <>
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
              {t.nav.bookSession}
            </Link>
          </div>
        </nav>
      </motion.header>

      <motion.nav
        aria-label="Mobile navigation"
        className="fixed inset-x-0 bottom-0 z-50 border-t border-champagne/38 bg-warm-black/88 px-3 pb-[calc(env(safe-area-inset-bottom)+0.75rem)] pt-4 shadow-[0_-24px_70px_rgba(0,0,0,0.42)] backdrop-blur-2xl lg:hidden"
        initial={pathname === "/" ? { opacity: 0, y: 24 } : false}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
      >
        <div className="mx-auto grid max-w-md grid-cols-[1fr_1fr_4.5rem_1fr_1fr] items-end gap-1">
          {mobileNavLinks.slice(0, 2).map((link) => (
            <MobileNavLink key={link.href} link={link} pathname={pathname} />
          ))}
          <Link
            href="/"
            aria-label="Hana Brabcová home"
            className="group relative mx-auto -mt-10 flex size-16 items-center justify-center rounded-full border border-champagne bg-warm-black text-champagne shadow-[0_0_34px_rgba(214,190,132,0.2)] transition duration-300 hover:scale-105 hover:bg-champagne hover:text-warm-black hover:shadow-[0_0_46px_rgba(214,190,132,0.34)]"
          >
            <span className="text-[0.68rem] font-semibold uppercase tracking-[0.28em]">HB</span>
          </Link>
          {mobileNavLinks.slice(2).map((link) => (
            <MobileNavLink key={link.href} link={link} pathname={pathname} />
          ))}
        </div>
      </motion.nav>
    </>
  );
}

function MobileNavLink({
  link,
  pathname
}: {
  link: { href: string; label: string; external: boolean };
  pathname: string;
}) {
  const isActive = !link.external && pathname === link.href;

  return (
    <Link
      href={link.href}
      className={cn(
        "flex min-h-10 items-center justify-center px-1 text-center text-[0.56rem] font-semibold uppercase tracking-[0.16em] transition duration-300 hover:text-champagne",
        isActive ? "text-champagne" : "text-cream/62"
      )}
      {...(link.external
        ? {
            target: "_blank",
            rel: "noreferrer"
          }
        : {})}
    >
      {link.label}
    </Link>
  );
}
