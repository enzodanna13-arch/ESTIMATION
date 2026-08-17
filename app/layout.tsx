import type { Metadata } from "next";
import { Fraunces, Geist, Geist_Mono, Manrope } from "next/font/google";
import "./globals.css";

// Rend l'app TOUJOURS fraîche (pas de page mise en cache par le CDN) : chaque
// mise à jour est visible immédiatement, sans attendre l'expiration du cache.
export const dynamic = "force-dynamic";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const fraunces = Fraunces({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
});

const manrope = Manrope({
  variable: "--font-dossier",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "IA Century21-Icazaimmobilier",
  description:
    "Outil d'estimation immobilière pour équipes commerciales : croisement DVF, concurrence active et invendus +90 jours, avec analyse IA des photos.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="fr"
      className={`${geistSans.variable} ${geistMono.variable} ${fraunces.variable} ${manrope.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-slate-100">{children}</body>
    </html>
  );
}
