'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { CONTACTS } from '~/app/constants/contacts';

export default function CTA() {
  return (
    <section className="py-20 bg-gradient-to-r from-primary to-primary-dark text-white relative overflow-hidden">
      {/* Декоративные элементы */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none opacity-10">
        <div className="absolute -top-20 -left-20 w-64 h-64 rounded-full bg-white"></div>
        <div className="absolute top-1/2 right-20 w-32 h-32 rounded-full bg-white"></div>
        <div className="absolute -bottom-10 left-1/3 w-48 h-48 rounded-full bg-white"></div>
      </div>
      
      <div className="container mx-auto px-4 relative z-10">
        <motion.div 
          className="max-w-3xl mx-auto text-center"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
        >
          <h2 className="text-3xl md:text-4xl font-serif font-semibold mb-6">
            Воплотим ваши идеи в реальность
          </h2>
          
          <p className="text-lg md:text-xl opacity-90 mb-10 max-w-2xl mx-auto">
            Запишитесь на консультацию с нашим дизайнером, чтобы обсудить ваши идеи и создать 
            индивидуальное изделие, которое подчеркнет вашу уникальность.
          </p>
          
          <div className="flex flex-wrap justify-center gap-4">
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.98 }}
              transition={{ duration: 0.2 }}
            >
              <Link 
                href="#contact" 
                className="px-8 py-3 bg-white text-primary font-medium rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300"
              >
                Записаться на консультацию
              </Link>
            </motion.div>
            
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.98 }}
              transition={{ duration: 0.2 }}
            >
              <Link 
                href={CONTACTS.links.phone} 
                className="px-8 py-3 bg-transparent border-2 border-white text-white font-medium rounded-lg hover:bg-white/10 transition-colors duration-300"
              >
                Позвонить нам
              </Link>
            </motion.div>
          </div>
          
          <motion.div 
            className="mt-10 text-sm opacity-80 flex flex-col md:flex-row justify-center gap-2 md:gap-8"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.3 }}
          >
            <div className="flex items-center justify-center">
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"></path>
              </svg>
              <span>+7 (123) 456-78-90</span>
            </div>
            
            <div className="flex items-center justify-center">
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
              </svg>
              <span>info@dresscutur.ru</span>
            </div>
            
            <div className="flex items-center justify-center">
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path>
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path>
              </svg>
              <span>г. Москва, ул. Портновская, 123</span>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
} 