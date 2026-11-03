import { createHash, randomBytes, randomUUID } from "node:crypto";
import { mkdir, readFile, rename, rm, writeFile } from "node:fs/promises";
import path from "node:path";
import type { ProofAlbum } from "./proofing-types";
import { ProofError, type ProofDatabase as Database, type ProofScope, type StoredAlbum } from "./proofing-server-types";
import { previewObjectName, supabaseReadPreview, supabaseRemovePreview, supabaseDeleteAlbum, supabaseTransaction, supabaseWritePreview, isSupabaseStorage } from "./proofing-supabase";
export { ProofError } from "./proofing-server-types";

export function dataRoot() {
  if (process.env.VERCEL) throw new ProofError(503, "Klientské galerie vyžadují trvalé serverové úložiště. Na tomto hostingu zatím nejsou zapojené.");
  return path.resolve(process.env.PROOFING_DATA_DIR || path.join(process.cwd(), ".proofing-data"));
}

// The directory lock coordinates all Node processes using this same disk.
// Atomic rename keeps the previous complete database intact if a write fails.
export async function transaction<T>(fn: (db: Database) => Promise<T> | T, scope: ProofScope = {}): Promise<T> {
  if (isSupabaseStorage()) return supabaseTransaction(fn, scope);
  const root = dataRoot();
  await mkdir(root, { recursive: true, mode: 0o700 });
  const lock = path.join(root, ".lock");
  let acquired = false;
  for (let i = 0; i < 100; i++) {
    try { await mkdir(lock); acquired = true; break; }
    catch (error) {
      if ((error as NodeJS.ErrnoException).code !== "EEXIST") throw error;
      await new Promise(resolve => setTimeout(resolve, 50));
    }
  }
  if (!acquired) throw new ProofError(503, "Úložiště je právě zaneprázdněné. Zkuste to za chvíli.");
  try {
    let db: Database;
    try { db = JSON.parse(await readFile(path.join(root, "albums.json"), "utf8")); }
    catch (error) {
      if ((error as NodeJS.ErrnoException).code !== "ENOENT") throw error;
      db = { albums: [], attempts: {} };
    }
    const result = await fn(db);
    const temporary = path.join(root, `${randomUUID()}.tmp`);
    await writeFile(temporary, JSON.stringify(db), { mode: 0o600 });
    await rename(temporary, path.join(root, "albums.json"));
    return result;
  } finally { await rm(lock, { recursive: true, force: true }); }
}

export function codeHash(code: string) {
  return createHash("sha256").update(code.replace(/[\s-]/g, "").toUpperCase()).digest("hex");
}
export function newCode() { return randomBytes(10).toString("hex").toUpperCase().match(/.{1,5}/g)!.join("-"); }
export function publicAlbum(album: StoredAlbum): ProofAlbum {
  return {
    id: album.id, title: album.title, clientName: album.clientName, message: album.message,
    expiresAt: album.expiresAt, createdAt: album.createdAt, status: album.status,
    photos: album.photos, selected: album.selected, note: album.note, revision: album.revision,
    submittedAt: album.submittedAt, notification: album.notification
  };
}
export function findAlbum(db: Database, id: string) {
  const album = db.albums.find(item => item.id === id);
  if (!album) throw new ProofError(404, "Galerie neexistuje.");
  return album;
}
export function checkAvailable(album: StoredAlbum) {
  if (album.status === "archived" || Date.parse(album.expiresAt) <= Date.now()) {
    throw new ProofError(410, "Platnost galerie skončila. Obraťte se prosím na Hanku.");
  }
}
export function imagePath(albumId: string, photoId: string) {
  previewObjectName(albumId, photoId);
  return path.join(dataRoot(), "photos", albumId, `${photoId}.jpg`);
}

export async function writePreview(albumId: string, photoId: string, bytes: Buffer) {
  if (isSupabaseStorage()) return supabaseWritePreview(albumId, photoId, bytes);
  const target = imagePath(albumId, photoId);
  await mkdir(path.dirname(target), { recursive: true, mode: 0o700 });
  await writeFile(target, bytes, { mode: 0o600, flag: "wx" });
}
export async function readPreview(albumId: string, photoId: string) {
  return isSupabaseStorage() ? supabaseReadPreview(albumId, photoId) : readFile(imagePath(albumId, photoId));
}
export async function removePreview(albumId: string, photoId: string) {
  return isSupabaseStorage() ? supabaseRemovePreview(albumId, photoId) : rm(imagePath(albumId, photoId), { force: true });
}

export async function deleteAlbum(id: string, title: string) {
  if (!/^[a-f0-9-]{36}$/.test(id)) throw new ProofError(400, "Neplatná galerie.");
  // Revoke access first. If storage cleanup fails, the archived gallery stays
  // visible to the admin so deletion can be retried without losing its manifest.
  await transaction(db => {
    const album = findAlbum(db, id);
    if (album.title !== title) throw new ProofError(409, "Název galerie se změnil. Obnovte ji a potvrďte smazání znovu.");
    album.status = "archived"; album.accessVersion = randomUUID(); album.revision++;
  }, { albumId: id });
  if (isSupabaseStorage()) return supabaseDeleteAlbum(id);
  const album = await transaction(db => findAlbum(db, id), { albumId: id });
  for (const photo of album.photos) await removePreview(id, photo.id);
  await transaction(db => { db.albums = db.albums.filter(album => album.id !== id); }, { albumId: id });
}

export async function notifySelection(id: string) {
  const album = await transaction(db => ({ ...findAlbum(db, id) }), { albumId: id });
  if (album.status !== "submitted" || album.notification === "sent") return;
  const key = process.env.RESEND_API_KEY;
  const from = process.env.PROOFING_EMAIL_FROM;
  const to = process.env.PROOFING_EMAIL_TO;
  const base = process.env.PROOFING_PUBLIC_URL;
  let state: ProofAlbum["notification"] = "unconfigured";
  if (key && from && to && base) {
    try {
      const response = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json", "Idempotency-Key": `selection-${album.submissionId}` },
        body: JSON.stringify({ from, to: [to], subject: `Nový výběr fotografií: ${album.title}`,
          text: `${album.clientName} dokončil/a výběr.\n\nGalerie: ${album.title}\nPočet fotografií: ${album.selected.length}\n\nOtevřít po přihlášení: ${new URL("/administrace/galerie", base).href}` }),
        signal: AbortSignal.timeout(10000)
      });
      state = response.ok ? "sent" : "failed";
    } catch { state = "failed"; }
  }
  await transaction(db => {
    const current = findAlbum(db, id);
    if (current.submissionId === album.submissionId && current.notification !== "sent") current.notification = state;
  }, { albumId: id });
}

export async function sendTestNotification() {
  const key = process.env.RESEND_API_KEY;
  const from = process.env.PROOFING_EMAIL_FROM;
  const to = process.env.PROOFING_EMAIL_TO;
  const base = process.env.PROOFING_PUBLIC_URL;
  if (!key || !from || !to || !base) throw new ProofError(503, "E-mailová upozornění nejsou nastavená.");
  try {
    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
      body: JSON.stringify({ from, to: [to], subject: "Test upozornění · Hana Brabcová",
        text: `Hanko, toto je test e-mailových upozornění z vašeho webu.\n\nPo dokončení výběru zákazníkem vám sem přijde upozornění s odkazem do administrace. Tento test nepředstavuje skutečný výběr.\n\nAdministrace: ${new URL("/administrace/galerie", base).href}` }),
      signal: AbortSignal.timeout(10000)
    });
    if (!response.ok) throw new Error("Email rejected");
  } catch {
    throw new ProofError(502, "Test se nepodařilo odeslat. Zkontrolujte klíč, odesílatele a příjemce v Resendu.");
  }
}
