'use client';

import { useState, createContext, useContext } from 'react';
import Header from './Header';
import Footer from './Footer';
import ContactModal from './ContactModal';
import { usePathname } from 'next/navigation';

type LayoutContextType = {
  openContactModal: () => void;
};

export const LayoutContext = createContext<LayoutContextType | undefined>(undefined);

export function useLayoutContext() {
  const context = useContext(LayoutContext);
  if (!context) {
    throw new Error('useLayoutContext must be used within a LayoutProvider');
  }
  return context;
}

type LayoutProps = {
  children: React.ReactNode;
};

export default function Layout({ children }: LayoutProps) {
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);

  const pathname = usePathname()

  if (pathname.startsWith('/admin')) return children

  const openContactModal = () => {
    setIsContactModalOpen(true);
  };

  const closeContactModal = () => {
    setIsContactModalOpen(false);
  };

  const contextValue = {
    openContactModal,
  };

  return (
    <LayoutContext.Provider value={contextValue}>
      <Header />
      <main>{children}</main>
      <Footer />
      <ContactModal 
        isOpen={isContactModalOpen} 
        onClose={closeContactModal} 
      />
    </LayoutContext.Provider>
  );
} 