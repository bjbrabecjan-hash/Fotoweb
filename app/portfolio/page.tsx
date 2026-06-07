import { PortfolioContent } from "@/components/PortfolioContent";
import { getPortfolioItems } from "@/lib/portfolioItems";

export const metadata = {
  title: "Portfolio | Hana Brabcová",
  description:
    "Portfolio beauty fotografie, rodinného focení, vlasového stylingu, salonního obsahu a prémiových vizuálů od Hany Brabcové."
};

export default function PortfolioPage() {
  const portfolioItems = getPortfolioItems();

  return <PortfolioContent portfolioItems={portfolioItems} />;
}
