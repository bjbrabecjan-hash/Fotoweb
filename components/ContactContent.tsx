"use client";

import { Instagram, Mail, MapPin } from "lucide-react";
import { Button } from "@/components/Button";
import { Section } from "@/components/Section";
import { useLanguage } from "@/lib/i18n";

export function ContactContent() {
  const { t } = useLanguage();

  return (
    <Section className="min-h-screen pt-32 lg:pt-40">
      <div className="grid gap-12 lg:grid-cols-[0.95fr_1.05fr]">
        <div>
          <p className="mb-5 text-xs uppercase tracking-luxe text-gold">{t.contact.eyebrow}</p>
          <h1 className="font-display text-5xl uppercase leading-none tracking-wider text-ivory sm:text-7xl lg:text-8xl">
            {t.contact.title}
          </h1>
          <p className="mt-8 max-w-xl text-base leading-8 text-ash">{t.contact.text}</p>
          <div className="mt-10 space-y-5 text-sm text-ash">
            <a className="flex items-center gap-4 transition hover:text-gold" href="mailto:hello@hanabrabcova.com">
              <Mail size={18} />
              hello@hanabrabcova.com
            </a>
            <a
              className="flex items-center gap-4 transition hover:text-gold"
              href="https://www.instagram.com/brabcova_content_/"
              target="_blank"
              rel="noreferrer"
            >
              <Instagram size={18} />
              @brabcova_content_
            </a>
            <p className="flex items-center gap-4">
              <MapPin size={18} />
              {t.contact.location}
            </p>
          </div>
        </div>
        <form className="border border-white/10 bg-white/[0.025] p-6 sm:p-8">
          <div className="grid gap-6">
            <label className="grid gap-3 text-xs uppercase tracking-luxe text-gold">
              {t.contact.name}
              <input
                className="h-12 border border-white/10 bg-ink px-4 text-sm normal-case tracking-normal text-ivory outline-none transition focus:border-gold"
                name="name"
                autoComplete="name"
              />
            </label>
            <label className="grid gap-3 text-xs uppercase tracking-luxe text-gold">
              {t.contact.email}
              <input
                className="h-12 border border-white/10 bg-ink px-4 text-sm normal-case tracking-normal text-ivory outline-none transition focus:border-gold"
                type="email"
                name="email"
                autoComplete="email"
              />
            </label>
            <label className="grid gap-3 text-xs uppercase tracking-luxe text-gold">
              {t.contact.project}
              <textarea
                className="min-h-36 resize-y border border-white/10 bg-ink px-4 py-3 text-sm normal-case tracking-normal text-ivory outline-none transition focus:border-gold"
                name="message"
              />
            </label>
            <Button type="submit" className="w-full">
              {t.contact.submit}
            </Button>
          </div>
        </form>
      </div>
    </Section>
  );
}
