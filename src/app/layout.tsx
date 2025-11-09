import type { Metadata } from "next";
import { Inter, Urbanist } from "next/font/google";
import "./globals.css";
import { RootProviders } from "@/components/layout/RootProviders";

const urbanist = Urbanist({
  subsets: ["latin"],
  weight: ["200", "300", "400", "500", "600", "700"],
  variable: "--font-urbanist"
});

const inter = Inter({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  variable: "--font-inter"
});

export const metadata: Metadata = {
  title: "iSpySky — Prototypes & Experiments",
  description: "A curated collection of prototypes and ambient experiments by Josh Gause."
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${urbanist.variable} ${inter.variable}`}>
      <body className="relative min-h-svh bg-background text-text antialiased">
        <RootProviders>
          {children}
        </RootProviders>
      </body>
    </html>
  );
}

