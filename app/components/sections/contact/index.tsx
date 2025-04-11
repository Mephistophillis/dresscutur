'use client';

import React from 'react';
import { motion } from 'framer-motion';
import ContactForm from './ContactForm';
import ContactInfo from './ContactInfo';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5
    }
  }
};

const Contact = () => {
  return (
    <section id="contact" className="py-24 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">Свяжитесь с нами</h2>
          <p className="text-gray-600 text-lg max-w-3xl mx-auto">
            Есть вопросы или готовы обсудить ваш проект? Заполните форму ниже, 
            и мы свяжемся с вами в ближайшее время.
          </p>
        </div>
        
        <motion.div 
          className="grid grid-cols-1 lg:grid-cols-2 gap-12"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
        >
          {/* Contact Form */}
          <motion.div variants={itemVariants}>
            <ContactForm />
          </motion.div>

          {/* Contact Information */}
          <motion.div variants={itemVariants}>
            <ContactInfo />
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default Contact; 