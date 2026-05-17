import { PortfolioContent } from "@/components/PortfolioContent";
import { getPortfolioItems } from "@/lib/portfolioItems";

export const metadata = {
  title: "Portfolio | Hana Brabcová"
};

export default function PortfolioPage() {
  const portfolioItems = getPortfolioItems();

  return <PortfolioContent portfolioItems={portfolioItems} />;
}
