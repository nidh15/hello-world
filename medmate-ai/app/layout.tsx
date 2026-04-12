import type { Metadata, Viewport } from "next";
import { Fraunces, DM_Sans } from "next/font/google";
import "./globals.css";
import { Nav } from "@/components/layout/nav";
import { Footer } from "@/components/layout/footer";
import { DisclaimerBanner } from "@/components/layout/disclaimer-banner";

const fraunces = Fraunces({
  subsets: ["latin"],
  variable: "--font-display",
  display: "swap",
  axes: ["opsz"],
});

const dmSans = DM_Sans({
  subsets: ["latin"],
  variable: "--font-body",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "OzDoc AI — Your Personal AI Doctor, Built for Australia",
    template: "%s | OzDoc AI",
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
    title: "OzDoc AI — Your Personal AI Doctor, Built for Australia",
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
    { media: "(prefers-color-scheme: light)", color: "#FDF6F0" },
    { media: "(prefers-color-scheme: dark)", color: "#0C1222" },
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en-AU" suppressHydrationWarning>
      <body
        className={`${fraunces.variable} ${dmSans.variable} font-body antialiased`}
      >
        <div className="grain" aria-hidden />
        <DisclaimerBanner />
        <Nav />
        <main className="min-h-[calc(100vh-8rem)]">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
