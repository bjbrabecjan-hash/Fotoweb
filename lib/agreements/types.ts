export const statuses = ["koncept", "připraveno k odeslání", "pozvánka odeslána", "otevřeno klientem", "vyplněno klientem", "připraveno k podpisu", "podepsáno", "archivováno"] as const;
export type Status = typeof statuses[number];
export type Details = { company: string; establishment: string; ico: string; address: string; vat: "plátce DPH" | "neplátce DPH"; representative: string; email: string; phone: string; scope: string; price: number };
export type Confirmation = { name: string; role: string; email: string; phone: string; place: string; accepted: boolean[]; portfolio: boolean };
export type Snapshot = { number: string; text: string; version: string; at: string; confirmation: Confirmation };
export type Agreement = { id: string; template: "pilot-content-v1"; details: Details; status: Status; revision: number; createdAt: string; accessHash?: string; accessVersion: string; snapshot?: Snapshot; openedAt?: string; invitedAt?: string; mail?: { client: boolean; provider: boolean }; events: { at: string; status: Status }[] };
export type PublicAgreement = Omit<Agreement, "accessHash" | "accessVersion"> & { hasPassword: boolean };
export const invalidCredentials = "Zadané přístupové údaje nejsou platné. Zkontrolujte e-mail a heslo nebo požádejte o nové přístupové údaje.";
