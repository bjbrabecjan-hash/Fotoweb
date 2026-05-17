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

export const metadata: Metadata = {
  title: "Hana Brabcová | Beauty Brand Content",
  description:
    "Premium photography and visual storytelling for beauty brands, salons, hair artists, and cosmetics labels.",
  metadataBase: new URL("https://hana-brabcova.vercel.app"),
  openGraph: {
    title: "Hana Brabcová | Beauty Brand Content",
    description: "Cinematic photo and video content for premium beauty brands.",
    type: "website"
  }
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${cormorant.variable} ${inter.variable} ${parisienne.variable}`}>
      <body className="pb-24 font-sans antialiased lg:pb-0">
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
