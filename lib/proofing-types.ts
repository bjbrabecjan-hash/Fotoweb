export type ProofPhoto = { id: string; name: string; width: number; height: number };
export type ProofAlbum = {
  id: string;
  title: string;
  clientName: string;
  message: string;
  expiresAt: string;
  createdAt: string;
  status: "open" | "submitted" | "archived";
  photos: ProofPhoto[];
  selected: string[];
  note: string;
  revision: number;
  submittedAt?: string;
  notification: "none" | "pending" | "sent" | "failed" | "unconfigured";
};
