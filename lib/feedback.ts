export const feedbackVersion = "2026-11-03";
export const photoConsentText = "Souhlasím se zveřejněním fotografií z mého focení v portfoliu Hany Brabcové na jejím webu, Instagramu a Facebooku.";
export const reviewConsentText = "Souhlasím se zveřejněním mé recenze s uvedeným jménem na webu, Instagramu a Facebooku Hany Brabcové.";

export type Feedback = {
  name: string;
  session: string;
  photoConsent: "yes" | "no";
  review: string;
  reviewConsent: "yes" | "no";
  submissionId: string;
  submittedAt: string;
};

export function parseFeedback(value: unknown): Feedback {
  if (!value || typeof value !== "object" || Array.isArray(value)) throw new Error("Zkontrolujte vyplněné údaje.");
  const input = value as Record<string, unknown>;
  function field(key: string, maximum: number, required = false) {
    const item = input[key];
    if (typeof item !== "string" || item.length > maximum || (required && !item.trim())) throw new Error("Zkontrolujte vyplněné údaje.");
    return item.trim();
  }
  if ((input.photoConsent !== "yes" && input.photoConsent !== "no") || (input.reviewConsent !== "yes" && input.reviewConsent !== "no")) {
    throw new Error("Vyberte prosím odpověď u obou souhlasů.");
  }
  const submissionId = field("submissionId", 36, true);
  const submittedAt = field("submittedAt", 30, true);
  if (!Number.isFinite(Date.parse(submittedAt))) throw new Error("Obnovte stránku a zkuste to znovu.");
  if (!/^[a-f0-9]{8}-[a-f0-9]{4}-4[a-f0-9]{3}-[89ab][a-f0-9]{3}-[a-f0-9]{12}$/i.test(submissionId)) throw new Error("Obnovte stránku a zkuste to znovu.");
  const name = field("name", 150, true);
  if (/[\r\n]/.test(name)) throw new Error("Jméno napište na jeden řádek.");
  return { name, session: field("session", 200), review: field("review", 5000), photoConsent: input.photoConsent as "yes" | "no", reviewConsent: input.reviewConsent as "yes" | "no", submissionId, submittedAt };
}

export function feedbackEmail(input: Feedback) {
  return `Nová odpověď z klientského dotazníku\n\nJméno: ${input.name}\nFocení: ${input.session || "Neuvedeno"}\n\nFOTOGRAFIE: ${input.photoConsent === "yes" ? "SOUHLASÍM" : "NESOUHLASÍM"}\nZnění souhlasu: ${photoConsentText}\n\nRECENZE:\n${input.review || "Klient recenzi nenapsal."}\n\nZVEŘEJNĚNÍ RECENZE SE JMÉNEM: ${input.reviewConsent === "yes" ? "SOUHLASÍM" : "NESOUHLASÍM"}\nZnění souhlasu: ${reviewConsentText}\n\nČas vyplnění (zařízení klienta): ${input.submittedAt}\nVerze dotazníku: ${feedbackVersion}\nID odpovědi: ${input.submissionId}\n\nSouhlasy platí samostatně. Recenzi bez souhlasu nezveřejňujte. Odpověď byla odeslána veřejným formulářem; totožnost odesílatele nebyla ověřena.`;
}
