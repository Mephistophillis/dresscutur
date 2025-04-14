'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { useLayoutContext } from './Layout';

const navigation = [
  { name: 'Услуги', href: '/services' },
  { name: 'Ткани', href: '/fabrics' },
  { name: 'Галерея', href: '/gallery' },
  { name: 'О нас', href: '/about' },
  { name: 'Контакты', href: '/contact' },
];

export default function Header() {
  const { openContactModal } = useLayoutContext();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isMobileMenuOpen]);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  const navVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        delayChildren: 0.1,
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: -10 },
    visible: { opacity: 1, y: 0 }
  };

  const mobileMenuVariants = {
    closed: {
      opacity: 0,
      transition: {
        type: 'tween',
        duration: 0.3,
        ease: 'easeIn',
        when: 'afterChildren',
        staggerChildren: 0.05,
        staggerDirection: -1
      }
    },
    open: {
      opacity: 1,
      transition: {
        type: 'tween',
        duration: 0.4,
        ease: 'easeOut',
        when: 'beforeChildren',
        staggerChildren: 0.1,
        delayChildren: 0.1
      }
    }
  };

  const mobileItemVariants = {
    closed: { opacity: 0, y: 20 },
    open: { 
      opacity: 1, 
      y: 0,
      transition: {
        type: 'spring',
        stiffness: 300,
        damping: 30
      }
    }
  };

  return (
    <motion.header 
      className={`sticky top-0 z-50 ${
        scrolled 
          ? 'bg-white/95 backdrop-blur-sm shadow-md' 
          : 'bg-white shadow-sm'
      } transition-all duration-300`} 
      role="banner"
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="container mx-auto px-4 py-3 md:py-4 flex items-center justify-between">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Link 
            href="/" 
            className="text-2xl font-serif font-semibold text-primary" 
            aria-label="DressCutur - На главную"
          >
            DressCutur
          </Link>
        </motion.div>
        
        {/* Desktop Navigation */}
        <motion.nav 
          className="hidden md:flex space-x-6 lg:space-x-8" 
          role="navigation" 
          aria-label="Основная навигация"
          variants={navVariants}
          initial="hidden"
          animate="visible"
        >
          {navigation.map((item) => (
            <motion.div key={item.name} variants={itemVariants}>
              <Link 
                href={item.href} 
                className="text-dark hover:text-primary transition-colors duration-300 focus:outline-none focus:underline relative group"
              >
                {item.name}
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary transition-all duration-300 group-hover:w-full"></span>
              </Link>
            </motion.div>
          ))}
        </motion.nav>
        
        {/* Contact Button */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="flex items-center"
        >
          <button 
            onClick={openContactModal}
            className="hidden md:block btn-primary"
          >
            Записаться
          </button>
          
          {/* Mobile Menu Button */}
          <motion.button 
            className={`md:hidden ml-4 w-10 h-10 flex items-center justify-center rounded-full ${isMobileMenuOpen ? 'bg-white' : 'bg-gray-100'} focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 z-50`}
            aria-expanded={isMobileMenuOpen} 
            aria-controls="mobile-menu" 
            aria-label={isMobileMenuOpen ? "Закрыть меню" : "Открыть меню"}
            onClick={toggleMobileMenu}
            whileTap={{ scale: 0.95 }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <motion.div
              animate={isMobileMenuOpen ? "open" : "closed"}
              className="w-5 h-5 flex flex-col justify-center items-center"
            >
              <motion.span
                className={`block w-5 h-0.5 ${isMobileMenuOpen ? 'bg-primary' : 'bg-dark'} mb-1.5 origin-center`}
                variants={{
                  closed: { rotate: 0, y: 0 },
                  open: { rotate: 45, y: 2 }
                }}
                transition={{ duration: 0.3 }}
              />
              <motion.span
                className={`block w-5 h-0.5 ${isMobileMenuOpen ? 'bg-primary' : 'bg-dark'} mb-1.5`}
                variants={{
                  closed: { opacity: 1 },
                  open: { opacity: 0 }
                }}
                transition={{ duration: 0.3 }}
              />
              <motion.span
                className={`block w-5 h-0.5 ${isMobileMenuOpen ? 'bg-primary' : 'bg-dark'}`}
                variants={{
                  closed: { rotate: 0, y: 0 },
                  open: { rotate: -45, y: -2 }
                }}
                transition={{ duration: 0.3 }}
              />
            </motion.div>
          </motion.button>
        </motion.div>
      </div>
      
      {/* Full Screen Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.nav
            id="mobile-menu"
            className="static h-[100dvh] inset-0 bg-white z-40 md:hidden flex flex-col"
            role="navigation"
            aria-label="Мобильная навигация"
            variants={mobileMenuVariants}
            initial="closed"
            animate="open"
            exit="closed"
          >
            <div className="flex flex-col justify-center items-center h-full px-6 py-12">
              <motion.div 
                className="w-full max-w-md mx-auto flex flex-col items-center"
                variants={mobileItemVariants}
              >
                <span className="font-serif text-3xl font-semibold text-primary mb-12">DressCutur</span>
                
                <div className="w-full flex flex-col space-y-8 items-center mb-12">
                  {navigation.map((item) => (
                    <motion.div key={item.name} variants={mobileItemVariants} className="w-full text-center">
                      <Link
                        href={item.href}
                        className="block text-dark text-xl font-medium hover:text-primary transition-colors duration-300 focus:outline-none focus:text-primary"
                        onClick={closeMobileMenu}
                      >
                        {item.name}
                      </Link>
                    </motion.div>
                  ))}
                </div>
                
                <motion.div variants={mobileItemVariants} className="w-full">
                  <button
                    onClick={() => {
                      closeMobileMenu();
                      openContactModal();
                    }}
                    className="btn-primary text-center block w-full"
                  >
                    Записаться
                  </button>
                </motion.div>
                
                <motion.div 
                  className="mt-12 text-sm text-gray-500 text-center"
                  variants={mobileItemVariants}
                >
                  © 2024 DressCutur. Все права защищены.
                </motion.div>
              </motion.div>
            </div>
          </motion.nav>
        )}
      </AnimatePresence>
    </motion.header>
  );
} 