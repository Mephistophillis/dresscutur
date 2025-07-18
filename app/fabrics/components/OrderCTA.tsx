'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { CONTACTS } from '~/app/constants/contacts';

const OrderCTA = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: '',
    selectedFabrics: [] as string[]
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSuccess(true);
      setFormData({
        name: '',
        email: '',
        phone: '',
        message: '',
        selectedFabrics: []
      });
      
      // Reset success message after 5 seconds
      setTimeout(() => {
        setIsSuccess(false);
      }, 5000);
    }, 1500);
  };
  
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };
  
  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: {
        duration: 0.5,
        ease: "easeOut"
      }
    }
  };

  return (
    <section className="py-24 bg-dark text-white">
      <div className="container mx-auto px-4">
        <motion.div 
          className="max-w-5xl mx-auto"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
        >
          <motion.div className="text-center mb-16" variants={itemVariants}>
            <h2 className="text-4xl font-serif font-semibold mb-6">Закажите образцы тканей</h2>
            <p className="text-lg text-gray-300 max-w-3xl mx-auto">
              Хотите увидеть и почувствовать наши ткани перед оформлением заказа? 
              Закажите образцы, и мы доставим их вам в кратчайшие сроки.
            </p>
          </motion.div>
          
          <motion.div 
            className="bg-white p-8 rounded-xl shadow-lg text-dark"
            variants={itemVariants}
          >
            {isSuccess ? (
              <div className="text-center py-12">
                <svg
                  className="w-16 h-16 text-green-500 mx-auto mb-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
                <h3 className="text-2xl font-semibold mb-4">Запрос отправлен!</h3>
                <p className="text-gray-600 mb-6">
                  Спасибо за ваш запрос! Наш менеджер свяжется с вами в ближайшее время
                  для уточнения деталей и оформления заказа образцов.
                </p>
                <button
                  className="btn-primary"
                  onClick={() => setIsSuccess(false)}
                >
                  Отправить еще один запрос
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  <div>
                    <label htmlFor="name" className="block text-gray-700 mb-2">Ваше имя</label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary"
                      placeholder="Введите ваше имя"
                      required
                    />
                  </div>
                  <div>
                    <label htmlFor="email" className="block text-gray-700 mb-2">Электронная почта</label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary"
                      placeholder="Введите вашу почту"
                      required
                    />
                  </div>
                </div>
                
                <div className="mb-6">
                  <label htmlFor="phone" className="block text-gray-700 mb-2">Номер телефона</label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary"
                    placeholder="+7 (___) ___-__-__"
                    required
                  />
                </div>
                
                <div className="mb-8">
                  <label htmlFor="message" className="block text-gray-700 mb-2">Сообщение</label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleInputChange}
                    rows={4}
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary"
                    placeholder="Укажите, какие ткани вас интересуют и для каких изделий"
                    required
                  ></textarea>
                </div>
                
                <div className="flex justify-center">
                  <motion.button
                    type="submit"
                    className="btn-primary px-8 py-4 font-medium text-lg"
                    disabled={isSubmitting}
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    {isSubmitting ? (
                      <div className="flex items-center">
                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Отправка...
                      </div>
                    ) : "Заказать образцы"}
                  </motion.button>
                </div>
              </form>
            )}
          </motion.div>
          
          <motion.div className="mt-12 text-center" variants={itemVariants}>
            <p className="text-gray-300">
              У вас есть вопросы? Свяжитесь с нами по телефону <a href={CONTACTS.links.phone} className="text-white underline hover:text-accent transition-colors">{CONTACTS.phone}</a> или 
              напишите на почту <a href={CONTACTS.links.email} className="text-white underline hover:text-accent transition-colors">{CONTACTS.email}</a>
            </p>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default OrderCTA; 