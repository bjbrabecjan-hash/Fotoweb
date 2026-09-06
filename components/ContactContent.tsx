"use client";

import { ExternalLink, Instagram, Mail, MapPin, Phone } from "lucide-react";
import { FormEvent, useRef, useState } from "react";
import { Button } from "@/components/Button";
import { Section } from "@/components/Section";
import { packageIds, packageLabels, type PackageId } from "@/lib/contactPackages";
import { useLanguage } from "@/lib/i18n";

export function ContactContent({ initialPackage }: { initialPackage?: PackageId }) {
  const { t, locale } = useLanguage();
  const [status, setStatus] = useState<{ type: "idle" | "sending" | "success" | "error"; message?: string }>({ type: "idle" });
  const startedAt = useRef(Date.now());
  const formRef = useRef<HTMLFormElement>(null);
  const submittingRef = useRef(false);
  const email = "fotohanabrabcova@gmail.com";
  const fieldClass = "min-h-12 rounded-none border border-ink/20 bg-white px-4 text-sm normal-case tracking-normal text-ink outline-none transition focus:border-gold focus-visible:ring-2 focus-visible:ring-gold/30";
  const c = locale === "cz" ? {
    package: "Typ focení / balíček", choose: "Vyberte nebo ponechte bez volby", date: "Preferovaný termín (volitelné)", datePlaceholder: "Např. říjen, víkend nebo konkrétní datum", sending: "Odesílám…", success: "Poptávku jsme úspěšně přijali.", genericError: "Poptávku se nepodařilo odeslat. Zkuste to znovu nebo použijte přímý e-mail.", required: "Povinné pole"
  } : {
    package: "Session / package", choose: "Choose or leave blank", date: "Preferred date (optional)", datePlaceholder: "For example October, a weekend or a specific date", sending: "Sending…", success: "Your inquiry has been accepted.", genericError: "The inquiry could not be sent. Try again or use the direct email link.", required: "Required field"
  };

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (submittingRef.current) return;
    const form = event.currentTarget;
    if (!form.reportValidity()) return;
    submittingRef.current = true;
    setStatus({ type: "sending" });
    const data = new FormData(form);
    try {
      const response = await fetch("/api/contact", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ name: data.get("name"), email: data.get("email"), packageId: data.get("packageId") || undefined, preferredDate: data.get("preferredDate"), message: data.get("message"), website: data.get("website"), startedAt: startedAt.current }) });
      const result = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(typeof result.error === "string" ? result.error : c.genericError);
      setStatus({ type: "success", message: c.success });
      formRef.current?.reset();
      startedAt.current = Date.now();
    } catch (error) { setStatus({ type: "error", message: error instanceof Error ? error.message : c.genericError }); }
    finally { submittingRef.current = false; }
  }

  return <Section className="min-h-screen pt-32 lg:pt-40"><div className="grid gap-12 lg:grid-cols-[.85fr_1.15fr]">
    <div><p className="mb-5 text-xs uppercase tracking-luxe text-gold">{t.contact.eyebrow}</p><h1 className="font-display text-5xl uppercase leading-none tracking-wider text-ink sm:text-7xl">{t.contact.title}</h1><p className="mt-8 max-w-xl text-base leading-8 text-ash">{t.contact.text}</p>
      <div className="mt-10 space-y-5 text-sm text-ash"><a className="flex items-center gap-4 rounded-sm transition hover:text-gold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold" href={`mailto:${email}`}><Mail size={18}/>{email}</a><a className="flex items-center gap-4 rounded-sm transition hover:text-gold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold" href="tel:+420734548996"><Phone size={18}/>734 548 996</a><a className="flex items-center gap-4 rounded-sm transition hover:text-gold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold" href="https://www.instagram.com/brabcovahana_content_/" target="_blank" rel="noreferrer"><Instagram size={18}/>@brabcovahana_content_</a><a className="flex items-center gap-4 rounded-sm transition hover:text-gold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold" href="https://www.facebook.com/profile.php?id=61579648302684" target="_blank" rel="noreferrer"><ExternalLink size={18}/>Facebook</a><p className="flex items-center gap-4"><MapPin size={18}/>{t.contact.location}</p></div>
    </div>
    <form ref={formRef} onSubmit={submit} className="border border-ink/10 bg-white/70 p-6 shadow-[0_24px_80px_rgba(38,37,34,.07)] sm:p-8" noValidate>
      <div className="grid gap-6"><label className="grid gap-2 text-xs uppercase tracking-luxe text-gold">{t.contact.name} <span className="sr-only">{c.required}</span><input className={fieldClass} name="name" autoComplete="name" required minLength={2} maxLength={100}/></label>
        <label className="grid gap-2 text-xs uppercase tracking-luxe text-gold">{t.contact.email} <span className="sr-only">{c.required}</span><input className={fieldClass} type="email" name="email" autoComplete="email" required maxLength={254}/></label>
        <label className="grid gap-2 text-xs uppercase tracking-luxe text-gold">{c.package}<select className={fieldClass} name="packageId" defaultValue={initialPackage ?? ""}><option value="">{c.choose}</option>{packageIds.map((id) => <option value={id} key={id}>{packageLabels[id][locale]}</option>)}</select></label>
        <label className="grid gap-2 text-xs uppercase tracking-luxe text-gold">{c.date}<input className={fieldClass} name="preferredDate" maxLength={120} placeholder={c.datePlaceholder}/></label>
        <label className="grid gap-2 text-xs uppercase tracking-luxe text-gold">{t.contact.project} <span className="sr-only">{c.required}</span><textarea className={`${fieldClass} min-h-40 resize-y py-3`} name="message" required minLength={10} maxLength={3000}/></label>
        <label className="sr-only" aria-hidden="true">Website<input tabIndex={-1} autoComplete="off" name="website"/></label>
        <Button type="submit" className="w-full" disabled={status.type === "sending"}>{status.type === "sending" ? c.sending : t.contact.submit}</Button>
        {status.type !== "idle" && status.type !== "sending" && <p role={status.type === "error" ? "alert" : "status"} className={status.type === "error" ? "text-sm text-red-700" : "text-sm text-green-800"}>{status.message}</p>}
      </div>
    </form>
  </div></Section>;
}
