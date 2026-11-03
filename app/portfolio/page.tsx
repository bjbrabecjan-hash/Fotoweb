import { pageMetadata } from "@/lib/seo";
import { PortfolioContent } from "@/components/PortfolioContent";
import { getPortfolioItems } from "@/lib/portfolioItems";

export const metadata = pageMetadata("Portfolio", "Portfolio přirozeného rodinného, těhotenského a newborn focení od Hany Brabcové v Moravskoslezském kraji.", "/portfolio");

export default function PortfolioPage() {
  const portfolioItems = getPortfolioItems();

  return <PortfolioContent portfolioItems={portfolioItems} />;
}
