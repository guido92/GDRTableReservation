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
  title: "Dama Cafè × La Taverna | Serate GdR & Giochi da Tavolo",
  description: "Il punto di ritrovo a Gambettola per GdR e giochi da tavolo dal vivo. Prenota il tuo posto, organizza la tua serata e unisciti alla nostra community.",
  keywords: "giochi di ruolo, GdR, boardgames, giochi da tavolo, Dama Cafè, Gambettola, La Taverna di Guido, D&D, serate gioco",
  openGraph: {
    title: "Dama Cafè × La Taverna | GdR & Board Games",
    description: "Serate di giochi di ruolo e board games dal vivo. Unisciti alla community!",
    type: "website",
    locale: "it_IT",
  },
  icons: {
    icon: "/damalogo.webp",
    apple: "/damalogo.webp",
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
