import type { Metadata } from "next";
import { Cormorant_Garamond, Inter, Parisienne } from "next/font/google";
import { Footer } from "@/components/Footer";
import { Navbar } from "@/components/Navbar";
import { ExperienceProvider } from "@/lib/experience";
import { LanguageProvider } from "@/lib/i18n";
import "./globals.css";

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  variable: "--font-cormorant",
  display: "swap"
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap"
});

const parisienne = Parisienne({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-script",
  display: "swap"
});

const structuredData = {
  "@context": "https://schema.org",
  "@type": "ProfessionalService",
  name: "Hana Brabcová",
  description: "Beauty fotografie, brand content, reels a vizuální storytelling pro salony, kosmetické značky a osobní brandy.",
  url: "https://hana-brabcova.vercel.app",
  image: "https://hana-brabcova.vercel.app/assets/about/hana-owner-portrait.png",
  email: "fotohanabrabcova@gmail.com",
  telephone: "+420734548996",
  areaServed: ["Plzeň", "Praha", "Česká republika"],
  sameAs: [
    "https://www.instagram.com/brabcovahana_content_/",
    "https://www.facebook.com/profile.php?id=61579648302684"
  ],
  founder: {
    "@type": "Person",
    name: "Hana Brabcová"
  },
  serviceType: ["Beauty fotografie", "Brand content", "Reels", "Salonní fotografie", "Portrétní fotografie"]
};

export const metadata: Metadata = {
  title: {
    default: "Hana Brabcová | Beauty fotografie a brand content",
    template: "%s | Hana Brabcová"
  },
  description:
    "Hana Brabcová tvoří prémiovou beauty fotografii, brand content, reels a vizuální storytelling pro salony, kosmetické značky a osobní brandy.",
  metadataBase: new URL("https://hana-brabcova.vercel.app"),
  applicationName: "Hana Brabcová",
  keywords: [
    "Hana Brabcová",
    "beauty fotografie",
    "brand content",
    "fotografka Plzeň",
    "fotografka Praha",
    "salon fotografie",
    "reels pro salony",
    "kosmetické značky",
    "vlasový styling fotografie"
  ],
  authors: [{ name: "Hana Brabcová" }],
  creator: "Hana Brabcová",
  publisher: "Hana Brabcová",
  alternates: {
    canonical: "/"
  },
  openGraph: {
    title: "Hana Brabcová | Beauty fotografie a brand content",
    description: "Prémiová beauty fotografie, reels a vizuální obsah pro salony, značky a osobní brandy.",
    url: "/",
    siteName: "Hana Brabcová",
    images: [
      {
        url: "/assets/about/hana-owner-portrait.png",
        width: 1200,
        height: 1600,
        alt: "Hana Brabcová"
      }
    ],
    locale: "cs_CZ",
    type: "website"
  },
  twitter: {
    card: "summary_large_image",
    title: "Hana Brabcová | Beauty fotografie a brand content",
    description: "Prémiová beauty fotografie, reels a vizuální storytelling pro salony a značky.",
    images: ["/assets/about/hana-owner-portrait.png"]
  },
  robots: {
    index: true,
    follow: true
  }
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="cs" className={`${cormorant.variable} ${inter.variable} ${parisienne.variable}`}>
      <body className="pb-24 font-sans antialiased lg:pb-0">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />
        <ExperienceProvider>
          <LanguageProvider>
            <Navbar />
            {children}
            <Footer />
          </LanguageProvider>
        </ExperienceProvider>
      </body>
    </html>
  );
}
