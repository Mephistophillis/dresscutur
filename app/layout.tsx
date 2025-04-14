import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import "./globals.css";
import Layout from "./components/layout/Layout";

const inter = Inter({
  subsets: ['latin', 'cyrillic'],
  display: 'swap',
  variable: '--font-inter',
  weight: ['300', '400', '500', '600', '700'],
});

const playfair = Playfair_Display({
  subsets: ['latin', 'cyrillic'],
  display: 'swap',
  variable: '--font-playfair',
  weight: ['400', '600'],
});

export const metadata: Metadata = {
  title: 'DressCutur - Ателье и мастерская по пошиву одежды в Москве',
  description: 'Ателье по индивидуальному пошиву одежды и продаже эксклюзивных европейских тканей. Пошив, реставрация, ремонт одежды любой сложности.',
  keywords: 'ателье, пошив одежды, ткани из Европы, индивидуальный пошив, реставрация одежды, ремонт одежды, покраска одежды',
  authors: [{ name: 'DressCutur' }],
  openGraph: {
    type: 'website',
    url: 'https://www.dresscutur.ru/',
    title: 'DressCutur - Ателье и мастерская по пошиву одежды',
    description: 'Индивидуальный пошив одежды и продажа эксклюзивных европейских тканей.',
    images: [
      {
        url: 'https://images.unsplash.com/photo-1558304970-abd589baebe5?ixlib=rb-4.0.3',
        width: 1200,
        height: 630,
        alt: 'DressCutur Ателье',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'DressCutur - Ателье и мастерская по пошиву одежды',
    description: 'Индивидуальный пошив одежды и продажа эксклюзивных европейских тканей.',
    images: ['https://images.unsplash.com/photo-1558304970-abd589baebe5?ixlib=rb-4.0.3'],
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  return (
    <html lang="ru" className={`${inter.variable} ${playfair.variable}`}>
      <body className="font-sans text-dark bg-light">
      <Layout>
        <a href="#main-content" className="skip-link">
          Перейти к основному содержимому
        </a>
        {children}
      </Layout>
      </body>
    </html>
  );
}
