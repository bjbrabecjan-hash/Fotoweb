import type { Metadata } from "next";
import { ClientAgreements } from "@/components/Agreements";
import "@/app/agreements.css";
export const metadata: Metadata = { title: "Smlouvy a dohody", robots: { index: false, follow: false, nocache: true } };
export default function Page() { return <ClientAgreements />; }
