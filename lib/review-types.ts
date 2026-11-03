import type { Feedback } from "./feedback";

export type StoredFeedback = {
  id: string;
  data: Feedback & { consentVersion: string; photoConsentText: string; reviewConsentText: string };
  content_hash: string;
  received_at: string;
  published_at: string | null;
  notification: "pending" | "sent" | "failed" | "unconfigured";
};
export type PublicReview = { id: string; name: string; review: string };
