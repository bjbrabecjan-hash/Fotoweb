"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import type { Locale } from "@/lib/i18n";
import { useLanguage } from "@/lib/i18n";
import { cn } from "@/lib/utils";

const navLinkClasses =
  "whitespace-nowrap rounded-sm text-[0.62rem] font-semibold uppercase tracking-[0.2em] text-ink/75 transition-colors duration-300 hover:text-gold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2 focus-visible:ring-offset-ivory";

export function Navbar() {
  const pathname = usePathname();
  const { locale, setLocale, t } = useLanguage();
  const navLinks = [
    { href: "/", label: t.nav.home },
    { href: "/portfolio", label: t.nav.portfolio },
    { href: "/#pricing", label: t.nav.pricing },
    { href: "/#services", label: t.nav.services },
    { href: "/#process", label: t.nav.process },
    { href: "/#about", label: t.nav.about },
    { href: "/contact", label: t.nav.contact }
  ] as const;
  const mobileNavLinks = [
    { href: "/portfolio", label: t.nav.portfolio, external: false },
    { href: "/#pricing", label: t.nav.pricing, external: false },
    { href: "/#about", label: t.nav.about, external: false },
    { href: "/contact", label: t.nav.contact, external: false }
  ] as const;

  return (
    <>
      <motion.header
        className="fixed inset-x-0 top-0 z-40 border-b border-ink/10 bg-ivory/95 shadow-sm backdrop-blur-xl"
        initial={pathname === "/" ? { opacity: 0, y: -18 } : false}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
      >
        <nav
          aria-label="Primary navigation"
          className="mx-auto flex h-20 max-w-7xl items-center justify-between gap-5 px-5 sm:px-8 lg:px-12"
        >
          <Link href="/" className="rounded-sm font-display text-lg uppercase tracking-[0.24em] text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold">
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
            <div className="flex items-center border border-gold/30 bg-white p-0.5">
              {(["en", "cz"] as Locale[]).map((item) => (
                <button
                  key={item}
                  type="button"
                  className={cn(
                    "min-w-8 px-2 py-1 text-[0.58rem] font-semibold uppercase tracking-[0.16em] transition-all duration-300",
                    locale === item ? "bg-gold text-white" : "text-ash hover:text-gold"
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
              className="hidden border border-gold bg-gold px-5 py-3 text-[0.62rem] font-semibold uppercase tracking-[0.22em] text-white transition duration-300 hover:bg-transparent hover:text-gold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2 md:inline-flex"
            >
              {t.nav.bookSession}
            </Link>
          </div>
        </nav>
      </motion.header>

      <motion.nav
        aria-label="Mobile navigation"
        className="fixed inset-x-0 bottom-0 z-50 border-t border-gold/30 bg-ivory/95 px-3 pb-[calc(env(safe-area-inset-bottom)+0.75rem)] pt-4 shadow-[0_-24px_70px_rgba(0,0,0,0.18)] backdrop-blur-2xl lg:hidden"
        initial={pathname === "/" ? { opacity: 0, y: 24 } : false}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
      >
        <div className="mx-auto grid max-w-md grid-cols-4 items-center gap-1">
          {mobileNavLinks.map((link) => (
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
        "flex min-h-11 items-center justify-center rounded-sm px-1 text-center text-[0.56rem] font-semibold uppercase tracking-[0.16em] transition duration-300 hover:text-champagne focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-champagne",
        isActive ? "text-gold" : "text-ink/70"
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
