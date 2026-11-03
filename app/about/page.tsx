import { pageMetadata } from "@/lib/seo";
import { AboutContent } from "@/components/AboutContent";

export const metadata = pageMetadata("O mně", "Hana Brabcová zachycuje přirozené rodinné příběhy, těhotenství, miminka, děti a společné životní etapy.", "/about");

export default function AboutPage() {
  return <AboutContent />;
}
