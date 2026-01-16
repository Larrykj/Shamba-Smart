import type { Metadata } from "next";
import "./globals.css";
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';

export const metadata: Metadata = {
  title: "Shamba Smart | Data-Driven Farming for Africa",
  description: "AI-powered planting calendars, real-time market prices, and indigenous wisdom. Empowering 12,000+ farmers across Kenya.",
  keywords: "farming, agriculture, Kenya, weather, crop prediction, market prices, smallholder farmers",
  authors: [{ name: "Shamba Smart" }],
  openGraph: {
    title: "Shamba Smart | Data-Driven Farming for Africa",
    description: "AI-powered planting calendars, real-time market prices, and indigenous wisdom.",
    type: "website",
    locale: "en_KE",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <Navigation />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}
