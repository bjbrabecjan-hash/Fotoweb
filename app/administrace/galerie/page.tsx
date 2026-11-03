import type { Metadata } from "next";
import { AdminProofing } from "@/components/AdminProofing";
import "@/app/proofing.css";

export const metadata: Metadata = { title: "Správa klientských galerií", robots: { index: false, follow: false, nocache: true }, alternates: { canonical: "/administrace/galerie" } };
export default function AdminGalleryPage() { return <AdminProofing />; }
