import { ProofError, type ProofDatabase, type ProofScope, type StoredAlbum } from "./proofing-server-types";

export const PREVIEW_BUCKET = "client-proofing-previews";
const TABLE = "photo_proofing_albums";

export function isSupabaseStorage() {
  if (process.env.PROOFING_STORAGE === "disk") {
    if (process.env.VERCEL) throw new ProofError(503, "Na Vercelu musí být zapojené trvalé úložiště galerií.");
    return false;
  }
  return process.env.PROOFING_STORAGE === "supabase" || !!process.env.VERCEL || !!(process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL);
}

function configuration() {
  const value = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SECRET_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!value || !key) throw new ProofError(503, "Chybí serverové připojení Supabase. Zkontrolujte URL a tajný serverový klíč v nastavení projektu.");
  let url: URL;
  try { url = new URL(value); } catch { throw new ProofError(503, "Adresa Supabase není správně nastavená."); }
  if (url.protocol !== "https:" || url.username || url.password || url.pathname !== "/" || url.search || url.hash) throw new ProofError(503, "Supabase musí používat platnou HTTPS adresu bez cesty.");
  if (!key.startsWith("sb_secret_")) {
    // A publishable/anon key must never silently become the storage credential.
    try {
      const payload = JSON.parse(Buffer.from(key.split(".")[1], "base64url").toString());
      if (payload.role !== "service_role") throw new Error();
    } catch { throw new ProofError(503, "Pro galerie je potřeba serverový Supabase secret klíč, nikoli veřejný klíč."); }
  }
  return { url: url.origin, key };
}

async function request(endpoint: string, init: RequestInit = {}) {
  const { url, key } = configuration();
  const headers = new Headers(init.headers);
  headers.set("apikey", key);
  // New secret keys are opaque API keys; legacy service_role keys are JWTs.
  if (!key.startsWith("sb_secret_")) headers.set("Authorization", `Bearer ${key}`);
  let response: Response;
  try { response = await fetch(`${url}${endpoint}`, { ...init, headers, cache: "no-store", redirect: "error", signal: AbortSignal.timeout(15000) }); }
  catch { throw new ProofError(503, "Supabase teď není dostupný. Výběr prosím zkuste uložit znovu."); }
  if (!response.ok) {
    if (response.status === 404 && endpoint.startsWith("/storage/v1/object/authenticated/")) throw new ProofError(404, "Náhled fotografie nebyl nalezen.");
    // Do not expose service responses (or URLs/credentials) to browser or logs.
    throw new ProofError(503, "Supabase požadavek nedokončil. Zkontrolujte propojení a databázové schéma.");
  }
  return response;
}

async function rpc<T>(name: string, input: unknown): Promise<T> {
  const response = await request(`/rest/v1/rpc/${name}`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(input) });
  return response.json();
}

type AlbumRow = { id: string; data: StoredAlbum; storage_version: number };
async function readAlbums(scope: ProofScope) {
  if (scope.create) return [];
  if (scope.albumId && !/^[a-f0-9-]{36}$/.test(scope.albumId)) throw new ProofError(404, "Galerie neexistuje.");
  const rows: AlbumRow[] = [];
  for (let offset = 0; ; offset += 100) {
    const query = new URLSearchParams({ select: "id,data,storage_version", order: "created_at.asc,id.asc", limit: "100", offset: String(offset) });
    if (scope.albumId) query.set("id", `eq.${scope.albumId}`);
    if (scope.codeHash) query.set("data->>codeHash", `eq.${scope.codeHash}`);
    const result: AlbumRow[] = await (await request(`/rest/v1/${TABLE}?${query}`)).json();
    rows.push(...result);
    if (result.length < 100 || scope.albumId || scope.codeHash) return rows;
  }
}

// Optimistic row versions give separate serverless instances the same write
// guarantees as the local lock. Callbacks must not perform external side effects.
export async function supabaseTransaction<T>(fn: (db: ProofDatabase) => Promise<T> | T, scope: ProofScope): Promise<T> {
  for (let attempt = 0; attempt < 4; attempt++) {
    const rows = await readAlbums(scope);
    const before = new Map(rows.map(row => [row.id, JSON.stringify(row.data)]));
    const db: ProofDatabase = { albums: rows.map(row => row.data), attempts: {} };
    const result = await fn(db);
    const changed = db.albums.filter(album => before.get(album.id) !== JSON.stringify(album));
    if (!changed.length) return result;
    if (changed.length !== 1 || rows.some(row => !db.albums.some(album => album.id === row.id))) throw new ProofError(500, "Neplatná změna úložiště galerií.");
    const album = changed[0];
    const version = rows.find(row => row.id === album.id)?.storage_version;
    const committed = await rpc<boolean>("photo_proofing_commit_album", { p_id: album.id, p_expected_version: version ?? null, p_data: album });
    if (committed) return result;
  }
  throw new ProofError(409, "Galerie se právě mění v jiném okně. Obnovte ji prosím a zkuste to znovu.");
}

export async function supabaseLoginLimit(role: "admin" | "client") {
  return rpc<boolean>("photo_proofing_login_attempt", { p_role: role });
}

export function previewObjectName(albumId: string, photoId: string) {
  if (![albumId, photoId].every(id => /^[a-f0-9-]{36}$/.test(id))) throw new ProofError(404, "Fotografie neexistuje.");
  return `${albumId}/${photoId}.jpg`;
}
export async function supabaseWritePreview(albumId: string, photoId: string, bytes: Buffer) {
  const object = previewObjectName(albumId, photoId);
  const bucket: { public: boolean } = await (await request(`/storage/v1/bucket/${PREVIEW_BUCKET}`)).json();
  if (bucket.public !== false) throw new ProofError(503, "Úložiště náhledů musí být soukromé. Nahrání bylo zastaveno.");
  await request(`/storage/v1/object/${PREVIEW_BUCKET}/${object}`, { method: "POST", headers: { "Content-Type": "image/jpeg", "Cache-Control": "max-age=0", "x-upsert": "false" }, body: new Uint8Array(bytes) });
}
export async function supabaseReadPreview(albumId: string, photoId: string) {
  const response = await request(`/storage/v1/object/authenticated/${PREVIEW_BUCKET}/${previewObjectName(albumId, photoId)}`);
  return Buffer.from(await response.arrayBuffer());
}
export async function supabaseRemovePreview(albumId: string, photoId: string) {
  await request(`/storage/v1/object/${PREVIEW_BUCKET}`, { method: "DELETE", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ prefixes: [previewObjectName(albumId, photoId)] }) });
}

export async function supabaseDeleteAlbum(id: string) {
  const [row] = await readAlbums({ albumId: id });
  if (!row) throw new ProofError(404, "Galerie neexistuje.");
  if (row.data.status !== "archived") throw new ProofError(409, "Před smazáním musí být galerie uzavřená.");
  const prefixes = row.data.photos.map(photo => previewObjectName(id, photo.id));
  if (prefixes.length) await request(`/storage/v1/object/${PREVIEW_BUCKET}`, {
    method: "DELETE", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ prefixes })
  });
  const query = new URLSearchParams({ id: `eq.${id}`, storage_version: `eq.${row.storage_version}`, select: "id" });
  const deleted: { id: string }[] = await (await request(`/rest/v1/${TABLE}?${query}`, {
    method: "DELETE", headers: { Prefer: "return=representation" }
  })).json();
  if (!deleted.length) throw new ProofError(409, "Galerie se během mazání změnila. Zkuste smazání znovu.");
}
