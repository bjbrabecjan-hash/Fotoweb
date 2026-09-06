import { HomeExperience } from "@/components/HomeExperience";
import { getPortfolioItems } from "@/lib/portfolioItems";

export const metadata: Metadata = {
  alternates: { canonical: "/" },
  openGraph: { url: "/", title: "Hana Brabcová | Přirozené rodinné focení" }
};

export default function Home() {
  const portfolioItems = getPortfolioItems();

  return <HomeExperience portfolioItems={portfolioItems} />;
}
import type { Metadata } from "next";
