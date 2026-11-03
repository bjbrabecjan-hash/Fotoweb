import type { Metadata } from "next";
import { ClientProofing } from "@/components/ClientProofing";
import "@/app/proofing.css";

export const metadata: Metadata = { title: "Pro klienty", robots: { index: false, follow: false, nocache: true }, alternates: { canonical: "/pro-klienty" } };
export default function ClientGalleryPage() { return <ClientProofing />; }
