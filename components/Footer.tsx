"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useExperience } from "@/lib/experience";
import { useLanguage } from "@/lib/i18n";

export function Footer() {
  const pathname = usePathname();
  const { entered } = useExperience();
  const { t } = useLanguage();

  if (pathname === "/" && !entered) {
    return null;
  }

  return (
    <footer className="border-t border-champagne/10 px-5 py-10 sm:px-8 lg:px-12">
      <div className="mx-auto flex max-w-7xl flex-col gap-6 text-xs uppercase tracking-luxe text-cream/52 sm:flex-row sm:items-center sm:justify-between">
        <p>Hana Brabcová</p>
        <div className="flex gap-6">
          <Link href="/portfolio" className="transition hover:text-champagne">
            {t.footer.portfolio}
          </Link>
          <Link href="/contact" className="transition hover:text-champagne">
            {t.footer.contact}
          </Link>
        </div>
      </div>
    </footer>
  );
}
