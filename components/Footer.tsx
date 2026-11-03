"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LockKeyhole } from "lucide-react";
import { useLanguage } from "@/lib/i18n";

export function Footer() {
  const { t, locale } = useLanguage();
  const pathname = usePathname();

  if (pathname.startsWith("/pro-klienty") || pathname.startsWith("/administrace/galerie")) return null;

  return (
    <footer className="border-t border-champagne/10 px-5 py-10 sm:px-8 lg:px-12">
      <div className="mx-auto flex max-w-7xl flex-col gap-6 text-xs uppercase tracking-luxe text-ink/60 sm:flex-row sm:items-center sm:justify-between">
        <p>Hana Brabcová</p>
        <div className="flex flex-wrap items-center gap-x-6 gap-y-4">
          <Link href="/pro-klienty" className="rounded-sm transition hover:text-champagne focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-champagne">{locale === "cz" ? "Pro klienty" : "Client galleries"}</Link>
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
          <Link href="/administrace/galerie" className="inline-flex items-center gap-2 border border-champagne/30 px-3 py-2 transition hover:border-champagne hover:text-champagne" aria-label="Pro Hanku — přihlášení do správy galerií">
            <LockKeyhole size={13} aria-hidden="true" />
            Pro Hanku
          </Link>
        </div>
      </div>
    </footer>
  );
}
