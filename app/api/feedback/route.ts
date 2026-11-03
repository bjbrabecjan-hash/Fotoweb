import { NextRequest, NextResponse } from "next/server";
import { parseFeedback } from "@/lib/feedback";
import { saveFeedback, notifyFeedback } from "@/lib/review-store";
import { ProofError } from "@/lib/proofing-server-types";

export const runtime = "nodejs";
const attempts = new Map<string, { count: number; until: number }>();
const json = (body: unknown, status = 200) => NextResponse.json(body, { status, headers: { "Cache-Control": "no-store" } });

export async function POST(req: NextRequest) {
  const allowed = [req.nextUrl.origin];
  if (process.env.PROOFING_PUBLIC_URL) {
    try { allowed.push(new URL(process.env.PROOFING_PUBLIC_URL).origin); } catch { /* Ignore an invalid optional URL. */ }
  }
  if (!allowed.includes(req.headers.get("origin") || "")) return json({ error: "Odešlete prosím dotazník přímo z webu." }, 403);
  if (!req.headers.get("content-type")?.startsWith("application/json")) return json({ error: "Neplatný formát požadavku." }, 415);
  // Best-effort per-instance limit. Hosting should also enforce a WAF rate limit.
  const now = Date.now();
  for (const [key, attempt] of attempts) if (attempt.until <= now) attempts.delete(key);
  const key = process.env.VERCEL ? req.headers.get("x-vercel-forwarded-for") || "unknown" : "local";
  if (!attempts.has(key) && attempts.size >= 10000) return json({ error: "Formulář je právě vytížený. Zkuste to prosím později." }, 429);
  const attempt = attempts.get(key) || { count: 0, until: now + 10 * 60_000 };
  attempt.count++;
  attempts.set(key, attempt);
  if (attempt.count > 10) return json({ error: "Příliš mnoho pokusů. Zkuste to prosím za 10 minut." }, 429);

  let input;
  try {
    const reader = req.body?.getReader();
    if (!reader) return json({ error: "Chybí vyplněný dotazník." }, 400);
    const chunks: Uint8Array[] = [];
    let size = 0;
    while (true) {
      const chunk = await reader.read();
      if (chunk.done) break;
      size += chunk.value.length;
      if (size > 30000) { await reader.cancel(); return json({ error: "Odpověď je příliš dlouhá." }, 413); }
      chunks.push(chunk.value);
    }
    const raw = JSON.parse(Buffer.concat(chunks).toString("utf8"));
    if (raw?.website) return json({ error: "Odeslání se nepodařilo. Obnovte prosím stránku." }, 400);
    input = parseFeedback(raw);
  } catch (error) {
    return json({ error: error instanceof SyntaxError ? "Neplatný požadavek." : error instanceof Error ? error.message : "Zkontrolujte vyplněné údaje." }, 400);
  }

  try {
    const stored = await saveFeedback(input);
    // Once saved, a mail outage must not make the client resubmit a new record.
    let notification = stored.notification;
    try { notification = await notifyFeedback(stored); } catch { /* Pending notification remains visible to the admin. */ }
    return json({ ok: true, notification });
  } catch (error) {
    return json({ error: error instanceof ProofError ? error.message : "Odpověď se nepodařilo uložit. Údaje zůstávají vyplněné; zkuste to znovu." }, error instanceof ProofError ? error.status : 503);
  }
}
