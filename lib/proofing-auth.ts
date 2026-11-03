import { createHmac, createHash, timingSafeEqual } from "node:crypto";
import type { NextRequest, NextResponse } from "next/server";
import { ProofError, transaction } from "./proofing-store";
import { supabaseLoginLimit, isSupabaseStorage } from "./proofing-supabase";

export const ADMIN_COOKIE = "proof_admin";
export const CLIENT_COOKIE = "proof_client";
type Session = { role: "admin" | "client"; id: string; version: string; exp: number };
function secret() {
  const value = process.env.PROOFING_SESSION_SECRET;
  if (!value || value.length < 32 || !process.env.PROOFING_ADMIN_PASSWORD || process.env.PROOFING_ADMIN_PASSWORD.length < 12) {
    throw new ProofError(503, "Klientská sekce ještě není nastavená. Správce musí dokončit konfiguraci přístupu.");
  }
  return value;
}
export function passwordVersion() { return createHash("sha256").update(process.env.PROOFING_ADMIN_PASSWORD || "").digest("hex"); }
export function equal(a: string, b: string) {
  const left = createHash("sha256").update(a).digest();
  const right = createHash("sha256").update(b).digest();
  return timingSafeEqual(left, right);
}
export function readSession(req: NextRequest, role: Session["role"]) {
  const key = secret();
  const token = req.cookies.get(role === "admin" ? ADMIN_COOKIE : CLIENT_COOKIE)?.value;
  if (!token) return null;
  try {
    const [body, signature] = token.split(".");
    if (!signature || !equal(signature, createHmac("sha256", key).update(body).digest("base64url"))) return null;
    const session: Session = JSON.parse(Buffer.from(body, "base64url").toString());
    if (session.role !== role || session.exp <= Date.now()) return null;
    if (role === "admin" && session.version !== passwordVersion()) return null;
    return session;
  } catch { return null; }
}
export function setSession(response: NextResponse, req: NextRequest, role: Session["role"], id: string, version: string) {
  const seconds = role === "admin" ? 8 * 3600 : 7 * 86400;
  const body = Buffer.from(JSON.stringify({ role, id, version, exp: Date.now() + seconds * 1000 })).toString("base64url");
  const token = `${body}.${createHmac("sha256", secret()).update(body).digest("base64url")}`;
  response.cookies.set(role === "admin" ? ADMIN_COOKIE : CLIENT_COOKIE, token, {
    httpOnly: true, sameSite: "strict", secure: process.env.NODE_ENV === "production" || req.nextUrl.protocol === "https:", path: "/", maxAge: seconds
  });
}
export function requireAdmin(req: NextRequest) {
  if (!readSession(req, "admin")) throw new ProofError(401, "Přihlaste se prosím do administrace.");
}
export function requireOrigin(req: NextRequest) {
  const origin = req.headers.get("origin");
  const allowed = [req.nextUrl.origin];
  if (process.env.PROOFING_PUBLIC_URL) allowed.push(new URL(process.env.PROOFING_PUBLIC_URL).origin);
  if (!origin || !allowed.includes(origin)) throw new ProofError(403, "Požadavek nepochází z tohoto webu.");
}
// Shared, persistent limits cannot be bypassed by inventing an X-Forwarded-For header.
// A proxy should additionally rate-limit by its verified client IP in production.
export async function limitLogin(role: "admin" | "client") {
  const allowed = isSupabaseStorage() ? await supabaseLoginLimit(role) : await transaction(db => {
    const now = Date.now();
    for (const key of Object.keys(db.attempts)) if (db.attempts[key].until < now) delete db.attempts[key];
    const attempt = db.attempts[role] ||= { count: 0, until: now + 15 * 60000 };
    attempt.count++;
    return attempt.count <= (role === "admin" ? 20 : 100);
  });
  if (!allowed) throw new ProofError(429, "Příliš mnoho pokusů. Zkuste to za 15 minut.");
}
