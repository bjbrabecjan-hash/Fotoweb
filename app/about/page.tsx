import { AboutContent } from "@/components/AboutContent";

export const metadata: Metadata = {
  title: "O mně",
  description:
    "Hana Brabcová zachycuje přirozené rodinné příběhy, těhotenství, miminka, děti a společné životní etapy.",
  alternates: { canonical: "/about" },
  openGraph: { url: "/about", title: "O mně | Hana Brabcová" }
};

export default function AboutPage() {
  return <AboutContent />;
}
import type { Metadata } from "next";
