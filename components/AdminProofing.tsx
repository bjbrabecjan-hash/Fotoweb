"use client";

/* eslint-disable @next/next/no-img-element -- Private, already resized previews must use the authenticated no-store endpoint directly. */

import { useEffect, useState } from "react";
import { ArrowRight, Check, Copy, Download, FolderPlus, Heart, Images, LockKeyhole, Plus, RefreshCw, Upload, X } from "lucide-react";
import type { ProofAlbum } from "@/lib/proofing-types";
import { ErrorNotice, photoUrl, proofDate, ProofDialog, proofRequest, ProofShell } from "./ProofingShared";

async function makePreview(file: File) {
  if (file.size > 30 * 1024 * 1024) throw new Error(`${file.name}: soubor je větší než 30 MB.`);
  const image = await createImageBitmap(file);
  try {
    const scale = Math.min(1, 1800 / Math.max(image.width, image.height));
    const canvas = document.createElement("canvas");
    canvas.width = Math.max(1, Math.round(image.width * scale));
    canvas.height = Math.max(1, Math.round(image.height * scale));
    const context = canvas.getContext("2d");
    if (!context) throw new Error("Prohlížeč neumí připravit náhled.");
    context.fillStyle = "#ffffff"; context.fillRect(0, 0, canvas.width, canvas.height);
    context.drawImage(image, 0, 0, canvas.width, canvas.height);
    context.save(); context.translate(canvas.width / 2, canvas.height / 2); context.rotate(-Math.PI / 8);
    context.font = `${Math.max(18, canvas.width / 26)}px Georgia`;
    context.textAlign = "center"; context.fillStyle = "rgba(255,255,255,.63)";
    context.shadowColor = "rgba(0,0,0,.45)"; context.shadowBlur = 3;
    for (const y of [-canvas.height * .25, 0, canvas.height * .25]) context.fillText("Hana Brabcová · NÁHLED", 0, y);
    context.restore();
    const blob = await new Promise<Blob>((resolve, reject) => canvas.toBlob(value => value ? resolve(value) : reject(new Error("Náhled se nepodařilo vytvořit.")), "image/jpeg", .82));
    return { blob, width: canvas.width, height: canvas.height };
  } finally { image.close(); }
}

const notificationLabels: Record<ProofAlbum["notification"], string> = {
  none: "Výběr zatím nebyl odeslaný", pending: "Upozornění čeká na odeslání", sent: "Upozornění převzala e-mailová služba", failed: "Upozornění se nepodařilo odeslat", unconfigured: "E-mail není nastavený — výběr je bezpečně uložený"
};
const statusLabels = { open: "Otevřená", submitted: "Výběr odeslán", archived: "Archivovaná" };

export function AdminProofing() {
  const [loggedIn, setLoggedIn] = useState(false);
  const [loading, setLoading] = useState(true);
  const [password, setPassword] = useState("");
  const [albums, setAlbums] = useState<ProofAlbum[]>([]);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [mailConfigured, setMailConfigured] = useState(false);
  const [mailTestResult, setMailTestResult] = useState("");
  const [create, setCreate] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [progress, setProgress] = useState("");
  const [share, setShare] = useState<{ id: string; code: string } | null>(null);
  const [copied, setCopied] = useState(false);
  const [selectedOnly, setSelectedOnly] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);
  const [action, setAction] = useState<"archive" | "reopen" | "rotate" | "delete" | null>(null);
  const [deleteTitle, setDeleteTitle] = useState("");
  const album = albums.find(item => item.id === activeId);
  async function refresh() {
    const result = await proofRequest("admin");
    setAlbums(result.albums); setMailConfigured(result.mailConfigured); setLoggedIn(true);
  }
  useEffect(() => {
    fetch("/api/proofing/admin", { cache: "no-store" }).then(async response => {
      const result = await response.json();
      if (response.ok) { setAlbums(result.albums); setMailConfigured(result.mailConfigured); setLoggedIn(true); }
      else if (response.status !== 401) setError(result.error);
    }).catch(() => setError("Administraci se nepodařilo načíst.")).finally(() => setLoading(false));
  }, []);
  function updateAlbum(value: ProofAlbum) { setAlbums(items => [value, ...items.filter(item => item.id !== value.id)]); }
  async function login(event: React.FormEvent) {
    event.preventDefault(); setBusy(true); setError("");
    try { await proofRequest("admin/login", { password }); setPassword(""); await refresh(); }
    catch (error) { setError((error as Error).message); } finally { setBusy(false); }
  }
  async function logout() {
    try { await proofRequest("admin/logout", {}); setLoggedIn(false); setAlbums([]); setShare(null); setActiveId(null); setError(""); }
    catch (error) { setError((error as Error).message); }
  }
  async function testEmail() {
    setBusy(true); setError(""); setMailTestResult("");
    try {
      await proofRequest("admin/test-email", {});
      setMailTestResult("Resend převzal testovací e-mail. Zkontrolujte Hančinu schránku včetně spamu.");
    } catch (error) { setError((error as Error).message); } finally { setBusy(false); }
  }
  async function createAlbum(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault(); const form = new FormData(event.currentTarget); setBusy(true); setError("");
    try {
      const result = await proofRequest("admin/create", { title: form.get("title"), clientName: form.get("clientName"), message: form.get("message"), expiresAt: new Date(`${form.get("expiresAt")}T23:59:59`).toISOString() });
      updateAlbum(result.album); setActiveId(result.album.id); setShare({ id: result.album.id, code: result.code }); setCreate(false); setCopied(false);
    } catch (error) { setError((error as Error).message); } finally { setBusy(false); }
  }
  async function upload(files: FileList | null) {
    if (!album || !files?.length || busy) return;
    setBusy(true); setError(""); const failures: string[] = [];
    for (const [index, file] of Array.from(files).entries()) {
      setProgress(`Připravuji a nahrávám ${index + 1} / ${files.length}: ${file.name}`);
      try {
        const preview = await makePreview(file);
        const form = new FormData();
        form.set("albumId", album.id); form.set("name", file.name); form.set("width", String(preview.width)); form.set("height", String(preview.height)); form.set("photo", preview.blob, "preview.jpg");
        const response = await fetch("/api/proofing/admin/upload", { method: "POST", body: form });
        const result = await response.json();
        if (!response.ok) throw new Error(result.error);
        updateAlbum(result.album);
      } catch (error) { failures.push(`${file.name}: ${(error as Error).message}`); }
    }
    setProgress(""); setBusy(false);
    if (failures.length) setError(`Nenahrané fotografie (${failures.length}): ${failures.slice(0, 5).join("; ")}`);
  }
  async function doAction(kind: "archive" | "reopen" | "rotate" | "retry") {
    if (!album) return;
    setBusy(true); setError("");
    try {
      const result = await proofRequest(`admin/${kind}`, { id: album.id });
      if (result.album) updateAlbum(result.album); else await refresh();
      if (result.code) { setShare({ id: album.id, code: result.code }); setCopied(false); }
      setAction(null);
    } catch (error) { setError((error as Error).message); } finally { setBusy(false); }
  }
  function exportSelection() {
    if (!album) return;
    const names = album.photos.filter(photo => album.selected.includes(photo.id)).map(photo => photo.name);
    const url = URL.createObjectURL(new Blob([names.join("\n")], { type: "text/plain;charset=utf-8" }));
    const link = document.createElement("a"); link.href = url; link.download = `vyber-${album.id}.txt`; link.click(); URL.revokeObjectURL(url);
  }
  async function copyCode() {
    if (!share) return;
    try { await navigator.clipboard.writeText(`Vaše fotografie najdete na ${window.location.origin}/pro-klienty\nPřístupový kód: ${share.code}`); setCopied(true); }
    catch { setError("Kód se nepodařilo zkopírovat. Označte ho a zkopírujte ručně."); }
  }
  async function confirmDelete() {
    if (!album || deleteTitle !== album.title) return;
    setBusy(true); setError("");
    try {
      await proofRequest("admin/delete", { id: album.id, title: deleteTitle });
      setAlbums(items => items.filter(item => item.id !== album.id));
      setActiveId(null); setShare(null); setPreview(null); setAction(null); setDeleteTitle("");
    } catch (error) { setError((error as Error).message); await refresh().catch(() => {}); }
    finally { setBusy(false); }
  }

  if (!loggedIn) return <ProofShell admin><div className="pf-admin-login"><form className="pf-entry-card" onSubmit={login}><div className="pf-lock"><LockKeyhole size={24} /></div><p className="pf-eyebrow">Pro Hanku</p><h1>Vítejte zpátky.</h1><p>Vaše galerie a výběry klientů na jednom místě.</p><label className="pf-label" htmlFor="admin-password">Heslo do administrace</label><input id="admin-password" className="pf-input" type="password" autoComplete="current-password" value={password} onChange={event => setPassword(event.target.value)} required maxLength={512} disabled={busy || loading} /><ErrorNotice message={error} /><button className="pf-button" disabled={busy || loading}>{loading ? "Načítám…" : busy ? "Přihlašuji…" : "Přihlásit se"}<ArrowRight size={17} /></button></form></div></ProofShell>;

  const shown = album?.photos.filter(photo => !selectedOnly || album.selected.includes(photo.id)) || [];
  const current = album?.photos.find(photo => photo.id === preview);
  return <ProofShell admin logout={busy ? undefined : logout}>
    <div className="pf-admin-heading"><div><p className="pf-eyebrow">Váš pracovní prostor</p><h1>Klientské galerie</h1><p>Od prvních náhledů po poslední vybranou vzpomínku.</p></div><button className="pf-button" onClick={() => { setCreate(true); setError(""); }} disabled={busy}><Plus size={18} /> Nová galerie</button></div>
    {!mailConfigured && <p className="pf-warning">E-mailová upozornění nejsou nastavená. Výběry se ukládají a uvidíte je tady; automatický e-mail zatím neodejde.</p>}
    {mailConfigured && <p><button className="pf-text-button" disabled={busy} onClick={() => void testEmail()}>Poslat testovací e-mail</button></p>}
    {mailTestResult && <p role="status">{mailTestResult}</p>}
    <ErrorNotice message={error} />
    <div className="pf-admin-layout"><aside className="pf-album-list" aria-label="Seznam galerií"><div className="pf-list-title">Galerie <span>{albums.length}</span><button className="pf-icon-button" aria-label="Obnovit galerie" disabled={busy} onClick={() => { void refresh().catch(error => setError(error.message)); }}><RefreshCw size={15} /></button></div>{!albums.length && <p className="pf-list-empty">Zatím tu není žádná galerie. Začněte tlačítkem „Nová galerie“.</p>}{albums.map(item => <button className={`pf-album-item ${item.id === activeId ? "is-active" : ""}`} key={item.id} disabled={busy} onClick={() => { setActiveId(item.id); setSelectedOnly(item.status === "submitted"); setError(""); }}><span className={`pf-status pf-status-${item.status}`}>{statusLabels[item.status]}</span><strong>{item.title}</strong><span>{item.clientName} · {item.photos.length} fotek</span><small>{item.selected.length} vybraných · do {proofDate(item.expiresAt)}</small></button>)}</aside>
      <section className="pf-album-detail">{!album ? <div className="pf-empty"><FolderPlus size={36} /><h2>Prostor pro další příběh.</h2><p>Vytvořte galerii, nahrajte fotografie a předejte klientovi přístupový kód.</p><button className="pf-button pf-secondary" onClick={() => setCreate(true)}>Vytvořit první galerii</button></div> : <>
        <div className="pf-detail-heading"><div><p className="pf-eyebrow">{album.clientName}</p><h2>{album.title}</h2><p>Platnost do {proofDate(album.expiresAt)} · {statusLabels[album.status]}</p></div><div className="pf-detail-actions"><button className="pf-text-button" disabled={busy || album.status === "archived"} onClick={() => setAction("rotate")}>Nový přístupový kód</button>{album.status === "submitted" && <button className="pf-text-button" disabled={busy} onClick={() => setAction("reopen")}>Otevřít výběr k úpravě</button>}{album.status !== "archived" && <button className="pf-text-button" disabled={busy} onClick={() => setAction("archive")}>Uzavřít galerii</button>}</div></div>
        {share?.id === album.id && <div className="pf-share"><div><p className="pf-eyebrow">Předejte klientovi · kód se zobrazí pouze nyní</p><strong>{share.code}</strong><span>{typeof window !== "undefined" ? window.location.origin : ""}/pro-klienty</span></div><button className="pf-button pf-secondary" onClick={copyCode}>{copied ? <Check size={17} /> : <Copy size={17} />}{copied ? "Zkopírováno" : "Kopírovat pozvánku"}</button></div>}
        {album.message && <p className="pf-album-message">Vzkaz pro klienta: {album.message}</p>}
        {album.status === "submitted" && <div className="pf-success"><Heart size={23} /><div><strong>Výběr klienta je odeslaný · Počet fotografií: {album.selected.length}</strong><p>{proofDate(album.submittedAt!)} · {notificationLabels[album.notification]}</p>{album.notification !== "sent" && <button className="pf-text-button" disabled={busy || !mailConfigured} onClick={() => void doAction("retry")}>Znovu zkusit e-mailové upozornění</button>}</div></div>}
        {album.note && <div className="pf-client-note"><p className="pf-eyebrow">Vzkaz od klienta</p><p>{album.note}</p></div>}
        <div className="pf-admin-photo-toolbar"><div className="pf-tabs"><button aria-pressed={!selectedOnly} onClick={() => setSelectedOnly(false)}><Images size={15} /> Všechny <span>{album.photos.length}</span></button><button aria-pressed={selectedOnly} onClick={() => setSelectedOnly(true)}><Heart size={15} /> Vybrané <span>{album.selected.length}</span></button></div><button className="pf-text-button" disabled={!album.selected.length} onClick={exportSelection}><Download size={16} /> Export názvů</button></div>
        {album.status === "open" && <label className={`pf-upload ${busy ? "is-busy" : ""}`}><Upload size={24} /><strong>{progress || "Přidat fotografie"}</strong><span>Náhledy se zmenší a dostanou vodoznak. Originály se na server neposílají.</span><small>JPEG, PNG nebo WebP · do 30 MB za vstupní soubor · nejvýše 500 fotek v galerii</small><input aria-label="Nahrát fotografie" type="file" multiple accept="image/jpeg,image/png,image/webp" disabled={busy} onChange={event => { void upload(event.target.files); event.target.value = ""; }} /></label>}
        {progress && <p className="pf-save-status" role="status">{progress}</p>}
        <div className="pf-photo-grid pf-admin-grid">{shown.map(photo => <article key={photo.id} className={`pf-photo ${album.selected.includes(photo.id) ? "is-selected" : ""}`}><button className="pf-photo-open" onClick={() => setPreview(photo.id)} aria-label={`Zvětšit ${photo.name}`}><img src={photoUrl(album, photo.id)} alt={photo.name} width={photo.width} height={photo.height} loading="lazy" /></button><div className="pf-photo-caption"><span title={photo.name}>{photo.name}</span>{album.selected.includes(photo.id) && <Heart size={16} fill="currentColor" />}</div></article>)}</div>
        {!shown.length && <p className="pf-list-empty">{selectedOnly ? "Zatím není vybraná žádná fotografie." : "Nahrajte první fotografie do galerie."}</p>}
        <p><button className="pf-text-button pf-delete-button" disabled={busy} onClick={() => { setDeleteTitle(""); setError(""); setAction("delete"); }}>Smazat galerii</button></p>
      </>}</section></div>
    {create && <ProofDialog label="Nová galerie" close={() => { if (!busy) setCreate(false); }}><form className="pf-create-form" onSubmit={createAlbum}><button type="button" className="pf-icon-button pf-form-close" disabled={busy} aria-label="Zavřít formulář" onClick={() => setCreate(false)}><X /></button><p className="pf-eyebrow">Nový příběh</p><h2>Vytvořit galerii</h2><label className="pf-label">Název galerie<input autoFocus className="pf-input" name="title" placeholder="Podzimní focení Novákových" required maxLength={120} /></label><label className="pf-label">Jméno klienta<input className="pf-input" name="clientName" placeholder="Rodina Novákova" required maxLength={120} /></label><label className="pf-label">Galerie dostupná do<input className="pf-input" type="date" name="expiresAt" required min={new Date().toISOString().slice(0, 10)} defaultValue={new Date(Date.now() + 30 * 86400000).toISOString().slice(0, 10)} /></label><label className="pf-label">Vzkaz klientovi<textarea className="pf-input" name="message" maxLength={2000} placeholder="Vyberte si své oblíbené fotografie…" /></label><ErrorNotice message={error} /><button className="pf-button" disabled={busy}>{busy ? "Vytvářím…" : "Vytvořit a získat kód"}<ArrowRight size={17} /></button></form></ProofDialog>}
    {action === "delete" && album && <ProofDialog label="Smazat galerii" close={() => { if (!busy) setAction(null); }}><form className="pf-confirm" onSubmit={event => { event.preventDefault(); void confirmDelete(); }}><h2>Smazat galerii „{album.title}“?</h2><p>Trvale odstraníte galerii, všechny její náhledy, výběr i vzkaz klienta. Přístupový kód přestane fungovat. Smazání nelze vrátit.</p><label className="pf-label">Pro potvrzení napište název galerie<input autoFocus className="pf-input" value={deleteTitle} onChange={event => setDeleteTitle(event.target.value)} disabled={busy} autoComplete="off" required /></label><ErrorNotice message={error} /><button className="pf-button pf-delete-confirm" disabled={busy || deleteTitle !== album.title}>{busy ? "Mažu…" : "Trvale smazat galerii"}</button><button type="button" className="pf-text-button" disabled={busy} onClick={() => setAction(null)}>Zpět</button></form></ProofDialog>}
    {action && action !== "delete" && <ProofDialog label="Potvrdit změnu galerie" close={() => { if (!busy) setAction(null); }}><div className="pf-confirm"><h2>{action === "archive" ? "Uzavřít galerii?" : action === "rotate" ? "Vygenerovat nový kód?" : "Otevřít výběr k úpravě?"}</h2><p>{action === "archive" ? "Klient ztratí přístup. Fotografie a jeho výběr zůstanou uložené v administraci. V této verzi je uzavření trvalé." : action === "rotate" ? "Původní kód a přihlášení klienta přestanou fungovat. Nový kód si zkopírujte a předejte klientovi." : "Klient bude moci svůj výběr znovu změnit a odeslat. Aktuální výběr zatím zůstane zachovaný."}</p><ErrorNotice message={error} /><button className="pf-button" disabled={busy} onClick={() => void doAction(action)}>{busy ? "Ukládám…" : "Potvrdit změnu"}</button><button autoFocus className="pf-text-button" disabled={busy} onClick={() => setAction(null)}>Zpět</button></div></ProofDialog>}
    {current && album && <ProofDialog label={current.name} close={() => setPreview(null)}><div className="pf-lightbox"><button autoFocus className="pf-icon-button pf-lightbox-close" aria-label="Zavřít náhled" onClick={() => setPreview(null)}><X /></button><img src={photoUrl(album, current.id)} alt={current.name} /><p className="pf-lightbox-controls">{current.name}{album.selected.includes(current.id) && <span className="pf-status pf-status-submitted">Vybráno klientem</span>}</p></div></ProofDialog>}
  </ProofShell>;
}
