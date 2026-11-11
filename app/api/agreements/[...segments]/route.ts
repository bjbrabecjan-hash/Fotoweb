import { randomUUID } from "node:crypto";
import { NextRequest, NextResponse } from "next/server";
import { requireAdmin, requireOrigin } from "@/lib/proofing-auth";
import { ProofError } from "@/lib/proofing-store";
import { authorize, changeStatus, clientSession, commit, deleteAgreement, COOKIE, expose, get, hash, list, loginLimit, newPassword, notify, safeEqual, sendMail, setClient } from "@/lib/agreements/server";
import { completedText, initialDetails, TERMS_VERSION } from "@/lib/agreements/template";
import { invalidCredentials, statuses, type Agreement, type Confirmation, type Details } from "@/lib/agreements/types";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
type Context = { params: Promise<{ segments: string[] }> };
const headers = { "Cache-Control": "private, no-store, max-age=0", "X-Robots-Tag": "noindex, nofollow, noarchive", "X-Content-Type-Options": "nosniff" };
const json = (data: unknown, status = 200) => NextResponse.json(data, { status, headers });
function fail(e: unknown) { return json({ error: e instanceof ProofError ? e.message : "Požadavek se nepodařilo dokončit. Zkuste to znovu." }, e instanceof ProofError ? e.status : 500); }
async function body(req: NextRequest): Promise<Record<string, unknown>> {
  const reader = req.body?.getReader(); if (!reader) throw new ProofError(400, "Chybí data.");
  let size = 0; const chunks: Uint8Array[] = [];
  for (;;) { const r = await reader.read(); if (r.done) break; size += r.value.length; if (size > 40000) { await reader.cancel(); throw new ProofError(413, "Příliš dlouhý požadavek."); } chunks.push(r.value); }
  try { const v = JSON.parse(Buffer.concat(chunks).toString()); if (!v || typeof v !== "object" || Array.isArray(v)) throw Error(); return v; } catch { throw new ProofError(400, "Neplatná data."); }
}
function field(v: unknown, max = 200, required = true) { if (typeof v !== "string" || v.length > max || (required && !v.trim()) || /[\x00-\x08\x0b\x0c\x0e-\x1f]/.test(v)) throw new ProofError(400, "Zkontrolujte povinné údaje."); return v.trim(); }
function email(v: unknown, required = true) { const s = field(v, 254, required).toLowerCase(); if ((s || required) && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(s)) throw new ProofError(400, "Zkontrolujte e-mail."); return s; }
function details(input: unknown): Details {
  if (!input || typeof input !== "object") throw new ProofError(400, "Chybí údaje dohody."); const d = input as Record<string, unknown>;
  if (!Number.isFinite(d.price) || typeof d.price !== "number" || d.price <= 0 || d.price > 10000000 || !["plátce DPH", "neplátce DPH"].includes(String(d.vat))) throw new ProofError(400, "Zkontrolujte cenu a DPH.");
  const ico = field(d.ico, 8); if (!/^\d{8}$/.test(ico)) throw new ProofError(400, "IČO musí mít osm číslic.");
  return { company: field(d.company), establishment: field(d.establishment), ico, address: field(d.address, 500), vat: d.vat as Details["vat"], representative: field(d.representative, 200, false), email: email(d.email, false), phone: field(d.phone, 50, false), scope: field(d.scope, 12000), price: d.price };
}
function revision(a: Agreement, input: Record<string, unknown>) { if (input.revision !== a.revision) throw new ProofError(409, "Dokument se změnil. Obnovte jej a zkontrolujte nové znění."); }
function mutable(a: Agreement) { if (a.snapshot || a.status === "archivováno") throw new ProofError(409, "Potvrzenou nebo archivovanou dohodu nelze měnit. Vytvořte novou dohodu."); }

export async function GET(req: NextRequest, ctx: Context) {
  try {
    const segments = (await ctx.params).segments;
    if (segments[0] === "admin") { requireAdmin(req); return json({ agreements: (await list({ limit: "500" })).map(expose) }); }
    if (segments.join("/") === "document") {
      const session = clientSession(req); if (!session) throw new ProofError(401, "Přihlaste se prosím k dokumentu.");
      const a = await get(session.id); authorize(req, a); return json({ agreement: expose(a) });
    }
    throw new ProofError(404, "Stránka neexistuje.");
  } catch (e) { return fail(e); }
}

export async function POST(req: NextRequest, ctx: Context) {
  try {
    requireOrigin(req);
    const endpoint = (await ctx.params).segments.join("/");
    if (endpoint === "logout") { const r = json({ ok: true }); r.cookies.set(COOKIE, "", { path: "/", httpOnly: true, secure: process.env.NODE_ENV === "production", sameSite: "strict", maxAge: 0 }); return r; }
    // Authorize administrative mutations before parsing their bodies.
    if (endpoint.startsWith("admin/")) requireAdmin(req);
    const input = await body(req);
    if (endpoint === "login") {
      const identity = typeof input.email === "string" ? input.email.trim().toLowerCase().slice(0,254) : "";
      await loginLimit(req, identity);
      if (typeof input.password !== "string" || input.password.length > 128 || !identity) throw new ProofError(401, invalidCredentials);
      const query: Record<string,string> = { "data->details->>email": `eq.${identity}`, "data->>accessHash": `eq.${hash(input.password)}`, limit: "2" };
      if (input.id) { if (typeof input.id !== "string" || !/^[a-f0-9-]{36}$/.test(input.id)) throw new ProofError(401, invalidCredentials); query.id = `eq.${input.id}`; }
      const a = (await list(query))[0];
      if (!a || a.status === "koncept" || a.status === "archivováno" || !a.accessHash || !safeEqual(a.accessHash, hash(input.password))) throw new ProofError(401, invalidCredentials);
      if (!a.openedAt) { a.openedAt = new Date().toISOString(); if (!a.snapshot) changeStatus(a, "otevřeno klientem"); await commit(a, a.revision); }
      const r = json({ agreement: expose(a) }); setClient(r, a); return r;
    }
    if (endpoint === "submit") {
      const session = clientSession(req); if (!session) throw new ProofError(401, "Přihlaste se prosím k dokumentu.");
      const a = await get(session.id); authorize(req, a);
      if (a.snapshot) return json({ agreement: expose(a) });
      revision(a, input);
      if (input.termsVersion !== TERMS_VERSION) throw new ProofError(409, "Podmínky byly aktualizovány. Obnovte stránku a zkontrolujte nové znění.");
      const c = input.confirmation as Record<string, unknown> | undefined;
      if (!c || !Array.isArray(c.accepted) || c.accepted.length !== 4 || !c.accepted.every(x => x === true) || typeof c.portfolio !== "boolean") throw new ProofError(400, "Potvrďte všechna čtyři povinná pole.");
      const confirmation: Confirmation = { name: field(c.name), role: field(c.role), email: email(c.email), phone: field(c.phone, 50), place: field(c.place), accepted: [true,true,true,true], portfolio: c.portfolio };
      if (confirmation.email !== a.details.email) throw new ProofError(400, "Použijte e-mail, ke kterému je dokument přiřazený.");
      const at = new Date().toISOString();
      const year = new Intl.DateTimeFormat("en", { year: "numeric", timeZone: "Europe/Prague" }).format(new Date(at));
      const number = `HB-${year}-${a.id.toUpperCase()}`;
      a.snapshot = { number, text: completedText(a.details, confirmation, number, at), at, version: TERMS_VERSION, confirmation };
      changeStatus(a, "vyplněno klientem"); changeStatus(a, "připraveno k podpisu"); a.mail = { client: false, provider: false };
      await commit(a, a.revision);
      let warning = ""; try { await notify(a); } catch { warning = "Dohoda je bezpečně uložená. E-maily zatím nebyly oba doručeny; Hanka může odeslání zopakovat ve správě."; }
      return json({ agreement: expose(await get(a.id)), warning });
    }
    if (endpoint === "admin/create") {
      if (input.template !== "pilot-content-v1") throw new ProofError(400, "Vyberte šablonu dohody.");
      const a: Agreement = { id: randomUUID(), template: "pilot-content-v1", details: input.details ? details(input.details) : { ...initialDetails }, createdAt: new Date().toISOString(), status: "koncept", revision: 0, accessVersion: randomUUID(), events: [] };
      return json({ agreement: expose(await commit(a, null)) }, 201);
    }
    if (endpoint.startsWith("admin/")) {
      const a = await get(field(input.id, 36)); revision(a, input);
      if (endpoint === "admin/delete") { await deleteAgreement(a); return json({ ok: true }); }
      if (endpoint === "admin/save") {
        mutable(a); a.details = details(input.details);
        if (a.status !== "koncept") { changeStatus(a, "koncept"); a.accessVersion = randomUUID(); delete a.accessHash; delete a.openedAt; }
      } else if (endpoint === "admin/password") {
        mutable(a); if (!a.details.email || !a.details.representative || !a.details.phone) throw new ProofError(400, "Nejdříve uložte jméno, e-mail a telefon jednající osoby.");
        const password = newPassword(); a.accessHash = hash(password); a.accessVersion = randomUUID(); delete a.openedAt;
        changeStatus(a, "připraveno k odeslání"); await commit(a, a.revision); return json({ agreement: expose(a), password });
      } else if (endpoint === "admin/invite") {
        mutable(a); const password = field(input.password, 128);
        if (!a.accessHash || !safeEqual(a.accessHash, hash(password))) throw new ProofError(409, "Vygenerujte nové heslo pro pozvánku.");
        const base = process.env.PROOFING_PUBLIC_URL; if (!base || new URL(base).protocol !== "https:") throw new ProofError(503, "Nastavte HTTPS adresu webu PROOFING_PUBLIC_URL.");
        const url = new URL("/pro-klienty/dohody", base); url.searchParams.set("dohoda", a.id);
        await sendMail(a.details.email, "Dohoda ke spolupráci – Hana Brabcová", `Dobrý den,\n\npřipravila jsem pro Vás dohodu k naší spolupráci.\n\nDokument otevřete pomocí následujícího odkazu:\n\n${url.href}\n\nPřístupové heslo:\n\n${password}\n\nPo otevření odkazu zadejte svůj e-mail a přístupové heslo. Následně si můžete zkontrolovat podmínky, doplnit chybějící údaje a dohodu potvrdit.\n\nPo odeslání obdržíme oba kompletní znění e-mailem. Dohodu následně vytiskneme ve dvou vyhotoveních a podepíšeme.\n\nHana Brabcová\nfotohanabrabcova@gmail.com\n+420 734 548 996`, `invite-${a.id}-${a.accessVersion}`);
        a.invitedAt = new Date().toISOString(); if (!a.openedAt) changeStatus(a, "pozvánka odeslána");
      } else if (endpoint === "admin/status") {
        if (!statuses.includes(input.status as Agreement["status"]) || !["podepsáno", "archivováno"].includes(String(input.status)) || (input.status === "podepsáno" && (!a.snapshot || a.status === "archivováno"))) throw new ProofError(400, "Tento přechod stavu není možný.");
        changeStatus(a, input.status as Agreement["status"]); if (a.status === "archivováno") a.accessVersion = randomUUID();
      } else if (endpoint === "admin/retry-mail") { await notify(a); return json({ agreement: expose(await get(a.id)) }); }
      else throw new ProofError(404, "Stránka neexistuje.");
      await commit(a, a.revision); return json({ agreement: expose(a) });
    }
    throw new ProofError(404, "Stránka neexistuje.");
  } catch (e) { return fail(e); }
}
