import { PortfolioContent } from "@/components/PortfolioContent";
import { getPortfolioItems } from "@/lib/portfolioItems";

export const metadata: Metadata = {
  title: "Portfolio",
  description:
    "Portfolio přirozeného rodinného, těhotenského a newborn focení od Hany Brabcové v Moravskoslezském kraji.",
  alternates: { canonical: "/portfolio" },
  openGraph: { url: "/portfolio", title: "Portfolio | Hana Brabcová" }
};

export default function PortfolioPage() {
  const portfolioItems = getPortfolioItems();

  return <PortfolioContent portfolioItems={portfolioItems} />;
}
import type { Metadata } from "next";
