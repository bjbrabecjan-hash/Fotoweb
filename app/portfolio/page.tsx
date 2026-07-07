import { PortfolioContent } from "@/components/PortfolioContent";
import { getPortfolioItems } from "@/lib/portfolioItems";

export const metadata = {
  title: "Portfolio | Hana Brabcová",
  description:
    "Portfolio přirozeného rodinného, těhotenského a newborn focení od Hany Brabcové v Moravskoslezském kraji."
};

export default function PortfolioPage() {
  const portfolioItems = getPortfolioItems();

  return <PortfolioContent portfolioItems={portfolioItems} />;
}
