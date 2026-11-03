"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import type { StoredFeedback } from "@/lib/review-types";
import { proofDate, proofRequest } from "./ProofingShared";

const mailLabels = { pending: "E-mail čeká na odeslání", sent: "E-mail převzala služba", failed: "E-mail se nepodařilo odeslat", unconfigured: "E-mail není nastavený" };
export function AdminReviews() {
  const [reviews, setReviews] = useState<StoredFeedback[]>([]);
  const [offset, setOffset] = useState(0);
  const [hasMore, setHasMore] = useState(false);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState<string | null>(null);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  async function load(nextOffset = offset) {
    setLoading(true); setError("");
    try { const result = await proofRequest(`admin/reviews?offset=${nextOffset}`); setReviews(result.reviews); setHasMore(result.hasMore); setOffset(nextOffset); }
    catch (error) { setError((error as Error).message); }
    finally { setLoading(false); }
  }
  useEffect(() => { void load(0); /* Load only when opening the authenticated panel. */ }, []); // eslint-disable-line react-hooks/exhaustive-deps
  async function act(row: StoredFeedback, action: "publish" | "hide" | "notify") {
    setBusy(row.id); setError(""); setMessage("");
    try {
      const result = await proofRequest("admin/reviews", { id: row.id, action });
      setReviews(items => items.map(item => item.id === row.id ? result.review : item));
      setMessage(action === "publish" ? "Recenze je zveřejněná na úvodní stránce." : action === "hide" ? "Recenze je stažená z webu." : mailLabels[result.review.notification as StoredFeedback["notification"]]);
    } catch (error) { setError((error as Error).message); }
    finally { setBusy(null); }
  }
  return <section aria-label="Recenze klientů" className="space-y-5">
    <div className="pf-detail-heading"><div><h2>Recenze a souhlasy</h2><p>Po kliknutí na Zveřejnit se recenze objeví mezi recenzemi na úvodní stránce. Souhlas s fotografiemi se posuzuje zvlášť.</p></div><button className="pf-button pf-secondary" disabled={loading || !!busy} onClick={() => void load()}>Obnovit</button></div>
    <p><Link href="/dotaznik" className="pf-text-button">Otevřít dotazník pro klienty</Link> · <Link href="/#recenze" className="pf-text-button">Recenze na webu</Link></p>
    {error && <p role="alert" className="pf-error">{error}</p>}{message && <p role="status">{message}</p>}
    {loading ? <p role="status">Načítám odpovědi…</p> : !reviews.length && !error ? <p className="pf-empty">Zatím tu nejsou žádné nové odpovědi. Starší recenze zaslané pouze e-mailem se sem automaticky nepřenášejí.</p> : reviews.map(row => {
      const canPublish = row.data.reviewConsent === "yes" && !!row.data.review.trim();
      return <article key={row.id} className="border border-ink/15 bg-white p-5 sm:p-7">
        <div className="pf-detail-heading"><div><h3 className="text-xl">{row.data.name}</h3><p>{proofDate(row.received_at)} · {row.data.session || "Focení neuvedeno"}</p></div><span className="pf-status">{row.published_at ? "Zveřejněno" : canPublish ? "Čeká na schválení" : "Soukromá odpověď"}</span></div>
        <blockquote className="my-5 whitespace-pre-wrap break-words text-base leading-7">{row.data.review || "Bez recenze — klient vyplnil pouze souhlasy."}</blockquote>
        <p className="text-sm">Fotografie: <strong>{row.data.photoConsent === "yes" ? "souhlasí" : "nesouhlasí"}</strong> · Recenze se jménem: <strong>{row.data.reviewConsent === "yes" ? "souhlasí" : "nesouhlasí"}</strong></p>
        <details className="my-4 text-sm"><summary className="cursor-pointer">Znění zaznamenaných souhlasů</summary><p className="mt-3">{row.data.photoConsentText}</p><p className="mt-2">{row.data.reviewConsentText}</p><p className="mt-2">Verze {row.data.consentVersion}. Totožnost odesílatele formuláře není ověřená.</p></details>
        <div className="flex flex-wrap items-center gap-4">
          {row.published_at ? <button className="pf-button pf-secondary" disabled={!!busy} onClick={() => void act(row, "hide")}>Stáhnout z webu</button> : <button className="pf-button" disabled={!!busy || !canPublish} onClick={() => void act(row, "publish")}>Zveřejnit na webu</button>}
          {!canPublish && <span className="text-sm">{row.data.reviewConsent !== "yes" ? "Klient nedal souhlas ke zveřejnění recenze." : "Není vyplněný text recenze."}</span>}
          <span className="text-sm">{mailLabels[row.notification]}</span>
          {row.notification !== "sent" && <button className="pf-text-button" disabled={!!busy} onClick={() => void act(row, "notify")}>Zkusit e-mail znovu</button>}
        </div>
      </article>;
    })}
    <div className="flex gap-4"><button className="pf-text-button" disabled={loading || !!busy || offset === 0} onClick={() => void load(Math.max(0, offset - 50))}>Novější odpovědi</button><button className="pf-text-button" disabled={loading || !!busy || !hasMore} onClick={() => void load(offset + 50)}>Starší odpovědi</button></div>
  </section>;
}
