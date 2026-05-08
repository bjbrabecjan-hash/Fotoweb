"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

const leftLinks = [
  { href: "https://instagram.com/", label: "Instagram", external: true },
  { href: "/portfolio", label: "Portfolio" },
];

const rightLinks = [
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" }
];

const navLinkClasses =
  "whitespace-nowrap text-[0.58rem] font-semibold uppercase tracking-[0.18em] text-ivory/72 transition-colors duration-300 hover:text-gold sm:text-[0.68rem] sm:tracking-luxe";

export function Navbar() {
  const pathname = usePathname();

  return (
    <header className="fixed inset-x-0 bottom-0 z-50 border-t border-gold/70 bg-ink/95 shadow-[0_-18px_60px_rgba(0,0,0,0.56)] backdrop-blur-xl">
      <nav
        aria-label="Primary navigation"
        className="relative mx-auto grid h-[4.75rem] max-w-7xl grid-cols-[1fr_auto_1fr] items-center gap-3 px-4 pb-[env(safe-area-inset-bottom)] sm:h-20 sm:gap-6 sm:px-8 lg:px-12"
      >
        <div className="flex min-w-0 items-center justify-end gap-4 sm:gap-8 lg:gap-12">
          {leftLinks.map((link) => (
            link.external ? (
              <a
                key={link.href}
                href={link.href}
                target="_blank"
                rel="noreferrer"
                className={navLinkClasses}
              >
                {link.label}
              </a>
            ) : (
              <Link
                key={link.href}
                href={link.href}
                className={cn(navLinkClasses, pathname === link.href && "text-gold")}
              >
                {link.label}
              </Link>
            )
          ))}
        </div>
        <Link
          href="/"
          aria-label="Hana Brabcová home"
          className="group relative -mt-10 flex size-14 items-center justify-center rounded-full border border-gold bg-ink shadow-[0_0_0_8px_#0B0B0B] transition-all duration-300 hover:scale-105 hover:bg-gold hover:shadow-[0_0_0_8px_#0B0B0B,0_0_34px_rgba(198,169,105,0.34)] sm:size-16"
        >
          <span className="pl-[0.18em] text-[0.74rem] font-semibold uppercase tracking-luxe text-gold transition-colors duration-300 group-hover:text-ink">
            HB
          </span>
        </Link>
        <div className="flex min-w-0 items-center justify-start gap-4 sm:gap-8 lg:gap-12">
          {rightLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={cn(navLinkClasses, pathname === link.href && "text-gold")}
            >
              {link.label}
            </Link>
          ))}
        </div>
      </nav>
    </header>
  );
}
