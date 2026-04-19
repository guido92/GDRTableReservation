import type { Metadata } from "next";
import { Cinzel, Montserrat } from "next/font/google";
import "./globals.css";
import Footer from '@/components/Footer';
import CookieBanner from '@/components/CookieBanner';

const cinzel = Cinzel({
  variable: "--font-cinzel",
  subsets: ["latin"],
  display: "swap",
  weight: ["400", "700", "900"],
});

const montserrat = Montserrat({
  variable: "--font-montserrat",
  subsets: ["latin"],
  display: "swap",
  weight: ["300", "400", "500", "700"],
});

export const metadata: Metadata = {
  title: "Dama Cafè × La Taverna di Guido | Serate GDR dal Vivo",
  description: "Prenota il tuo posto al tavolo per le serate di giochi di ruolo dal vivo al Dama Cafè di Gambettola. Dadi reali, avventure epiche e birre artigianali.",
  keywords: "giochi di ruolo, GDR, boardgame, Dama Cafè, Gambettola, La Taverna di Guido, D&D, serate gioco",
  openGraph: {
    title: "Dama Cafè × La Taverna di Guido",
    description: "Serate di giochi di ruolo dal vivo. Prenota il tuo posto!",
    type: "website",
    locale: "it_IT",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="it" suppressHydrationWarning>
      <body className={`${cinzel.variable} ${montserrat.variable}`}>
        {children}
        <Footer />
        <CookieBanner />
      </body>
    </html>
  );
}
