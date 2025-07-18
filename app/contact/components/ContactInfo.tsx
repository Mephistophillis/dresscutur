'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import Link from 'next/link';
import { CONTACTS } from '~/app/constants/contacts';

// Contact data
const contactData = [
  {
    id: 'address-1',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
      </svg>
    ),
    title: 'Основной адрес',
    content: CONTACTS.address,
    copyable: true,
    link: CONTACTS.links.address,
    linkLabel: 'Открыть на карте',
  },
  // У нас только одно ателье, поэтому убираем второй адрес
  {
    id: 'phone-1',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
      </svg>
    ),
    title: 'Телефон',
    content: CONTACTS.phone,
    copyable: true,
    link: CONTACTS.links.phone,
    linkLabel: 'Позвонить',
  },
  // У нас один основной телефон, поэтому убираем дополнительный
  {
    id: 'email',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
      </svg>
    ),
    title: 'Email',
    content: CONTACTS.email,
    copyable: true,
    link: CONTACTS.links.email,
    linkLabel: 'Написать',
  },
  {
    id: 'messenger',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
      </svg>
    ),
    title: 'Мессенджеры',
    content: 'WhatsApp, Telegram',
    copyable: false,
    messageLinks: [
      { name: 'WhatsApp', url: CONTACTS.social.whatsapp },
      { name: 'Telegram', url: CONTACTS.social.telegram },
    ],
  }
];

export default function ContactInfo() {
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [sectionRef, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  // Function to copy text to clipboard
  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text).then(() => {
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 2000);
    });
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: {
        type: 'spring',
        stiffness: 100,
        damping: 15,
      }
    },
  };

  return (
    <section 
      id="contact-info" 
      ref={sectionRef}
      className="py-16 md:py-24 bg-light"
    >
      <div className="container mx-auto px-4">
        <div className="text-center mb-12 md:mb-16">
          <h2 className="section-title mx-auto w-fit">Контактная информация</h2>
          <p className="max-w-2xl mx-auto text-dark/80 mt-6">
            Свяжитесь с нами любым удобным способом или посетите одно из наших ателье в Москве
          </p>
        </div>

        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          {contactData.map((item) => (
            <motion.div
              key={item.id}
              variants={itemVariants}
              className="bg-white rounded-lg shadow-md p-6 hover-lift"
            >
              <div className="text-primary mb-4">{item.icon}</div>
              <h3 className="text-xl font-medium mb-2">{item.title}</h3>
              <p className="text-dark/80 mb-4">{item.content}</p>
              
              <div className="mt-auto pt-2 flex flex-wrap gap-3">
                {item.copyable && (
                  <button
                    onClick={() => copyToClipboard(item.content, item.id)}
                    className="text-sm inline-flex items-center text-primary hover:text-primary/80 transition-colors"
                    aria-label={`Копировать ${item.title.toLowerCase()}`}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                    </svg>
                    {copiedId === item.id ? 'Скопировано!' : 'Копировать'}
                  </button>
                )}
                
                {item.link && (
                  <Link 
                    href={item.link} 
                    className="text-sm inline-flex items-center text-primary hover:text-primary/80 transition-colors"
                    target={item.id.includes('address') ? '_blank' : undefined}
                    rel={item.id.includes('address') ? 'noopener noreferrer' : undefined}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                    </svg>
                    {item.linkLabel}
                  </Link>
                )}

                {item.messageLinks && (
                  <div className="flex flex-wrap gap-2">
                    {item.messageLinks.map((messageLink) => (
                      <Link
                        key={messageLink.name}
                        href={messageLink.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm inline-flex items-center text-primary hover:text-primary/80 transition-colors"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                        </svg>
                        {messageLink.name}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
} 