import type { Metadata } from "next";
import { Outfit } from "next/font/google";
import "./globals.css";
import Footer from '@/components/Footer';

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Tavoli GDR - Prenotazione Giocate",
  description: "Piattaforma per organizzare e partecipare a serate di giochi di ruolo e da tavolo.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="it" suppressHydrationWarning>
      <body className={`${outfit.variable}`}>
        {children}
        <Footer />
      </body>
    </html>
  );
}
