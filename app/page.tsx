import { pageMetadata, homeTitle, homeDescription } from "@/lib/seo";
import { HomeExperience } from "@/components/HomeExperience";
import { getPortfolioItems } from "@/lib/portfolioItems";

export const metadata = pageMetadata(homeTitle, homeDescription, "/");

export default function Home() {
  const portfolioItems = getPortfolioItems();

  return <HomeExperience portfolioItems={portfolioItems} />;
}
