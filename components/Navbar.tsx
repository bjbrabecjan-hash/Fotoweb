"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

const links = [
  { href: "/", label: "Home" },
  { href: "/portfolio", label: "Portfolio" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" }
];

export function Navbar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    let previousY = window.scrollY;

    function onScroll() {
      const currentY = window.scrollY;
      setScrolled(currentY > 24);
      setHidden(currentY > previousY && currentY > 120 && !open);
      previousY = currentY;
    }

    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, [open]);

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-40 transition duration-500",
        hidden ? "-translate-y-full" : "translate-y-0",
        scrolled || open ? "border-b border-white/10 bg-ink/88 backdrop-blur-xl" : "bg-transparent"
      )}
    >
      <nav className="mx-auto flex h-20 max-w-7xl items-center justify-between px-5 sm:px-8 lg:px-12">
        <Link href="/" className="font-display text-xl uppercase tracking-luxe text-ivory">
          HB
        </Link>
        <div className="hidden items-center gap-8 md:flex">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "text-[0.68rem] uppercase tracking-luxe transition hover:text-gold",
                pathname === link.href ? "text-gold" : "text-ivory/76"
              )}
            >
              {link.label}
            </Link>
          ))}
        </div>
        <button
          aria-label={open ? "Close menu" : "Open menu"}
          className="inline-flex size-11 items-center justify-center border border-white/10 text-ivory md:hidden"
          onClick={() => setOpen((value) => !value)}
        >
          {open ? <X size={18} /> : <Menu size={18} />}
        </button>
      </nav>
      <div
        className={cn(
          "grid overflow-hidden border-t border-white/10 bg-ink/96 transition-all duration-300 md:hidden",
          open ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
        )}
      >
        <div className="min-h-0">
          <div className="flex flex-col px-5 py-5">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="border-b border-white/10 py-4 text-sm uppercase tracking-luxe text-ivory"
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </header>
  );
}
