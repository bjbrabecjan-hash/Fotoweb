"use client";

import Link from "next/link";
import { useLanguage } from "@/lib/i18n";

export function Footer() {
  const { t } = useLanguage();

  return (
    <footer className="border-t border-white/10 px-5 py-10 sm:px-8 lg:px-12">
      <div className="mx-auto flex max-w-7xl flex-col gap-6 text-xs uppercase tracking-luxe text-ash sm:flex-row sm:items-center sm:justify-between">
        <p>Hana Brabcová</p>
        <div className="flex gap-6">
          <Link href="/portfolio" className="transition hover:text-gold">
            {t.footer.portfolio}
          </Link>
          <Link href="/contact" className="transition hover:text-gold">
            {t.footer.contact}
          </Link>
        </div>
      </div>
    </footer>
  );
}
