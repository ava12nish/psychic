import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import LenisProvider from "@/components/providers/LenisProvider";
import DeepCosmicBackground from "@/components/layout/DeepCosmicBackground";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Psychic — Vedic Astrology",
  description:
    "Personalized Vedic astrology readings powered by ancient Jyotish wisdom. Discover your birth chart, Mahadasha timeline, and personalized life insights.",
  keywords: ["Vedic astrology", "Jyotish", "birth chart", "Mahadasha", "Antardasha", "horoscope", "nakshatra"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen flex flex-col bg-neutral-950 text-neutral-50 selection:bg-accent-500/30`}>
        <LenisProvider>
          <DeepCosmicBackground />
          <Header />
          <main className="flex-1 relative z-10">{children}</main>
          <Footer />
        </LenisProvider>
      </body>
    </html>
  );
}
