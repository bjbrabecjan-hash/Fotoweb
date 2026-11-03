"use client";

import { useRef, useState, type FormEvent } from "react";
import { Button } from "@/components/Button";
import { Section } from "@/components/Section";
import { photoConsentText, reviewConsentText } from "@/lib/feedback";

const fieldClass = "w-full border border-ink/20 bg-white px-4 py-3 text-base text-ink outline-none focus:border-gold focus:ring-1 focus:ring-gold";

function Consent({ name, title, text }: { name: string; title: string; text: string }) {
  return <fieldset className="space-y-4 border-t border-ink/10 pt-6">
    <legend className="float-left mb-3 w-full font-display text-2xl text-ink">{title}</legend>
    <p className="clear-both text-sm leading-6 text-ash" id={`${name}-description`}>{text}</p>
    <div className="grid gap-3 sm:grid-cols-2">
      {[{ value: "yes", label: "Ano, souhlasím" }, { value: "no", label: "Ne, nesouhlasím" }].map(option => <label key={option.value} className="flex min-h-12 cursor-pointer items-center gap-3 border border-ink/15 bg-white p-4 text-sm text-ink has-[:checked]:border-gold has-[:checked]:bg-gold/5">
        <input type="radio" name={name} value={option.value} required aria-describedby={`${name}-description`} className="h-4 w-4 accent-[#957044]" />{option.label}
      </label>)}
    </div>
  </fieldset>;
}

export function FeedbackForm() {
  const [state, setState] = useState<"idle" | "sending" | "sent">("idle");
  const [error, setError] = useState("");
  const submission = useRef<{ content: string; id: string; submittedAt: string } | null>(null);
  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (state === "sending") return;
    const form = new FormData(event.currentTarget);
    const values = Object.fromEntries(form.entries());
    const content = JSON.stringify(values);
    if (submission.current?.content !== content) submission.current = { content, id: crypto.randomUUID(), submittedAt: new Date().toISOString() };
    setState("sending"); setError("");
    try {
      const response = await fetch("/api/feedback", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ ...values, submissionId: submission.current!.id, submittedAt: submission.current!.submittedAt }), signal: AbortSignal.timeout(20000) });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || "Odeslání se nepodařilo.");
      setState("sent");
    } catch (error) {
      setError(error instanceof Error && error.name !== "TimeoutError" && error.name !== "TypeError" ? error.message : "Odeslání se nepodařilo potvrdit. Zkontrolujte připojení a zkuste to znovu.");
      setState("idle");
    }
  }
  return <Section className="min-h-screen pt-32 lg:pt-40" contentClassName="max-w-3xl">
    <p className="mb-5 text-xs uppercase tracking-luxe text-gold">Chvilka po focení</p>
    <h1 className="font-display text-5xl leading-none text-ink sm:text-7xl">Jak se vám líbilo focení?</h1>
    <p className="mb-10 mt-6 max-w-xl leading-8 text-ash">Děkuji za společné chvíle před objektivem. Budu ráda za pár slov o vašem zážitku. Zároveň mi prosím dejte vědět, zda mohu fotografie a vaši recenzi sdílet.</p>
    {state === "sent" ? <div role="status" className="border border-gold/40 bg-white/70 p-8"><h2 className="font-display text-4xl text-ink">Děkuji za vaši odpověď.</h2><p className="mt-4 leading-7 text-ash">Dotazník byl odeslán Hance. Vaše rozhodnutí o zveřejnění budu respektovat.</p></div> : <form onSubmit={submit} className="space-y-7 border border-ink/10 bg-white/65 p-5 shadow-[0_24px_80px_rgba(38,37,34,0.07)] sm:p-9" aria-busy={state === "sending"}>
      <label className="grid gap-2 text-sm text-ink">Vaše jméno <span className="sr-only">(povinné)</span><input name="name" autoComplete="name" required maxLength={150} className={fieldClass} /></label>
      <label className="grid gap-2 text-sm text-ink">Které focení? <span className="text-xs text-ash">Nepovinné — například rodinné focení v říjnu, abych věděla, kterých fotografií se odpověď týká.</span><input name="session" maxLength={200} className={fieldClass} /></label>
      <Consent name="photoConsent" title="Zveřejnění fotografií" text={photoConsentText} />
      <label className="grid gap-2 text-sm text-ink">Vaše recenze <span className="text-xs text-ash">Nepovinná — co vám udělalo radost a co mohu příště zlepšit?</span><textarea name="review" maxLength={5000} rows={5} className={`${fieldClass} resize-y`} /></label>
      <Consent name="reviewConsent" title="Zveřejnění recenze se jménem" text={reviewConsentText} />
      <p className="text-sm leading-6 text-ash">Obě rozhodnutí jsou samostatná a dobrovolná. Nesouhlas nemá vliv na předání fotografií. Pokud souhlasíte, můžete své rozhodnutí později změnit zprávou na <a className="underline underline-offset-4" href="mailto:fotohanabrabcova@gmail.com">fotohanabrabcova@gmail.com</a>.</p>
      <p className="text-xs leading-6 text-ash">Odpovědi se odešlou e-mailem Haně Brabcové pro vyřízení zpětné vazby a zaznamenání vaší volby. Zveřejnění probíhá ručně podle vašich odpovědí. Údaje ostatních osob do recenze prosím neuvádějte.</p>
      <div hidden aria-hidden="true"><label>Web<input name="website" tabIndex={-1} autoComplete="off" /></label></div>
      {error && <p role="alert" className="border border-red-200 bg-red-50 p-4 text-sm leading-6 text-red-800">{error}</p>}
      <Button type="submit" disabled={state === "sending"} className="w-full disabled:cursor-wait disabled:opacity-60">{state === "sending" ? "Odesílám…" : "Odeslat Hance"}</Button>
    </form>}
  </Section>;
}
