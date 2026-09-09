import { pageMetadata } from "@/lib/seo";
import { ContactContent } from "@/components/ContactContent";
import { isPackageId } from "@/lib/contactPackages";

export const metadata = pageMetadata("Kontakt", "Kontaktujte Hanu Brabcovou pro rodinné, těhotenské a newborn focení v Moravskoslezském kraji a okolí.", "/contact");

export default async function ContactPage({ searchParams }: { searchParams: Promise<{ package?: string }> }) {
  const params = await searchParams;
  return <ContactContent initialPackage={isPackageId(params.package) ? params.package : undefined} />;
}
