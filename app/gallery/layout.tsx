import type { Metadata } from "next";

export const metadata: Metadata = {
  title: 'Галерея работ | DressCutur - Ателье и мастерская по пошиву одежды',
  description: 'Взгляните на наши эксклюзивные работы. Индивидуальный пошив и реставрация одежды любой сложности. Свадебные платья, костюмы, вечерние наряды и многое другое.',
  keywords: 'галерея ателье, портфолио пошива одежды, примеры работ, пошив на заказ, ремонт одежды, реставрация одежды',
  openGraph: {
    title: 'Галерея работ | DressCutur - Ателье и мастерская по пошиву одежды',
    description: 'Взгляните на наши эксклюзивные работы. Индивидуальный пошив и реставрация одежды любой сложности.',
    images: [
      {
        url: 'https://images.unsplash.com/photo-1558304970-abd589baebe5?ixlib=rb-4.0.3',
        width: 1200,
        height: 630,
        alt: 'DressCutur Галерея',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Галерея работ | DressCutur - Ателье и мастерская',
    description: 'Взгляните на наши эксклюзивные работы и примеры пошива. Свадебные платья, костюмы и многое другое.',
    images: ['https://images.unsplash.com/photo-1558304970-abd589baebe5?ixlib=rb-4.0.3'],
  },
};

export default function GalleryLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      {children}
    </>
  );
} 