import type { Metadata } from "next";
import { ClientProofing } from "@/components/ClientProofing";
import "@/app/proofing.css";
export const metadata: Metadata = { title: "Klientská galerie", robots: { index: false, follow: false, nocache: true } };
export default function Page() { return <ClientProofing />; }
