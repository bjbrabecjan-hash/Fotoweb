import type { Metadata } from "next";
import { AdminAgreements } from "@/components/Agreements";
import "@/app/agreements.css";
export const metadata: Metadata = { title: "Správa dohod", robots: { index: false, follow: false, nocache: true } };
export default function Page() { return <AdminAgreements />; }
