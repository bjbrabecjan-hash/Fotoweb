"use client";

import { ExternalLink, Instagram, Mail, MapPin, MessageCircle, Phone } from "lucide-react";
import type { ReactNode } from "react";
import { Button } from "@/components/Button";
import { Section } from "@/components/Section";
import { packageLabels, type PackageId } from "@/lib/contactPackages";
import { useLanguage } from "@/lib/i18n";

const email = "fotohanabrabcova@gmail.com";
const phone = "+420734548996";
const instagramUrl = "https://www.instagram.com/brabcovahana_content_/";
const messengerUrl = "https://m.me/61579648302684";

export function ContactContent({ initialPackage }: { initialPackage?: PackageId }) {
  const { t, locale } = useLanguage();
  const selectedPackage = initialPackage ? packageLabels[initialPackage][locale] : undefined;
  const c = locale === "cz" ? {
    eyebrow: "Vyberte si, kde vám to vyhovuje",
    title: "Napište mi přímo",
    text: "Žádný formulář a žádné čekání, jestli zpráva dorazila. Ozvěte se kanálem, který běžně používáte.",
    selected: "Vaše vybrané focení",
    email: "Napsat e-mail",
    emailText: "Otevře váš e-mail s předvyplněným předmětem a zprávou.",
    instagram: "Napsat na Instagramu",
    instagramText: "Přejdete na profil, kde můžete poslat soukromou zprávu.",
    messenger: "Napsat přes Messenger",
    messengerText: "Otevře se přímá konverzace na Facebook Messengeru.",
    phone: "Zavolat",
    phoneText: "Pokud je pro vás jednodušší domluvit se telefonicky.",
    fallback: "Pokud se e-mailový program neotevře, napište ručně na",
    subject: selectedPackage ? `Poptávka focení – ${selectedPackage}` : "Poptávka focení z webu",
    body: `Dobrý den,\n\nmám zájem o focení${selectedPackage ? `: ${selectedPackage}` : ""}.\n\nPreferovaný termín:\n\nMoje zpráva:\n\nDěkuji.`
  } : {
    eyebrow: "Choose what suits you",
    title: "Message me directly",
    text: "No form and no uncertainty about delivery. Get in touch through the channel you already use.",
    selected: "Your selected session",
    email: "Send an email",
    emailText: "Opens your email app with a prepared subject and message.",
    instagram: "Message on Instagram",
    instagramText: "Opens the profile where you can send a private message.",
    messenger: "Message on Messenger",
    messengerText: "Opens a direct conversation in Facebook Messenger.",
    phone: "Call",
    phoneText: "For arranging the details by phone.",
    fallback: "If your email app does not open, write directly to",
    subject: selectedPackage ? `Photography inquiry – ${selectedPackage}` : "Photography inquiry from the website",
    body: `Hello,\n\nI am interested in a photography session${selectedPackage ? `: ${selectedPackage}` : ""}.\n\nPreferred date:\n\nMy message:\n\nThank you.`
  };
  const mailHref = `mailto:${email}?subject=${encodeURIComponent(c.subject)}&body=${encodeURIComponent(c.body)}`;

  return <Section className="min-h-screen pt-32 lg:pt-40"><div className="grid gap-12 lg:grid-cols-[.85fr_1.15fr] lg:items-start">
    <div><p className="mb-5 text-xs uppercase tracking-luxe text-gold">{t.contact.eyebrow}</p><h1 className="font-display text-5xl uppercase leading-none tracking-wider text-ink sm:text-7xl">{t.contact.title}</h1><p className="mt-8 max-w-xl text-base leading-8 text-ash">{t.contact.text}</p>
      <div className="mt-10 space-y-5 text-sm text-ash"><a className="flex items-center gap-4 rounded-sm transition hover:text-gold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold" href={`mailto:${email}`}><Mail size={18}/>{email}</a><a className="flex items-center gap-4 rounded-sm transition hover:text-gold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold" href={`tel:${phone}`}><Phone size={18}/>734 548 996</a><p className="flex items-center gap-4"><MapPin size={18}/>{t.contact.location}</p></div>
    </div>
    <div className="border border-ink/10 bg-white/70 p-6 shadow-[0_24px_80px_rgba(38,37,34,.07)] sm:p-8">
      <p className="text-xs uppercase tracking-luxe text-gold">{c.eyebrow}</p><h2 className="mt-4 font-display text-4xl leading-none text-ink sm:text-5xl">{c.title}</h2><p className="mt-5 max-w-2xl text-sm leading-7 text-ash">{c.text}</p>
      {selectedPackage && <div className="mt-7 border-l-2 border-gold bg-[#eef0eb] px-5 py-4"><p className="text-[.62rem] font-semibold uppercase tracking-luxe text-gold">{c.selected}</p><p className="mt-2 text-sm font-semibold text-ink">{selectedPackage}</p></div>}
      <Button href={mailHref} className="mt-8 w-full gap-3"><Mail size={18}/>{c.email}</Button><p className="mt-3 text-xs leading-6 text-ash">{c.emailText}</p>
      <div className="mt-7 grid gap-4 sm:grid-cols-2">
        <ContactOption href={instagramUrl} icon={<Instagram size={22}/>} title={c.instagram} text={c.instagramText}/>
        <ContactOption href={messengerUrl} icon={<MessageCircle size={22}/>} title={c.messenger} text={c.messengerText}/>
        <ContactOption href={`tel:${phone}`} icon={<Phone size={22}/>} title={c.phone} text={c.phoneText} external={false}/>
      </div>
      <p className="mt-7 border-t border-ink/10 pt-5 text-xs leading-6 text-ash">{c.fallback} <a className="font-semibold text-ink underline decoration-gold underline-offset-4" href={`mailto:${email}`}>{email}</a>.</p>
    </div>
  </div></Section>;
}

function ContactOption({ href, icon, title, text, external = true }: { href: string; icon: ReactNode; title: string; text: string; external?: boolean }) {
  return <a href={href} target={external ? "_blank" : undefined} rel={external ? "noreferrer" : undefined} className="group flex min-h-40 flex-col border border-ink/15 bg-white p-5 transition hover:border-gold hover:shadow-[0_14px_40px_rgba(38,37,34,.08)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold"><span className="flex items-center justify-between text-gold">{icon}{external && <ExternalLink size={15}/>}</span><span className="mt-5 text-sm font-semibold text-ink group-hover:text-gold">{title}</span><span className="mt-2 text-xs leading-6 text-ash">{text}</span></a>;
}
