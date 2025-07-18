import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Контакты | DressCutur - Ателье и мастерская по пошиву одежды',
  description: 'Свяжитесь с нами, чтобы записаться на консультацию или задать вопрос. Ателье DressCutur в Москве предлагает индивидуальный пошив одежды и продажу эксклюзивных европейских тканей.',
  keywords: 'ателье контакты, адрес ателье, телефон ателье, записаться на консультацию, пошив одежды контакты',
};

type ContactLayoutProps = {
  children: React.ReactNode;
};

export default function ContactLayout({ children }: ContactLayoutProps) {
  return (
    <>
      {children}
    </>
  );
} 