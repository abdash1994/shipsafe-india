import type { Metadata } from "next";
import { Plus_Jakarta_Sans, JetBrains_Mono, Syne } from "next/font/google";
import "./globals.css";

const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-body",
  weight: ["400", "500", "600", "700"],
});

const mono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  weight: ["400", "500"],
});

const syne = Syne({
  subsets: ["latin"],
  variable: "--font-display",
  weight: ["700", "800"],
});

export const metadata: Metadata = {
  title: "ShipSafe India — Pre-Launch Scanner for Indian Apps",
  description:
    "Paste your URL. Know if your app is actually ready to ship in India. DPDP, RBI, CERT-In compliance + security + SEO — checked in 60 seconds.",
  keywords: [
    "DPDP compliance",
    "India app launch",
    "vibe coding India",
    "pre-launch checklist India",
    "RBI compliance app",
    "CERT-In requirements",
  ],
  openGraph: {
    title: "ShipSafe India",
    description: "Is your app India-ready? Find out in 60 seconds.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      style={{
        fontFamily: "var(--font-body)",
      }}
    >
      <body
        className={`${jakarta.variable} ${mono.variable} ${syne.variable}`}
        style={{ fontFamily: "var(--font-body, 'Plus Jakarta Sans', sans-serif)" }}
      >
        {children}
      </body>
    </html>
  );
}
