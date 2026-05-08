import type { Metadata } from "next";
import { Cormorant_Garamond, Inter } from "next/font/google";
import { Footer } from "@/components/Footer";
import { Navbar } from "@/components/Navbar";
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
    <html lang="en" className={`${cormorant.variable} ${inter.variable}`}>
      <body className="font-sans antialiased">
        <Navbar />
        {children}
        <Footer />
      </body>
    </html>
  );
}
