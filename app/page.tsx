import { HomeExperience } from "@/components/HomeExperience";
import { getPortfolioItems } from "@/lib/portfolioItems";

export default function Home() {
  const portfolioItems = getPortfolioItems();

  return <HomeExperience portfolioItems={portfolioItems} />;
}
