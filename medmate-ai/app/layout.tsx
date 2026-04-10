import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Nav } from "@/components/layout/nav";
import { Footer } from "@/components/layout/footer";
import { DisclaimerBanner } from "@/components/layout/disclaimer-banner";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "MedMate AI — Your Personal AI Doctor, Built for Australia",
    template: "%s | MedMate AI",
  },
  description:
    "Free, private, 24/7 health guidance from an AI assistant built around Medicare, the PBS, and how Australian healthcare actually works.",
  keywords: [
    "AI doctor Australia",
    "symptom checker",
    "Medicare",
    "telehealth Australia",
    "Healthdirect",
    "PBS",
  ],
  openGraph: {
    title: "MedMate AI — Your Personal AI Doctor, Built for Australia",
    description:
      "Free, private, 24/7 health guidance from an AI assistant built around Medicare, the PBS, and Australian care pathways.",
    type: "website",
    locale: "en_AU",
  },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#FAFAF9" },
    { media: "(prefers-color-scheme: dark)", color: "#0D7377" },
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en-AU" suppressHydrationWarning>
      <body className={`${inter.variable} font-sans`}>
        <DisclaimerBanner />
        <Nav />
        <main className="min-h-[calc(100vh-8rem)]">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
