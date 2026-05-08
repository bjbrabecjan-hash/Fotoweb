import { GalleryGrid } from "@/components/GalleryGrid";
import { Section } from "@/components/Section";
import { workItems } from "@/lib/work";

export const metadata = {
  title: "Portfolio | Hana Brabcová"
};

export default function PortfolioPage() {
  return (
    <Section className="pt-32 lg:pt-40" eyebrow="Portfolio" title="Hair, cosmetics, salons">
      <p className="mb-12 max-w-2xl text-base leading-8 text-ash">
        A focused selection of cinematic content for beauty campaigns, social launches, salon identities, and editorial moments.
      </p>
      <GalleryGrid items={workItems} filterable />
    </Section>
  );
}
