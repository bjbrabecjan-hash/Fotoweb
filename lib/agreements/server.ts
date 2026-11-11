import { createHash, createHmac, randomBytes, randomUUID, timingSafeEqual } from "node:crypto";
import { NextRequest, NextResponse } from "next/server";
import { request } from "@/lib/proofing-supabase";
import { ProofError } from "@/lib/proofing-store";
import type { Agreement, PublicAgreement } from "./types";

export const COOKIE = "hana_agreement";
export function hash(value: string) { return createHash("sha256").update(value).digest("hex"); }
export function newPassword() { return randomBytes(24).toString("base64url"); }
export function safeEqual(a: string, b: string) { return timingSafeEqual(Buffer.from(hash(a)), Buffer.from(hash(b))); }
function secret() { const value = process.env.PROOFING_SESSION_SECRET; if (!value || value.length < 32) throw new ProofError(503, "Přihlášení zatím není nakonfigurované."); return value; }
type Session = { id: string; version: string; exp: number; nonce: string };
export function clientSession(req: NextRequest): Session | null {
  const token = req.cookies.get(COOKIE)?.value;
  if (!token) return null;
  const [body, signature, extra] = token.split(".");
  if (extra || !signature || !safeEqual(signature, createHmac("sha256", secret()).update(body).digest("base64url"))) return null;
  try { const s = JSON.parse(Buffer.from(body, "base64url").toString()); return typeof s.id === "string" && typeof s.version === "string" && s.exp > Date.now() ? s : null; } catch { return null; }
}
export function setClient(response: NextResponse, a: Agreement) {
  const body = Buffer.from(JSON.stringify({ id: a.id, version: a.accessVersion, exp: Date.now() + 8 * 3600000, nonce: randomUUID() })).toString("base64url");
  response.cookies.set(COOKIE, `${body}.${createHmac("sha256", secret()).update(body).digest("base64url")}`, { httpOnly: true, secure: process.env.NODE_ENV === "production", sameSite: "strict", path: "/", maxAge: 8 * 3600 });
}
export function expose(a: Agreement): PublicAgreement { return { id: a.id, template: a.template, details: a.details, status: a.status, revision: a.revision, createdAt: a.createdAt, snapshot: a.snapshot, openedAt: a.openedAt, invitedAt: a.invitedAt, mail: a.mail, events: a.events, hasPassword: !!a.accessHash }; }
export function authorize(req: NextRequest, a: Agreement) {
  const s = clientSession(req);
  if (!s || s.id !== a.id || s.version !== a.accessVersion || a.status === "archivováno" || a.status === "koncept") throw new ProofError(401, "Přihlaste se prosím k dokumentu.");
}
export async function rpc<T>(name: string, data: unknown): Promise<T> { return (await request(`/rest/v1/rpc/${name}`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(data) })).json(); }
export async function list(query: Record<string, string> = {}) {
  const p = new URLSearchParams({ select: "data", order: "created_at.desc,id.asc", ...query });
  const rows: { data: Agreement }[] = await (await request(`/rest/v1/client_agreements?${p}`)).json();
  return rows.map(r => r.data);
}
export async function get(id: string) {
  if (!/^[a-f0-9-]{36}$/.test(id)) throw new ProofError(404, "Dokument není dostupný.");
  const a = (await list({ id: `eq.${id}`, limit: "1" }))[0];
  if (!a) throw new ProofError(404, "Dokument není dostupný."); return a;
}
export async function commit(a: Agreement, expected: number | null) {
  a.revision = (expected ?? -1) + 1;
  const ok = await rpc<boolean>("agreement_commit", { p_id: a.id, p_expected: expected, p_data: a });
  if (!ok) throw new ProofError(409, "Dokument se mezitím změnil. Obnovte jej a zkontrolujte aktuální znění.");
  return a;
}
export function changeStatus(a: Agreement, status: Agreement["status"]) { if (a.status !== status) { a.status = status; a.events.push({ at: new Date().toISOString(), status }); } }
export async function loginLimit(req: NextRequest, email: string) {
  // Global bucket prevents spoofed headers or invented e-mails bypassing all limits.
  // Per-identity/IP buckets contain only hashes and expire after fifteen minutes.
  const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
  const allowed = await rpc<boolean>("agreement_login_attempt", { p_identity: hash(email), p_ip: hash(ip) });
  if (!allowed) throw new ProofError(429, "Zadané přístupové údaje nejsou platné. Zkontrolujte e-mail a heslo nebo požádejte o nové přístupové údaje.");
}
export async function sendMail(to: string, subject: string, text: string, key: string) {
  const from = process.env.RESEND_FROM_EMAIL?.trim() || process.env.PROOFING_EMAIL_FROM?.trim();
  const api = process.env.RESEND_API_KEY;
  if (!from || !api) throw new ProofError(503, "Odesílání e-mailů není nastavené. Dohoda zůstává uložená.");
  try {
    const result = await fetch("https://api.resend.com/emails", { method: "POST", headers: { Authorization: `Bearer ${api}`, "Content-Type": "application/json", "Idempotency-Key": key }, body: JSON.stringify({ from, to: [to], subject, text }), signal: AbortSignal.timeout(10000) });
    if (!result.ok) {
      console.warn("Agreement email rejected", { status: result.status });
      if (result.status === 403 && /@resend\.dev\s*>?$/i.test(from)) {
        throw new ProofError(502, "Resend používá testovací adresu. Pro pozvánky klientům nastavte odesílatele z vlastní ověřené domény.");
      }
      if (result.status === 403) {
        throw new ProofError(502, "Resend odmítl odeslání. Zkontrolujte ověření domény odesílatele a oprávnění API klíče.");
      }
      throw new Error();
    }
  } catch (error) {
    if (error instanceof ProofError) throw error;
    throw new ProofError(502, "E-mail se nepodařilo odeslat. Dohoda zůstává uložená a odeslání lze zopakovat.");
  }
}
export async function notify(a: Agreement) {
  if (!a.snapshot) throw new ProofError(409, "Dohoda ještě není vyplněná.");
  const snapshot = a.snapshot;
  const intro = `Dobrý den,\n\ndohoda ke tříměsíční pilotní spolupráci byla úspěšně vyplněna.\n\nV příloze nebo níže v tomto e-mailu naleznete její kompletní znění. Dokument nyní vytiskneme ve dvou vyhotoveních a podepíšeme.\n\nJedno podepsané vyhotovení obdrží každá smluvní strana.\n\nHana Brabcová\n\n`;
  let failed = false;
  for (const recipient of ["provider", "client"] as const) {
    a = await get(a.id);
    if (a.mail?.[recipient]) continue;
    try { await sendMail(recipient === "provider" ? "fotohanabrabcova@gmail.com" : snapshot.confirmation.email, `Vyplněná dohoda – ${a.details.company} – ${snapshot.number}`, intro + snapshot.text, `agreement-${a.id}-${recipient}`); }
    catch { failed = true; continue; }
    // Merge notification results with concurrent archive/status updates.
    for (let i = 0; i < 4; i++) {
      const current = await get(a.id); current.mail = { client: false, provider: false, ...current.mail, [recipient]: true };
      try { await commit(current, current.revision); break; } catch (e) { if (!(e instanceof ProofError) || e.status !== 409 || i === 3) throw e; }
    }
  }
  if (failed) throw new ProofError(502, "Některé e-maily se nepodařilo odeslat. Dohoda je uložená; odeslání lze zopakovat.");
}
