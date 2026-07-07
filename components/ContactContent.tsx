"use client";

import { ExternalLink, Instagram, Mail, MapPin, Phone } from "lucide-react";
import { Button } from "@/components/Button";
import { Section } from "@/components/Section";
import { useLanguage } from "@/lib/i18n";

export function ContactContent() {
  const { t } = useLanguage();
  const email = "fotohanabrabcova@gmail.com";
  const phone = "734 548 996";
  const instagramUrl = "https://www.instagram.com/brabcovahana_content_/";
  const facebookUrl = "https://www.facebook.com/profile.php?id=61579648302684";

  return (
    <Section className="min-h-screen pt-32 lg:pt-40">
      <div className="grid gap-12 lg:grid-cols-[0.95fr_1.05fr]">
        <div>
          <p className="mb-5 text-xs uppercase tracking-luxe text-gold">{t.contact.eyebrow}</p>
          <h1 className="font-display text-5xl uppercase leading-none tracking-wider text-ink sm:text-7xl lg:text-8xl">
            {t.contact.title}
          </h1>
          <p className="mt-8 max-w-xl text-base leading-8 text-ash">{t.contact.text}</p>
          <div className="mt-10 space-y-5 text-sm text-ash">
            <a className="flex items-center gap-4 transition hover:text-gold" href={`mailto:${email}`}>
              <Mail size={18} />
              {email}
            </a>
            <a className="flex items-center gap-4 transition hover:text-gold" href="tel:+420734548996">
              <Phone size={18} />
              {phone}
            </a>
            <a
              className="flex items-center gap-4 transition hover:text-gold"
              href={instagramUrl}
              target="_blank"
              rel="noreferrer"
            >
              <Instagram size={18} />
              @brabcovahana_content_
            </a>
            <a
              className="flex items-center gap-4 transition hover:text-gold"
              href={facebookUrl}
              target="_blank"
              rel="noreferrer"
            >
              <ExternalLink size={18} />
              Facebook
            </a>
            <p className="flex items-center gap-4">
              <MapPin size={18} />
              {t.contact.location}
            </p>
          </div>
        </div>
        <form
          action={`mailto:${email}?subject=Poptavka%20z%20webu%20Hana%20Brabcova`}
          method="post"
          encType="text/plain"
          className="border border-ink/10 bg-white/62 p-6 shadow-[0_24px_80px_rgba(38,37,34,0.07)] sm:p-8"
        >
          <div className="grid gap-6">
            <label className="grid gap-3 text-xs uppercase tracking-luxe text-gold">
              {t.contact.name}
              <input
                className="h-12 border border-ink/12 bg-white px-4 text-sm normal-case tracking-normal text-ink outline-none transition focus:border-gold"
                name="name"
                autoComplete="name"
              />
            </label>
            <label className="grid gap-3 text-xs uppercase tracking-luxe text-gold">
              {t.contact.email}
              <input
                className="h-12 border border-ink/12 bg-white px-4 text-sm normal-case tracking-normal text-ink outline-none transition focus:border-gold"
                type="email"
                name="email"
                autoComplete="email"
              />
            </label>
            <label className="grid gap-3 text-xs uppercase tracking-luxe text-gold">
              {t.contact.project}
              <textarea
                className="min-h-36 resize-y border border-ink/12 bg-white px-4 py-3 text-sm normal-case tracking-normal text-ink outline-none transition focus:border-gold"
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
