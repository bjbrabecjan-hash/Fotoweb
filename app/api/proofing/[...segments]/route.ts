import { NextRequest, NextResponse } from "next/server";
import { randomUUID } from "node:crypto";
import { ADMIN_COOKIE, CLIENT_COOKIE, equal, limitLogin, passwordVersion, readSession, requireAdmin, requireOrigin, setSession } from "@/lib/proofing-auth";
import { checkAvailable, codeHash, deleteAlbum, findAlbum, newCode, notifySelection, sendTestNotification, ProofError, publicAlbum, readPreview, removePreview, transaction, writePreview } from "@/lib/proofing-store";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
const privateHeaders = { "Cache-Control": "private, no-store, max-age=0", "X-Robots-Tag": "noindex, nofollow, noarchive", "X-Content-Type-Options": "nosniff" };
type Context = { params: Promise<{ segments: string[] }> };
const json = (body: unknown, status = 200) => NextResponse.json(body, { status, headers: privateHeaders });

async function boundedBody(req: NextRequest, maximum: number) {
  const reader = req.body?.getReader();
  if (!reader) throw new ProofError(400, "Chybí obsah požadavku.");
  const chunks: Uint8Array[] = [];
  let size = 0;
  while (true) {
    const chunk = await reader.read();
    if (chunk.done) break;
    size += chunk.value.length;
    if (size > maximum) { await reader.cancel(); throw new ProofError(413, "Soubor nebo požadavek je příliš velký."); }
    chunks.push(chunk.value);
  }
  return Buffer.concat(chunks);
}
async function body(req: NextRequest): Promise<Record<string, unknown>> {
  try {
    const value = JSON.parse((await boundedBody(req, 30000)).toString());
    if (!value || typeof value !== "object" || Array.isArray(value)) throw new Error();
    return value;
  } catch (error) {
    if (error instanceof ProofError) throw error;
    throw new ProofError(400, "Neplatný požadavek.");
  }
}
function textField(value: unknown, maximum: number, required = false) {
  if (typeof value !== "string" || value.length > maximum || (required && !value.trim())) throw new ProofError(400, "Zkontrolujte vyplněné údaje.");
  return value.trim();
}
function authorizeClient(req: NextRequest, album: ReturnType<typeof findAlbum>) {
  const session = readSession(req, "client");
  if (!session || session.id !== album.id || session.version !== album.accessVersion) throw new ProofError(401, "Pro otevření galerie zadejte její přístupový kód.");
  checkAvailable(album);
}
function failure(error: unknown) {
  if (error instanceof ProofError) return json({ error: error.message }, error.status);
  console.error("Proofing request failed:", error instanceof Error ? error.name : "UnknownError");
  return json({ error: "Požadavek se nepodařilo dokončit. Zkuste to prosím znovu." }, 500);
}

export async function GET(req: NextRequest, context: Context) {
  try {
    const segments = (await context.params).segments;
    const endpoint = segments.join("/");
    if (endpoint === "admin") {
      requireAdmin(req);
      return json({ albums: await transaction(db => db.albums.map(publicAlbum).reverse()), mailConfigured: !!(process.env.RESEND_API_KEY && process.env.PROOFING_EMAIL_FROM && process.env.PROOFING_EMAIL_TO && process.env.PROOFING_PUBLIC_URL) });
    }
    if (endpoint === "gallery") {
      const session = readSession(req, "client");
      if (!session) throw new ProofError(401, "Zadejte přístupový kód ke své galerii.");
      return json({ album: await transaction(db => { const album = findAlbum(db, session.id); authorizeClient(req, album); return publicAlbum(album); }, { albumId: session.id }) });
    }
    if (segments.length === 3 && segments[0] === "photo") {
      const [, albumId, photoId] = segments;
      await transaction(db => {
        const album = findAlbum(db, albumId);
        if (!readSession(req, "admin")) authorizeClient(req, album);
        if (!album.photos.some(photo => photo.id === photoId)) throw new ProofError(404, "Fotografie neexistuje.");
      }, { albumId });
      const bytes = await readPreview(albumId, photoId);
      return new NextResponse(bytes, { headers: { ...privateHeaders, "Content-Type": "image/jpeg", "Content-Disposition": "inline" } });
    }
    throw new ProofError(404, "Stránka neexistuje.");
  } catch (error) { return failure(error); }
}

export async function POST(req: NextRequest, context: Context) {
  try {
    requireOrigin(req);
    const segments = (await context.params).segments;
    const endpoint = segments.join("/");
    if (endpoint === "login" || endpoint === "admin/login") {
      // Validates configuration before processing a credential or opening storage.
      readSession(req, endpoint === "login" ? "client" : "admin");
      await limitLogin(endpoint === "login" ? "client" : "admin");
      const input = await body(req);
      if (endpoint === "admin/login") {
        const password = textField(input.password, 512, true);
        if (!equal(password, process.env.PROOFING_ADMIN_PASSWORD!)) throw new ProofError(401, "Nesprávné heslo.");
        const response = json({ ok: true });
        setSession(response, req, "admin", "hanka", passwordVersion());
        return response;
      }
      const hash = codeHash(textField(input.code, 80, true));
      const result = await transaction(db => {
        const album = db.albums.find(item => equal(item.codeHash, hash));
        if (!album) throw new ProofError(401, "Kód není platný. Zkontrolujte ho prosím.");
        checkAvailable(album);
        return { album: publicAlbum(album), version: album.accessVersion };
      }, { codeHash: hash });
      const response = json({ album: result.album });
      setSession(response, req, "client", result.album.id, result.version);
      return response;
    }
    if (endpoint === "logout" || endpoint === "admin/logout") {
      const response = json({ ok: true });
      response.cookies.set(endpoint === "logout" ? CLIENT_COOKIE : ADMIN_COOKIE, "", { path: "/", maxAge: 0, httpOnly: true, sameSite: "strict" });
      return response;
    }
    if (endpoint === "save" || endpoint === "submit") {
      const input = await body(req);
      const session = readSession(req, "client");
      if (!session) throw new ProofError(401, "Zadejte znovu přístupový kód.");
      const album = await transaction(db => {
        const album = findAlbum(db, session.id);
        authorizeClient(req, album);
        if (album.status === "submitted" && endpoint === "submit") return publicAlbum(album);
        if (album.status !== "open") throw new ProofError(409, "Výběr už je odeslaný. O další úpravy požádejte Hanku.");
        if (input.revision !== album.revision) throw new ProofError(409, "Galerie se mezitím změnila. Obnovte stránku, aby se načetl aktuální výběr.");
        if (!Array.isArray(input.selected) || input.selected.length > album.photos.length || input.selected.some(id => typeof id !== "string" || !album.photos.some(photo => photo.id === id))) throw new ProofError(400, "Výběr obsahuje neplatnou fotografii.");
        const selected = [...new Set(input.selected)] as string[];
        const note = textField(input.note, 2000);
        if (endpoint === "submit" && !selected.length) throw new ProofError(400, "Vyberte prosím alespoň jednu fotografii.");
        album.selected = selected;
        album.note = note;
        album.revision++;
        if (endpoint === "submit") {
          album.status = "submitted";
          album.submittedAt = new Date().toISOString();
          album.submissionId = randomUUID();
          album.notification = "pending";
        }
        return publicAlbum(album);
      }, { albumId: session.id });
      if (endpoint === "submit") await notifySelection(album.id);
      return json({ album });
    }
    requireAdmin(req);
    if (endpoint === "admin/delete") {
      const input = await body(req);
      await deleteAlbum(textField(input.id, 36, true), textField(input.title, 120, true));
      return json({ ok: true });
    }
    if (endpoint === "admin/test-email") {
      await limitLogin("admin");
      await sendTestNotification();
      return json({ ok: true });
    }
    if (endpoint === "admin/create") {
      const input = await body(req);
      const title = textField(input.title, 120, true);
      const clientName = textField(input.clientName, 120, true);
      const message = textField(input.message, 2000);
      const expiresAt = textField(input.expiresAt, 40, true);
      const expires = Date.parse(expiresAt);
      if (!Number.isFinite(expires) || expires <= Date.now() || expires > Date.now() + 366 * 86400000) throw new ProofError(400, "Platnost galerie musí být v budoucnu, nejvýše za rok.");
      const code = newCode();
      const album = await transaction(db => {
        if (db.albums.length >= 1000) throw new ProofError(400, "Úložiště dosáhlo limitu 1000 galerií.");
        const album = { id: randomUUID(), title, clientName, message, expiresAt: new Date(expires).toISOString(), createdAt: new Date().toISOString(), status: "open" as const, photos: [], selected: [], note: "", revision: 0, notification: "none" as const, codeHash: codeHash(code), accessVersion: randomUUID() };
        db.albums.push(album);
        return publicAlbum(album);
      }, { create: true });
      return json({ album, code }, 201);
    }
    if (endpoint === "admin/upload") {
      const bytes = await boundedBody(req, 4 * 1024 * 1024);
      const form = await new Response(bytes, { headers: { "Content-Type": req.headers.get("content-type") || "" } }).formData();
      const albumId = textField(form.get("albumId"), 36, true);
      const name = textField(form.get("name"), 255, true).replace(/[\r\n\x00-\x1f]/g, "");
      const file = form.get("photo");
      const width = Number(form.get("width"));
      const height = Number(form.get("height"));
      if (!(file instanceof File) || file.size > 3 * 1024 * 1024 || !file.size || !Number.isInteger(width) || !Number.isInteger(height) || width < 1 || height < 1 || width > 1800 || height > 1800) throw new ProofError(400, "Nahrajte náhled JPEG s delší stranou nejvýše 1800 px a velikostí do 3 MB.");
      const photoBytes = Buffer.from(await file.arrayBuffer());
      if (photoBytes[0] !== 0xff || photoBytes[1] !== 0xd8 || photoBytes[2] !== 0xff) throw new ProofError(400, "Soubor není platný JPEG.");
      const photo = { id: randomUUID(), name, width, height };
      const validate = (album: ReturnType<typeof findAlbum>) => {
        if (album.status !== "open") throw new ProofError(409, "Do uzavřené galerie nelze nahrávat fotografie.");
        if (album.photos.length >= 500) throw new ProofError(400, "Galerie může obsahovat nejvýše 500 fotografií.");
        if (album.photos.some(item => item.name === name)) throw new ProofError(409, `Fotografie ${name} už v galerii je.`);
      };
      await transaction(db => validate(findAlbum(db, albumId)), { albumId });
      await writePreview(albumId, photo.id, photoBytes);
      try {
        const album = await transaction(db => {
          const album = findAlbum(db, albumId);
          validate(album);
          album.photos.push(photo);
          album.revision++;
          return publicAlbum(album);
        }, { albumId });
        return json({ album }, 201);
      } catch (error) {
        // A timed-out database response may still have committed. Never remove
        // the object in that ambiguous case; an inaccessible orphan is safer.
        if (error instanceof ProofError && error.status < 500) {
          try { await removePreview(albumId, photo.id); } catch { /* Keep original error. */ }
        }
        throw error;
      }
    }
    if (["admin/reopen", "admin/archive", "admin/rotate", "admin/retry"].includes(endpoint)) {
      const input = await body(req);
      const id = textField(input.id, 36, true);
      if (endpoint === "admin/retry") { await notifySelection(id); return json({ ok: true }); }
      const code = endpoint === "admin/rotate" ? newCode() : undefined;
      const album = await transaction(db => {
        const album = findAlbum(db, id);
        if (endpoint === "admin/archive") { album.status = "archived"; album.accessVersion = randomUUID(); }
        if (endpoint === "admin/reopen") {
          if (album.status !== "submitted") throw new ProofError(409, "Znovu otevřít lze pouze odeslaný výběr.");
          checkAvailable(album);
          album.status = "open"; album.notification = "none"; delete album.submittedAt; delete album.submissionId;
        }
        if (code) { album.codeHash = codeHash(code); album.accessVersion = randomUUID(); }
        album.revision++;
        return publicAlbum(album);
      }, { albumId: id });
      return json({ album, code });
    }
    throw new ProofError(404, "Stránka neexistuje.");
  } catch (error) { return failure(error); }
}
