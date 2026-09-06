import { NextResponse } from "next/server";
import { isPackageId, packageLabels } from "@/lib/contactPackages";

const WINDOW_MS = 15 * 60 * 1000;
const MAX_REQUESTS = 5;
const attempts = new Map<string, number[]>();

function text(value: unknown, max: number) {
  return typeof value === "string" ? value.trim().slice(0, max + 1) : "";
}

export async function POST(request: Request) {
  const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
  const now = Date.now();
  const recent = (attempts.get(ip) ?? []).filter((time) => now - time < WINDOW_MS);
  if (recent.length >= MAX_REQUESTS) return NextResponse.json({ error: "Příliš mnoho pokusů. Zkuste to prosím později." }, { status: 429 });
  attempts.set(ip, [...recent, now]);

  let body: Record<string, unknown>;
  try { body = await request.json(); } catch { return NextResponse.json({ error: "Neplatná data formuláře." }, { status: 400 }); }
  if (text(body.website, 200)) return NextResponse.json({ ok: true });

  const name = text(body.name, 100);
  const email = text(body.email, 254);
  const message = text(body.message, 3000);
  const preferredDate = text(body.preferredDate, 120);
  const packageId = isPackageId(body.packageId) ? body.packageId : undefined;
  const startedAt = typeof body.startedAt === "number" ? body.startedAt : 0;
  if (name.length < 2 || name.length > 100 || message.length < 10 || message.length > 3000 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return NextResponse.json({ error: "Zkontrolujte prosím jméno, e-mail a zprávu." }, { status: 400 });
  }
  if (!startedAt || now - startedAt < 2000 || now - startedAt > 24 * 60 * 60 * 1000) return NextResponse.json({ error: "Formulář se nepodařilo ověřit. Obnovte stránku a zkuste to znovu." }, { status: 400 });

  const apiKey = process.env.RESEND_API_KEY;
  const to = process.env.CONTACT_TO_EMAIL;
  const from = process.env.RESEND_FROM_EMAIL;
  if (!apiKey || !to || !from) return NextResponse.json({ error: "Online formulář zatím není nakonfigurovaný. Použijte prosím přímý e-mail nebo telefon." }, { status: 503 });

  let provider: Response;
  try {
    provider = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        from,
        to: [to],
        reply_to: email,
        subject: `Poptávka z webu – ${name}`,
        text: [`Jméno: ${name}`, `E-mail: ${email}`, packageId ? `Balíček: ${packageLabels[packageId].cz}` : "Balíček: neuveden", preferredDate ? `Preferovaný termín: ${preferredDate}` : "Preferovaný termín: neuveden", "", "Zpráva:", message].join("\n")
      })
    });
  } catch {
    return NextResponse.json({ error: "E-mailová služba je dočasně nedostupná. Použijte prosím přímý e-mail nebo telefon." }, { status: 502 });
  }
  if (!provider.ok) return NextResponse.json({ error: "Poptávku se nepodařilo přijmout. Zkuste to znovu nebo použijte přímý e-mail." }, { status: 502 });
  return NextResponse.json({ ok: true });
}
