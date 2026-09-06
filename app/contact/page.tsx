import { ContactContent } from "@/components/ContactContent";
import { isPackageId } from "@/lib/contactPackages";

export const metadata: Metadata = {
  title: "Kontakt",
  description:
    "Kontaktujte Hanu Brabcovou pro rodinné, těhotenské a newborn focení v Moravskoslezském kraji a okolí.",
  alternates: { canonical: "/contact" },
  openGraph: { url: "/contact", title: "Kontakt | Hana Brabcová" }
};

export default async function ContactPage({ searchParams }: { searchParams: Promise<{ package?: string }> }) {
  const params = await searchParams;
  return <ContactContent initialPackage={isPackageId(params.package) ? params.package : undefined} />;
}
import type { Metadata } from "next";
