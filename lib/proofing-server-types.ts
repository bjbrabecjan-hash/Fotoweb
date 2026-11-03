import type { ProofAlbum } from "./proofing-types";

export type StoredAlbum = ProofAlbum & { codeHash: string; accessVersion: string; submissionId?: string };
export type ProofDatabase = { albums: StoredAlbum[]; attempts: Record<string, { count: number; until: number }> };
export type ProofScope = { albumId?: string; codeHash?: string; create?: boolean };

export class ProofError extends Error {
  constructor(public status: number, message: string) { super(message); }
}
