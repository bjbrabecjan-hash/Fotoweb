"use client";

import { useLanguage } from "@/lib/i18n";
import "./Testimonials.css";

export function Testimonials() {
 const { locale } = useLanguage();
 const cz = locale === "cz";
 return (
<section id="recenze" className="hanaReviews" aria-labelledby="reviews-title" data-motion="true">
 <div className="hr-inner">
  <p className="hr-kicker">{cz ? "Vaše slova" : "Your words"}</p>
  <h2 id="reviews-title">{cz ? <>Jak se vám<br />se mnou <em>fotilo.</em></> : <>Your moments.<br /><em>Your words.</em></>}</h2>
  <p className="hr-intro">{cz ? "Nejhezčí zprávy přicházejí od vás." : "The loveliest messages come from you. Reviews in their original Czech."}</p>
  <div className="hr-grid">
    <figure lang="cs" className="hr-featured">
      <span className="hr-quote" aria-hidden="true">“</span>
      <blockquote>Dokázala zastavit čas a my si teď můžeme dokola prožívat tu lásku. Focení bylo rychlé, přátelské a nenucené. Atmosféra nás nechala být sami sebou. Upřímně doporučuji.</blockquote>
      <figcaption>Patka</figcaption>
    </figure>
    <figure lang="cs" className="hr-note">
      <span className="hr-quote" aria-hidden="true">“</span>
      <blockquote>Všechno super, paní moc hodná, fotky jsou nádherné a máme krásnou vzpomínku. Děkujeme moc. 🌹</blockquote>
      <figcaption>Eliška</figcaption>
    </figure>
    <figure lang="cs" className="hr-note">
      <span className="hr-quote" aria-hidden="true">“</span>
      <blockquote>Krásné fotečky, mockrát děkujeme. Paní byla moc hodná a profesionální. Vřele doporučuji. 10/10</blockquote>
      <figcaption>Maty</figcaption>
    </figure>
  </div>
  <details className="hr-more">
    <summary>{cz ? "Další zkušenosti" : "More experiences"}</summary>
    <div className="hr-extra">
      <figure lang="cs">
        <span className="hr-quote" aria-hidden="true">“</span>
        <blockquote>Fotky jsou nádherné, úplně všechny, a máme i krásné video jako vzpomínku na celý život. Byla jsem mile překvapená – ještě lepší, než jsme si představovali. Příjemná atmosféra, všechno nenucené a přístup super.</blockquote>
        <figcaption>Patka</figcaption>
      </figure>
      <figure lang="cs">
        <span className="hr-quote" aria-hidden="true">“</span>
        <blockquote>Vřele doporučuji, od domluvy po provedení! ❤️</blockquote>
        <figcaption>Kristýna</figcaption>
      </figure>
      <figure lang="cs">
        <span className="hr-quote" aria-hidden="true">“</span>
        <blockquote>Skvělý zážitek. Hanka mi ukázala, jak správně nastavit fotoaparát v mobilu, a konečně vím, jak správně fotit na sociální sítě. Velké díky!</blockquote>
        <figcaption>Tony</figcaption>
        <p className="hr-tag">Focení mobilem a sociální sítě</p>
      </figure>
    </div>
  </details>
  <div className="hr-footer"><span>{cz ? "RODINNÉ PŘÍBĚHY · SKUTEČNÉ VZPOMÍNKY" : "FAMILY STORIES · REAL MEMORIES"}</span><span className="hr-sign">Hana Brabcová</span></div>
</div>
</section>
 );
}
