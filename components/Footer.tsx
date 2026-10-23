"use client";

import Link from "next/link";
import { useLanguage } from "@/lib/i18n";

export function Footer() {
  const { t, locale } = useLanguage();

  return (
    <footer className="border-t border-champagne/10 px-5 py-10 sm:px-8 lg:px-12">
      <div className="mx-auto flex max-w-7xl flex-col gap-6 text-xs uppercase tracking-luxe text-ink/60 sm:flex-row sm:items-center sm:justify-between">
        <p>Hana Brabcová</p>
        <div className="flex flex-wrap gap-x-6 gap-y-4">
          <Link href="/portfolio" className="rounded-sm transition hover:text-champagne focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-champagne">
            {t.footer.portfolio}
          </Link>
          <Link href="/#pricing" className="rounded-sm transition hover:text-champagne focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-champagne">
            {t.nav.pricing}
          </Link>
          <Link href="/contact" className="rounded-sm transition hover:text-champagne focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-champagne">
            {t.footer.contact}
          </Link>
          <Link href="/obchodni-podminky" className="rounded-sm transition hover:text-champagne focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-champagne">
            {locale === "cz" ? "Obchodní podmínky" : "Terms & conditions (Czech)"}
          </Link>
        </div>
      </div>
    </footer>
  );
}
