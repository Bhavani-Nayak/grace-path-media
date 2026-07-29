import type { Metadata } from "next";
import { Instrument_Serif, Barlow } from "next/font/google";
import "./globals.css";

const instrumentSerif = Instrument_Serif({
  weight: "400",
  style: "italic",
  subsets: ["latin"],
  display: "swap",
  variable: "--font-instrument-serif",
});

const barlow = Barlow({
  weight: ["300", "400", "500", "600", "700"],
  subsets: ["latin"],
  display: "swap",
  variable: "--font-barlow",
});

export const metadata: Metadata = {
  title: {
    default: "Grace Path Media — Ebooks, Reflections & Membership",
    template: "%s | Grace Path Media",
  },
  description:
    "A quiet corner of the internet, built for slow mornings and honest reflection — ebooks, weekly readings, and a membership made for the moments in between.",
  keywords: [
    "ebooks",
    "reflections",
    "membership",
    "mindfulness",
    "reading",
    "Grace Path Media",
  ],
  icons: {
    icon: "/images/gracePathLogo.png",
    apple: "/images/gracePathLogo.png",
  },
};

import InspectBlocker from "@/components/security/InspectBlocker";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      data-scroll-behavior="smooth"
      className={`${instrumentSerif.variable} ${barlow.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <InspectBlocker />
        {children}
      </body>
    </html>
  );
}
