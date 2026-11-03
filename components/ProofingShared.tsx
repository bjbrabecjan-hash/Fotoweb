"use client";

import Link from "next/link";
import { ArrowLeft, LockKeyhole, LogOut } from "lucide-react";
import { useEffect, useRef } from "react";
import type { ProofAlbum } from "@/lib/proofing-types";

export async function proofRequest(endpoint: string, data?: unknown) {
  const response = await fetch(`/api/proofing/${endpoint}`, data === undefined ? { cache: "no-store" } : {
    method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(data)
  });
  const result = await response.json();
  if (!response.ok) throw new Error(result.error || "Požadavek se nepodařilo dokončit.");
  return result;
}
export function photoUrl(album: ProofAlbum, id: string) { return `/api/proofing/photo/${album.id}/${id}`; }
export function proofDate(value: string) { return new Intl.DateTimeFormat("cs-CZ", { dateStyle: "medium", timeZone: "Europe/Prague" }).format(new Date(value)); }

export function ProofShell({ children, admin = false, logout }: { children: React.ReactNode; admin?: boolean; logout?: () => void }) {
  return <div className="proofing">
    <header className="pf-header">
      <Link href="/" className="pf-brand">Hana Brabcová<span>Fotografie, ke kterým se vracíte.</span></Link>
      <div className="pf-header-right"><span className="pf-private"><LockKeyhole size={14} /> {admin ? "Správa galerií" : "Vaše soukromá galerie"}</span>
        {logout ? <button className="pf-icon-button" onClick={logout} aria-label="Odhlásit se" title="Odhlásit se"><LogOut size={19} /></button> : <Link className="pf-back" href="/portfolio"><ArrowLeft size={15} /> Zpět na web</Link>}
      </div>
    </header>
    <div className="pf-main">{children}</div>
    <footer className="pf-footer"><span>Hana Brabcová · Soukromý prostor pro vaše fotografie</span>{!admin && <Link href="/administrace/galerie" className="inline-flex items-center gap-2" aria-label="Pro Hanku — přihlášení do správy galerií"><LockKeyhole size={12} aria-hidden="true" /> Pro Hanku</Link>}<a href="mailto:fotohanabrabcova@gmail.com">Potřebujete poradit?</a></footer>
  </div>;
}

export function ProofDialog({ children, close, label }: { children: React.ReactNode; close: () => void; label: string }) {
  const ref = useRef<HTMLDialogElement>(null);
  useEffect(() => {
    const dialog = ref.current;
    dialog?.showModal();
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = previous; dialog?.close(); };
  }, []);
  return <dialog ref={ref} className="pf-dialog" aria-label={label} onCancel={event => { event.preventDefault(); close(); }} onClick={event => { if (event.target === event.currentTarget) close(); }}>{children}</dialog>;
}

export function ErrorNotice({ message }: { message: string }) {
  return message ? <p className="pf-error" role="alert">{message}</p> : null;
}
