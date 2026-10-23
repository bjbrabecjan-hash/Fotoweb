import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Obchodní podmínky fotografování",
  description: "Obchodní podmínky fotografování Hany Brabcové. Rezervace, platby, změny termínu a předání fotografií.",
  alternates: { canonical: "/obchodni-podminky" },
  openGraph: { url: "/obchodni-podminky", title: "Obchodní podmínky fotografování | Hana Brabcová" }
};

const linkClass = "break-words underline underline-offset-4 hover:text-gold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold";

export default function TermsPage() {
  return (
    <main lang="cs" className="px-5 pb-20 pt-32 sm:px-8 sm:pt-40">
      <article className="mx-auto max-w-3xl text-ink">
        <header className="mb-12 border-b border-ink/10 pb-8">
          <h1 className="font-display text-4xl leading-tight sm:text-6xl">Obchodní podmínky fotografování</h1>
          <p className="mt-6 text-lg">Hana Brabcová – fotografka</p>
          <div className="mt-5 space-y-2 text-sm leading-7">
            <p>IČO: 01793080</p>
            <p>Právní forma: Fyzická osoba podnikající dle živnostenského zákona</p>
            <p>Sídlo: Za nádražím 226, 742 01 Suchdol nad Odrou</p>
            <p>E-mail: <a href="mailto:fotohanabrabcova@gmail.com" className={linkClass}>fotohanabrabcova@gmail.com</a></p>
            <p>Telefon: <a href="tel:+420734548996" className={linkClass}>+420 734 548 996</a></p>
          </div>
        </header>
        <div className="space-y-10">
          <section aria-labelledby="terms-1">
            <h2 id="terms-1" className="mb-4 font-display text-3xl">1. Rezervace termínu</h2>
            <div className="space-y-3 text-base leading-8">
              <p>Termín focení je závazně rezervován po vzájemném potvrzení a uhrazení rezervační zálohy 1 000 Kč.</p>
              <p>Záloha je splatná do 3 dnů od zaslání platebních údajů a odečítá se z celkové ceny focení.</p>
              <p>Cena a rozsah fotografování jsou stanoveny předem při objednávce.</p>
            </div>
          </section>
          <section aria-labelledby="terms-2">
            <h2 id="terms-2" className="mb-4 font-display text-3xl">2. Platební podmínky</h2>
            <div className="space-y-3 text-base leading-8">
              <p>Doplatek za fotografování je splatný ihned po skončení focení, přímo na místě.</p>
              <p>Úhrada probíhá hotově nebo okamžitým bankovním převodem.</p>
              <p>Odložení splatnosti je možné pouze po předchozí výslovné dohodě s fotografkou.</p>
              <p>Případné fotografie nad rámec balíčku se hradí po jejich výběru, před předáním.</p>
              <p>Hotové fotografie jsou předávány výhradně po uhrazení celé sjednané ceny.</p>
            </div>
          </section>
          <section aria-labelledby="terms-3">
            <h2 id="terms-3" className="mb-4 font-display text-3xl">3. Změna a zrušení termínu</h2>
            <div className="space-y-3 text-base leading-8">
              <p>Změnu termínu z důvodu nemoci nebo nepříznivého počasí řešíme individuální domluvou.</p>
              <p>Při zrušení termínu klientem méně než 72 hodin před focením je sjednán storno poplatek 1 000 Kč, který se započítává proti uhrazené záloze. Pokud se podaří termín znovu obsadit, storno poplatek neúčtuji.</p>
              <p>Při zrušení focení ze strany fotografky bude nabídnut náhradní termín nebo vrácena zaplacená záloha.</p>
              <p>Tato pravidla neomezují zákonná práva spotřebitele na odstoupení od smlouvy.</p>
            </div>
          </section>
          <section aria-labelledby="terms-4">
            <h2 id="terms-4" className="mb-4 font-display text-3xl">4. Průběh fotografování</h2>
            <div className="space-y-3 text-base leading-8">
              <p>Fotografování probíhá v předem sjednaném rozsahu.</p>
              <p>Fotografka pracuje svým autorským stylem, se kterým se klient může předem seznámit v portfoliu.</p>
              <p>Klient odpovídá za přípravu a součinnost fotografovaných osob, včetně doprovodu dětí.</p>
            </div>
          </section>
          <section aria-labelledby="terms-5">
            <h2 id="terms-5" className="mb-4 font-display text-3xl">5. Výběr a předání fotografií</h2>
            <div className="space-y-3 text-base leading-8">
              <p>Fotografka provádí výběr a autorské zpracování snímků.</p>
              <p>Termín dodání je sdělen při objednávce.</p>
              <p>Fotografie jsou předávány elektronicky ve formátu JPG. Neupravené fotografie a soubory RAW nejsou součástí zakázky.</p>
              <p>Klient může fotografie používat pro osobní účely. Komerční použití vyžaduje samostatnou dohodu. Dodatečné úpravy a použití filtrů bez souhlasu fotografky nejsou povoleny.</p>
            </div>
          </section>
          <section aria-labelledby="terms-6">
            <h2 id="terms-6" className="mb-4 font-display text-3xl">6. Zveřejňování fotografií</h2>
            <div className="space-y-3 text-base leading-8">
              <p>Soukromí klientů plně respektuji.</p>
              <p>Fotografie používám k vlastní propagaci pouze s příslušným souhlasem fotografovaných osob, případně jejich zákonných zástupců.</p>
            </div>
          </section>
          <section aria-labelledby="terms-7">
            <h2 id="terms-7" className="mb-4 font-display text-3xl">7. Reklamace a práva spotřebitele</h2>
            <div className="space-y-3 text-base leading-8">
              <p>Reklamace lze uplatnit prostřednictvím uvedeného e-mailu a jsou vyřizovány v souladu s platnými právními předpisy.</p>
              <p>U smluv uzavřených na dálku má spotřebitel zákonné právo odstoupit od smlouvy, pokud se neuplatní zákonná výjimka. Podrobné poučení o odstoupení je poskytováno před uzavřením smlouvy.</p>
              <p>Případné spotřebitelské spory lze řešit prostřednictvím České obchodní inspekce: <a href="https://coi.gov.cz/informace-o-adr/" className={linkClass}>https://coi.gov.cz/informace-o-adr/</a>.</p>
            </div>
          </section>
          <section aria-labelledby="terms-8">
            <h2 id="terms-8" className="mb-4 font-display text-3xl">8. Závěrečná ustanovení</h2>
            <div className="space-y-3 text-base leading-8">
              <p>Klient je s obchodními podmínkami seznámen před potvrzením objednávky. Individuální písemná dohoda má přednost před těmito podmínkami.</p>
            </div>
          </section>
        </div>
        <p className="mt-12 border-t border-ink/10 pt-6 text-sm">Platnost od: <time dateTime="2026-01-01">1. 1. 2026</time></p>
      </article>
    </main>
  );
}
