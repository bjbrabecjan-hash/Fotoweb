import { createHash } from "node:crypto";
import { request } from "./proofing-supabase";
import { ProofError } from "./proofing-server-types";
import { feedbackEmail, feedbackVersion, photoConsentText, reviewConsentText, type Feedback } from "./feedback";
import type { PublicReview, StoredFeedback } from "./review-types";

const table = "/rest/v1/photo_feedback";
const uuid = /^[a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12}$/i;
function query(id: string) {
  if (!uuid.test(id)) throw new ProofError(400, "Neplatná odpověď.");
  return `${table}?id=eq.${id}`;
}
export async function getFeedback(id: string): Promise<StoredFeedback> {
  const rows: StoredFeedback[] = await (await request(`${query(id)}&select=*`)).json();
  if (!rows[0]) throw new ProofError(404, "Odpověď neexistuje.");
  return rows[0];
}
export async function saveFeedback(input: Feedback) {
  const content_hash = createHash("sha256").update(JSON.stringify(input)).digest("hex");
  await request(`${table}?on_conflict=id`, { method: "POST", headers: { "Content-Type": "application/json", Prefer: "resolution=ignore-duplicates" }, body: JSON.stringify({ id: input.submissionId, content_hash, data: { ...input, consentVersion: feedbackVersion, photoConsentText, reviewConsentText } }) });
  const row = await getFeedback(input.submissionId);
  if (row.content_hash !== content_hash) throw new ProofError(409, "Pod tímto odesláním už je jiná odpověď. Obnovte stránku a odešlete dotazník znovu.");
  return row;
}
export async function listFeedback(offset = 0) {
  const rows: StoredFeedback[] = await (await request(`${table}?select=*&order=received_at.desc,id.desc&limit=51&offset=${offset}`)).json();
  return { reviews: rows.slice(0, 50), hasMore: rows.length > 50 };
}
export async function publishFeedback(id: string, published: boolean) {
  const filter = published ? "&data->>reviewConsent=eq.yes&data->>review=neq." : "";
  const rows: StoredFeedback[] = await (await request(`${query(id)}${filter}&select=*`, { method: "PATCH", headers: { "Content-Type": "application/json", Prefer: "return=representation" }, body: JSON.stringify({ published_at: published ? new Date().toISOString() : null }) })).json();
  if (!rows[0]) throw new ProofError(409, "Zveřejnit lze jen neprázdnou recenzi s výslovným souhlasem klienta.");
  return rows[0];
}
export async function deleteFeedback(id: string) {
  await request(query(id), { method: "DELETE" });
}
export async function publicReviews(): Promise<PublicReview[]> {
  const rows: PublicReview[] = await (await request(`${table}?select=id,name:data->>name,review:data->>review&published_at=not.is.null&data->>reviewConsent=eq.yes&order=published_at.desc,id.desc&limit=100`)).json();
  return rows.map(row => ({ id: row.id, name: row.name, review: row.review }));
}
export async function notifyFeedback(row: StoredFeedback) {
  if (row.notification === "sent") return "sent";
  let notification: StoredFeedback["notification"] = "unconfigured";
  if (process.env.RESEND_API_KEY && process.env.PROOFING_EMAIL_FROM && process.env.PROOFING_EMAIL_TO) {
    try {
      const response = await fetch("https://api.resend.com/emails", { method: "POST", headers: { Authorization: `Bearer ${process.env.RESEND_API_KEY}`, "Content-Type": "application/json", "Idempotency-Key": `feedback-${row.id}` }, body: JSON.stringify({ from: process.env.PROOFING_EMAIL_FROM, to: [process.env.PROOFING_EMAIL_TO], subject: `Dotazník po focení: ${row.data.name}`, text: feedbackEmail(row.data, { version: row.data.consentVersion, photo: row.data.photoConsentText, review: row.data.reviewConsentText }) }), signal: AbortSignal.timeout(10000) });
      notification = response.ok ? "sent" : "failed";
    } catch { notification = "failed"; }
  }
  await request(`${query(row.id)}&notification=neq.sent`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ notification }) });
  return notification;
}

