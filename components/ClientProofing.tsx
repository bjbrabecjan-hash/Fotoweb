"use client";

/* eslint-disable @next/next/no-img-element -- Private, already resized previews must use the authenticated no-store endpoint directly. */

import { useEffect, useState } from "react";
import { ArrowRight, Check, CheckCircle2, ChevronLeft, ChevronRight, Heart, ImageIcon, LockKeyhole, Send, X } from "lucide-react";
import type { ProofAlbum } from "@/lib/proofing-types";
import { ErrorNotice, photoUrl, proofDate, ProofDialog, proofRequest, ProofShell } from "./ProofingShared";

export function ClientProofing() {
  const [album, setAlbum] = useState<ProofAlbum | null>(null);
  const [code, setCode] = useState("");
  const [note, setNote] = useState("");
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [onlySelected, setOnlySelected] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);
  const [confirm, setConfirm] = useState(false);
  const [saved, setSaved] = useState(false);
  useEffect(() => {
    fetch("/api/proofing/gallery", { cache: "no-store" }).then(async response => {
      const result = await response.json();
      if (response.ok) { setAlbum(result.album); setNote(result.album.note); setOnlySelected(result.album.status === "submitted"); }
      else if (response.status !== 401) setError(result.error);
    }).catch(() => setError("Spojení se nepodařilo. Obnovte prosím stránku.")).finally(() => setLoading(false));
  }, []);
  useEffect(() => {
    if (!album || album.status !== "open" || note === album.note) return;
    const warn = (event: BeforeUnloadEvent) => { event.preventDefault(); event.returnValue = ""; };
    window.addEventListener("beforeunload", warn);
    return () => window.removeEventListener("beforeunload", warn);
  }, [album, note]);

  async function login(event: React.FormEvent) {
    event.preventDefault(); setBusy(true); setError("");
    try { const result = await proofRequest("login", { code }); setAlbum(result.album); setNote(result.album.note); setOnlySelected(result.album.status === "submitted"); setCode(""); }
    catch (error) { setError((error as Error).message); }
    finally { setBusy(false); }
  }
  async function persist(selected: string[], submit = false) {
    if (!album || busy) return;
    setBusy(true); setError(""); setSaved(false);
    try {
      const result = await proofRequest(submit ? "submit" : "save", { selected, note, revision: album.revision });
      setAlbum(result.album); setSaved(true); if (submit) { setConfirm(false); setOnlySelected(true); }
    } catch (error) { setError((error as Error).message); }
    finally { setBusy(false); }
  }
  function toggle(id: string) {
    if (album) void persist(album.selected.includes(id) ? album.selected.filter(item => item !== id) : [...album.selected, id]);
  }
  async function logout() {
    try { await proofRequest("logout", {}); setAlbum(null); setNote(""); setError(""); setOnlySelected(false); setSaved(false); }
    catch (error) { setError((error as Error).message); }
  }

  if (!album) return <ProofShell>
    <div className="pf-entry">
      <div className="pf-entry-story"><p className="pf-eyebrow">Jen pro vás</p><h1>Vaše příběhy.<br /><em>Váš výběr.</em></h1><p>Ty nejhezčí vzpomínky si zaslouží vaši pozornost. Pohodlně se usaďte a vyberte fotografie, které jsou vám nejbližší.</p><div className="pf-entry-detail"><span>01 / Otevřete galerii</span><span>02 / Vyberte si</span><span>03 / Odešlete Hance</span></div></div>
      <form className="pf-entry-card" onSubmit={login}><div className="pf-lock"><LockKeyhole size={24} strokeWidth={1.4} /></div><p className="pf-eyebrow">Pro klienty</p><h2>Vstup do galerie</h2><p>Přístupový kód najdete ve zprávě od Hanky.</p><label className="pf-label" htmlFor="gallery-code">Váš přístupový kód</label><input id="gallery-code" className="pf-input pf-code-input" placeholder="Zadejte svůj kód" value={code} onChange={event => setCode(event.target.value)} required maxLength={80} autoComplete="off" autoCapitalize="characters" spellCheck={false} disabled={loading || busy} /><ErrorNotice message={error} /><button className="pf-button" disabled={loading || busy}>{loading ? "Načítám…" : busy ? "Otevírám…" : "Otevřít moji galerii"}<ArrowRight size={17} /></button><small>Galerie je soukromá. Přístup má každý, komu svůj kód předáte.</small></form>
    </div>
  </ProofShell>;

  const submitted = album.status === "submitted";
  const photos = onlySelected ? album.photos.filter(photo => album.selected.includes(photo.id)) : album.photos;
  const current = album.photos.find(photo => photo.id === preview);
  function move(direction: number) {
    const index = photos.findIndex(photo => photo.id === preview);
    if (photos.length) setPreview(photos[(index + direction + photos.length) % photos.length].id);
  }
  return <ProofShell logout={logout}>
    <div className="pf-gallery-heading"><p className="pf-eyebrow">Soukromá galerie / {album.clientName}</p><h1>{album.title}</h1><p>{album.message || "Prohlédněte si fotografie a srdíčkem označte ty, které si přejete zpracovat."}</p><span className="pf-expiry">Galerie je dostupná do {proofDate(album.expiresAt)}</span></div>
    {submitted && <div className="pf-success" role="status"><CheckCircle2 size={24} /><div><strong>Výběr je u Hanky. Děkuji!</strong><p>Odesláno dne {proofDate(album.submittedAt!)} · Počet fotografií: {album.selected.length}. Pokud potřebujete výběr změnit, napište mi.</p></div></div>}
    <div className="pf-gallery-toolbar"><div className="pf-tabs"><button aria-pressed={!onlySelected} onClick={() => setOnlySelected(false)}>Všechny fotografie <span>{album.photos.length}</span></button><button aria-pressed={onlySelected} onClick={() => setOnlySelected(true)}><Heart size={15} /> Můj výběr <span>{album.selected.length}</span></button></div><span className="pf-save-status" role="status">{submitted ? "Výběr byl odeslán" : busy ? "Ukládám…" : saved ? "Uloženo" : "Výběr se ukládá průběžně"}</span></div>
    <ErrorNotice message={error} />
    {!photos.length ? <div className="pf-empty"><ImageIcon size={32} /><h2>{album.photos.length ? "Tady budou vaše oblíbené." : "Vaše fotografie se připravují."}</h2><p>{album.photos.length ? "Označte fotky srdíčkem a najdete je na jednom místě." : "Hanka do této galerie brzy nahraje náhledy."}</p>{onlySelected && <button className="pf-button pf-secondary" onClick={() => setOnlySelected(false)}>Prohlédnout všechny fotografie</button>}</div> :
      <div className="pf-photo-grid">{photos.map((photo, index) => {
        const selected = album.selected.includes(photo.id);
        return <article className={`pf-photo ${selected ? "is-selected" : ""}`} key={photo.id}><button className="pf-photo-open" onClick={() => setPreview(photo.id)} aria-label={`Zvětšit ${photo.name}`}><img src={photoUrl(album, photo.id)} width={photo.width} height={photo.height} alt={photo.name} loading={index < 4 ? "eager" : "lazy"} draggable={false} /></button><div className="pf-photo-caption"><span title={photo.name}>{photo.name}</span><button className="pf-heart" disabled={busy || submitted} onClick={() => toggle(photo.id)} aria-label={`${selected ? "Odebrat" : "Vybrat"} ${photo.name}`} aria-pressed={selected}><Heart size={20} fill={selected ? "currentColor" : "none"} /></button></div></article>;
      })}</div>}
    <section className="pf-note"><div><p className="pf-eyebrow">Malý vzkaz</p><h2>Chcete mi něco napsat?</h2><p>Třeba která fotografie je pro vás obzvlášť důležitá.</p></div><div><label className="pf-sr-only" htmlFor="client-note">Poznámka k výběru</label><textarea id="client-note" className="pf-input" value={note} onChange={event => { setNote(event.target.value); setSaved(false); }} onBlur={event => {
      // Do not disable the very button that the user is about to click.
      // Selecting a photo or confirming the selection includes the note too.
      if (event.relatedTarget instanceof HTMLButtonElement) return;
      if (!submitted && note !== album.note) void persist(album.selected);
    }} maxLength={2000} disabled={submitted || busy} placeholder="Váš vzkaz pro Hanku (nepovinné)" /><small>{note.length} / 2 000{!submitted && note !== album.note ? " · Vzkaz se uloží také při odeslání výběru" : ""}</small></div></section>
    {!submitted && <div className="pf-selection-bar"><div><Heart size={22} /><span>Vybrané fotografie: <strong>{album.selected.length}</strong><small>Spokojeni s výběrem? Pošlete mi ho ke zpracování.</small></span></div><button className="pf-button" disabled={busy || !album.selected.length} onClick={() => setConfirm(true)}>Dokončit výběr <ArrowRight size={17} /></button></div>}
    {current && <ProofDialog label={`Náhled ${current.name}`} close={() => setPreview(null)}><div className="pf-lightbox" onKeyDown={event => { if (event.key === "ArrowLeft") move(-1); if (event.key === "ArrowRight") move(1); }}><button autoFocus className="pf-lightbox-close pf-icon-button" aria-label="Zavřít náhled" onClick={() => setPreview(null)}><X /></button><img src={photoUrl(album, current.id)} alt={current.name} /><div className="pf-lightbox-controls"><button className="pf-icon-button" aria-label="Předchozí fotografie" onClick={() => move(-1)}><ChevronLeft /></button><span>{current.name}</span><button className="pf-icon-button" aria-label="Další fotografie" onClick={() => move(1)}><ChevronRight /></button><button className="pf-button" disabled={busy || submitted} onClick={() => toggle(current.id)}>{album.selected.includes(current.id) ? <Check size={17} /> : <Heart size={17} />}{album.selected.includes(current.id) ? "Vybráno" : "Vybrat"}</button></div><ErrorNotice message={error} /></div></ProofDialog>}
    {confirm && <ProofDialog label="Potvrzení výběru" close={() => { if (!busy) setConfirm(false); }}><div className="pf-confirm"><Send size={30} /><h2>Všechno vybráno?</h2><p>Hance odešlete výběr {album.selected.length} fotografií{note ? " a svůj vzkaz" : ""}. Potom už výběr upraví pouze po domluvě s vámi.</p><ErrorNotice message={error} /><button className="pf-button" disabled={busy} onClick={() => void persist(album.selected, true)}>{busy ? "Odesílám…" : "Odeslat výběr Hance"}<ArrowRight size={17} /></button><button autoFocus className="pf-text-button" disabled={busy} onClick={() => setConfirm(false)}>Ještě si fotky projdu</button></div></ProofDialog>}
  </ProofShell>;
}
