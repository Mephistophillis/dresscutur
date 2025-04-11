'use client';

import { motion } from 'framer-motion';

// Данные о ценах
const priceItems = [
  { id: 1, service: 'Топ', price: 'от 4 000 ₽' },
  { id: 2, service: 'Футболка', price: 'от 2 500 ₽' },
  { id: 3, service: 'Блузка, рубашка', price: 'от 7 500 ₽' },
  { id: 4, service: 'Сарафан', price: 'от 7 500 ₽' },
  { id: 5, service: 'Платье футляр', price: 'от 9 000 ₽' },
  { id: 6, service: 'Платье вечернее', price: 'от 19 500 ₽' },
  { id: 7, service: 'Платье танцевальное', price: 'от 5 000 ₽' },
  { id: 8, service: 'Юбка', price: 'от 15 000 ₽' },
  { id: 9, service: 'Брюки', price: 'от 6 900 ₽' },
  { id: 10, service: 'Жакет', price: 'от 20 500 ₽' },
  { id: 11, service: 'Пальто', price: 'от 26 400 ₽' },
];

// Дополнительные услуги
const additionalServices = [
  'Пошив из кожи и меха',
  'Реставрация',
  'Покраска',
  'Чистка'
];

export default function PriceTable() {
  const tableVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: {
        duration: 0.6,
        when: "beforeChildren",
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: { 
      opacity: 1, 
      x: 0,
      transition: { duration: 0.3 }
    }
  };

  return (
    <section className="py-16 bg-white" id="price-table">
      <div className="container mx-auto px-4">
        <motion.div 
          className="text-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-3xl font-serif font-semibold mb-4">Прайс-лист</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Ниже представлены ориентировочные цены на основные услуги нашего ателье.
            Точная стоимость зависит от сложности работы, выбранных материалов и сроков исполнения.
          </p>
        </motion.div>
        
        <div className="max-w-3xl mx-auto">
          <motion.div 
            className="bg-white rounded-lg shadow-md overflow-hidden"
            variants={tableVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
          >
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Услуга
                  </th>
                  <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Стоимость
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {priceItems.map((item) => (
                  <motion.tr key={item.id} variants={itemVariants}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {item.service}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-right">
                      {item.price}
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </motion.div>
          
          <motion.div 
            className="mt-8 bg-gray-50 rounded-lg p-6"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <h3 className="text-lg font-medium mb-4">Дополнительные услуги</h3>
            <div className="flex flex-wrap gap-4">
              {additionalServices.map((service, index) => (
                <div 
                  key={index} 
                  className="bg-white px-4 py-2 rounded-full text-sm shadow-sm"
                >
                  {service}
                </div>
              ))}
            </div>
            <p className="mt-4 text-sm text-gray-600">
              * Для получения точной информации о стоимости услуг, пожалуйста, обратитесь к нашим специалистам.
            </p>
          </motion.div>
          
          <motion.div 
            className="mt-8 text-center"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <button className="btn-primary">
              Рассчитать стоимость
            </button>
            <p className="mt-2 text-sm text-gray-500">
              Мы подготовим для вас индивидуальное предложение
            </p>
          </motion.div>
        </div>
      </div>
    </section>
  );
} 