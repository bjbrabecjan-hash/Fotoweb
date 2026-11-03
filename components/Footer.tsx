"use client";

import Link from "next/link";
import { LockKeyhole } from "lucide-react";
import { usePathname } from "next/navigation";
import { useExperience } from "@/lib/experience";
import { useLanguage } from "@/lib/i18n";

export function Footer() {
  const pathname = usePathname();
  const { entered } = useExperience();
  const { t } = useLanguage();

  if (pathname.startsWith("/pro-klienty") || pathname.startsWith("/administrace/galerie")) return null;

  if (pathname === "/" && !entered) {
    return null;
  }

  return (
    <footer className="border-t border-champagne/10 px-5 py-10 sm:px-8 lg:px-12">
      <div className="mx-auto flex max-w-7xl flex-col gap-6 text-xs uppercase tracking-luxe text-cream/52 sm:flex-row sm:items-center sm:justify-between">
        <p>Hana Brabcová</p>
        <div className="flex flex-wrap items-center gap-x-6 gap-y-3">
          <Link href="/pro-klienty" className="transition hover:text-champagne">Pro klienty</Link>
          <Link href="/portfolio" className="transition hover:text-champagne">
            {t.footer.portfolio}
          </Link>
          <Link href="/contact" className="transition hover:text-champagne">
            {t.footer.contact}
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
