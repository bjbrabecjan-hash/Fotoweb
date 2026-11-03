import { notFound } from "next/navigation";
import { SessionContent } from "@/components/SessionContent";
import { findPhotoSession, photoSessions } from "@/lib/photoSessions";
import { getPortfolioItems } from "@/lib/portfolioItems";
import { pageMetadata, siteUrl } from "@/lib/seo";

export const dynamicParams = false;
export function generateStaticParams() {
  return photoSessions.map(({ slug }) => ({ service: slug }));
}

type Props = { params: Promise<{ service: string }> };

export async function generateMetadata({ params }: Props) {
  const session = findPhotoSession((await params).service);
  if (!session) notFound();
  return pageMetadata(session.cz.heading, session.description, `/${session.slug}`);
}

export default async function SessionPage({ params }: Props) {
  const session = findPhotoSession((await params).service);
  if (!session) notFound();
  const portfolio = getPortfolioItems();
  const images = session.images.flatMap((filename) => portfolio.filter((item) => item.src.endsWith(`/${filename}`)));
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Service",
    name: session.cz.name,
    description: session.description,
    url: `${siteUrl}/${session.slug}`,
    serviceType: session.cz.name,
    areaServed: "Moravskoslezský kraj",
    provider: { "@type": "ProfessionalService", "@id": `${siteUrl}/#photographer`, name: "Hana Brabcová", url: siteUrl }
  };
  return <>
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData).replace(/</g, "\\u003c") }} />
    <SessionContent slug={session.slug} images={images} />
  </>;
}
