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
  description: "Beauty fotografie, rodinné focení, portréty, brand content, reels a vizuální storytelling.",
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
  serviceType: ["Beauty fotografie", "Rodinné focení", "Portrétní fotografie", "Brand content", "Reels", "Salonní fotografie"]
};

export const metadata: Metadata = {
  title: {
    default: "Hana Brabcová | Fotografie pro značky, portréty a rodiny",
    template: "%s | Hana Brabcová"
  },
  description:
    "Hana Brabcová tvoří beauty fotografii, rodinné focení, portréty, brand content, reels a vizuální storytelling v Plzni, Praze a po domluvě.",
  metadataBase: new URL("https://hana-brabcova.vercel.app"),
  applicationName: "Hana Brabcová",
  keywords: [
    "Hana Brabcová",
    "beauty fotografie",
    "rodinné focení",
    "rodinná fotografka",
    "portrétní focení",
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
    title: "Hana Brabcová | Fotografie pro značky, portréty a rodiny",
    description: "Beauty fotografie, rodinné focení, portréty, reels a vizuální obsah pro značky i osobní příběhy.",
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
    title: "Hana Brabcová | Fotografie pro značky, portréty a rodiny",
    description: "Beauty fotografie, rodinné focení, portréty, reels a vizuální storytelling.",
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
