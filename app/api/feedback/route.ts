import { NextRequest, NextResponse } from "next/server";
import { feedbackEmail, parseFeedback } from "@/lib/feedback";

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

  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.PROOFING_EMAIL_FROM;
  const to = process.env.PROOFING_EMAIL_TO;
  if (!apiKey || !from || !to) return json({ error: "Odesílání dotazníku nyní není dostupné. Zkuste to později nebo napište na fotohanabrabcova@gmail.com." }, 503);
  try {
    const result = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json", "Idempotency-Key": `feedback-${input.submissionId}` },
      body: JSON.stringify({ from, to: [to], subject: `Dotazník po focení: ${input.name}`, text: feedbackEmail(input) }),
      signal: AbortSignal.timeout(10000)
    });
    if (!result.ok) throw new Error("Mail delivery failed");
    return json({ ok: true });
  } catch {
    return json({ error: "Odeslání se nepodařilo potvrdit. Vaše odpovědi zůstávají vyplněné; zkuste odeslání znovu." }, 502);
  }
}
