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
  description: "Přirozené rodinné, těhotenské a newborn focení v Moravskoslezském kraji.",
  url: "https://hana-brabcova.vercel.app",
  image: "https://hana-brabcova.vercel.app/assets/about/hana-owner-portrait.png",
  email: "fotohanabrabcova@gmail.com",
  telephone: "+420734548996",
  areaServed: ["Moravskoslezský kraj", "Ostrava", "Česká republika"],
  sameAs: [
    "https://www.instagram.com/brabcovahana_content_/",
    "https://www.facebook.com/profile.php?id=61579648302684"
  ],
  founder: {
    "@type": "Person",
    name: "Hana Brabcová"
  },
  serviceType: ["Rodinné focení", "Těhotenské focení", "Newborn focení", "Focení dětí a sourozenců"]
};

export const metadata: Metadata = {
  title: {
    default: "Hana Brabcová | Přirozené rodinné focení",
    template: "%s | Hana Brabcová"
  },
  description:
    "Hana Brabcová fotografuje rodiny, těhotenství, miminka, děti a sourozence přirozeně a bez strojených póz v Moravskoslezském kraji a okolí.",
  metadataBase: new URL("https://hana-brabcova.vercel.app"),
  applicationName: "Hana Brabcová",
  keywords: [
    "Hana Brabcová",
    "rodinné focení",
    "rodinná fotografka",
    "těhotenské focení",
    "newborn focení",
    "fotografka Ostrava",
    "fotografka Moravskoslezský kraj",
    "focení dětí",
    "focení sourozenců",
    "rodinný příběh"
  ],
  authors: [{ name: "Hana Brabcová" }],
  creator: "Hana Brabcová",
  publisher: "Hana Brabcová",
  alternates: {
    canonical: "/"
  },
  openGraph: {
    title: "Hana Brabcová | Přirozené rodinné focení",
    description: "Rodinné, těhotenské a newborn focení plné skutečných emocí v Moravskoslezském kraji.",
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
    title: "Hana Brabcová | Přirozené rodinné focení",
    description: "Rodinné, těhotenské a newborn focení plné skutečných emocí.",
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
