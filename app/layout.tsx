import type { Metadata } from "next";
import { Orbitron, Rajdhani } from "next/font/google";
import "./globals.css";

const orbitron = Orbitron({
  subsets: ["latin"],
  variable: "--font-orbitron",
  weight: ["400", "500", "600", "700", "800", "900"],
  display: "swap",
});

const rajdhani = Rajdhani({
  subsets: ["latin"],
  variable: "--font-rajdhani",
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Rishikesh Trip 2026 — Into the Rapids",
  description:
    "Rishikesh trip itinerary for Jobin, Chirag, Aabha & Tanmay. April 26 – May 3, 2026.",
  openGraph: {
    title: "Rishikesh Trip 2026 — Into the Rapids",
    description: "April 26 – May 3, 2026. Four friends. One river.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${orbitron.variable} ${rajdhani.variable}`}>
      <body suppressHydrationWarning>{children}</body>
    </html>
  );
}
