'use client';

import { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import Link from 'next/link';

// Map location data
const locations = [
  {
    id: 'location-1',
    name: 'Ателье на Тверской',
    address: 'г. Москва, ул. Тверская, д. 15, офис 204',
    coordinates: { lat: 55.765543, lng: 37.608803 }, // These should be actual coordinates
    image: '/images/atelier-exterior.jpg', // Replace with actual image
    directions: {
      car: 'Платная парковка доступна на улице и в ближайших паркингах ТЦ.',
      transit: [
        'М. Тверская - 5 минут пешком',
        'М. Пушкинская - 7 минут пешком',
        'Автобусы: 15, 115 - остановка "Тверская улица"'
      ]
    }
  },
  {
    id: 'location-2',
    name: 'Ателье на Арбате',
    address: 'г. Москва, ул. Арбат, д. 24, 2 этаж',
    coordinates: { lat: 55.749596, lng: 37.586758 }, // These should be actual coordinates
    image: '/images/atelier-exterior-2.jpg', // Replace with actual image
    directions: {
      car: 'Возможна парковка на прилегающих улицах. Платная парковка в 300м.',
      transit: [
        'М. Арбатская - 3 минуты пешком',
        'М. Смоленская - 10 минут пешком',
        'Автобусы: 39, 64 - остановка "Арбат"'
      ]
    }
  }
];

export default function Map() {
  const [activeTab, setActiveTab] = useState<'map' | 'exterior'>('map');
  const [activeLocation, setActiveLocation] = useState(locations[0].id);
  const [mapRef, mapInView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  // Get currently active location data
  const currentLocation = locations.find(loc => loc.id === activeLocation) || locations[0];
  
  // Map iframe ref for lazy loading
  const mapIframeRef = useRef<HTMLIFrameElement>(null);

  // Toggle between map and exterior view
  const handleTabChange = (tab: 'map' | 'exterior') => {
    setActiveTab(tab);
  };

  // Change active location
  const handleLocationChange = (id: string) => {
    setActiveLocation(id);
  };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.5,
        staggerChildren: 0.1,
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
      },
    },
  };

  // Function to generate Google Maps URL
  const getGoogleMapsUrl = (location: typeof locations[0]) => {
    return `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(location.address)}`;
  };

  // Function to generate Yandex Maps URL
  const getYandexMapsUrl = (location: typeof locations[0]) => {
    return `https://yandex.ru/maps/?rtext=~${encodeURIComponent(location.address)}`;
  };

  return (
    <section
      id="map"
      ref={mapRef}
      className="py-16 md:py-24 bg-white"
    >
      <div className="container mx-auto px-4">
        <div className="text-center mb-12 md:mb-16">
          <h2 className="section-title mx-auto w-fit">Как нас найти</h2>
          <p className="max-w-2xl mx-auto text-dark/80 mt-6">
            Наши ателье удобно расположены в центре Москвы, рядом со станциями метро
          </p>
        </div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate={mapInView ? "visible" : "hidden"}
          className="bg-light rounded-lg shadow-md overflow-hidden"
        >
          {/* Location Tabs */}
          <div className="flex border-b border-gray-200">
            {locations.map((location) => (
              <button
                key={location.id}
                onClick={() => handleLocationChange(location.id)}
                className={`py-4 px-6 text-left font-medium text-base transition-colors ${
                  activeLocation === location.id
                    ? 'text-primary border-b-2 border-primary'
                    : 'text-dark/70 hover:text-primary'
                }`}
                aria-selected={activeLocation === location.id}
                role="tab"
              >
                {location.name}
              </button>
            ))}
          </div>

          <div className="flex flex-col md:flex-row">
            {/* Map/Exterior Tabs */}
            <div className="md:w-2/3 relative">
              <div className="flex border-b border-gray-200 md:border-b-0 md:border-r">
                <button
                  onClick={() => handleTabChange('map')}
                  className={`flex-1 py-3 px-4 text-center font-medium text-sm transition-colors ${
                    activeTab === 'map'
                      ? 'text-primary border-b-2 md:border-b-0 md:border-r-2 border-primary'
                      : 'text-dark/70 hover:text-primary'
                  }`}
                  aria-selected={activeTab === 'map'}
                  role="tab"
                >
                  Карта
                </button>
                <button
                  onClick={() => handleTabChange('exterior')}
                  className={`flex-1 py-3 px-4 text-center font-medium text-sm transition-colors ${
                    activeTab === 'exterior'
                      ? 'text-primary border-b-2 md:border-b-0 md:border-r-2 border-primary'
                      : 'text-dark/70 hover:text-primary'
                  }`}
                  aria-selected={activeTab === 'exterior'}
                  role="tab"
                >
                  Фото здания
                </button>
              </div>

              {/* Map Content */}
              <div className="h-[400px] md:h-[500px] bg-gray-100">
                {activeTab === 'map' ? (
                  <div className="relative w-full h-full">
                    <iframe
                      ref={mapIframeRef}
                      src={`https://www.google.com/maps/embed/v1/place?key=YOUR_API_KEY&q=${encodeURIComponent(currentLocation.address)}`}
                      width="100%"
                      height="100%"
                      style={{ border: 0 }}
                      allowFullScreen={true}
                      loading="lazy"
                      referrerPolicy="no-referrer-when-downgrade"
                      title={`Карта расположения ${currentLocation.name}`}
                      className={`w-full h-full ${mapInView ? 'opacity-100' : 'opacity-0'} transition-opacity duration-500`}
                    ></iframe>
                    {!mapInView && (
                      <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
                        <p className="text-gray-500">Загрузка карты...</p>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="w-full h-full bg-cover bg-center" style={{ backgroundImage: `url(${currentLocation.image})` }}></div>
                )}
              </div>
            </div>

            {/* Location Details */}
            <motion.div 
              variants={itemVariants}
              className="md:w-1/3 p-6"
            >
              <h3 className="text-xl font-medium mb-3">{currentLocation.name}</h3>
              <p className="text-dark/80 mb-4">{currentLocation.address}</p>
              
              <div className="mb-6">
                <h4 className="text-md font-medium mb-2">Как добраться:</h4>
                <div className="mb-3">
                  <p className="text-sm font-medium mb-1">На автомобиле:</p>
                  <p className="text-sm text-dark/70">{currentLocation.directions.car}</p>
                </div>
                <div>
                  <p className="text-sm font-medium mb-1">Общественный транспорт:</p>
                  <ul className="list-disc list-inside text-sm text-dark/70">
                    {currentLocation.directions.transit.map((item, index) => (
                      <li key={index}>{item}</li>
                    ))}
                  </ul>
                </div>
              </div>
              
              <div className="flex flex-wrap gap-3">
                <Link
                  href={getGoogleMapsUrl(currentLocation)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm inline-flex items-center bg-primary text-white px-4 py-2 rounded hover:bg-primary/90 transition-colors"
                >
                  <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 2C7.589 2 4 5.589 4 9.995C4 15.4 12 22 12 22C12 22 20 15.4 20 9.995C20 5.589 16.411 2 12 2ZM12 14C9.791 14 8 12.209 8 10C8 7.791 9.791 6 12 6C14.209 6 16 7.791 16 10C16 12.209 14.209 14 12 14Z"/>
                  </svg>
                  Проложить маршрут в Google Maps
                </Link>
                <Link
                  href={getYandexMapsUrl(currentLocation)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm inline-flex items-center bg-white border border-primary text-primary px-4 py-2 rounded hover:bg-gray-50 transition-colors"
                >
                  <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 2C7.589 2 4 5.589 4 9.995C4 15.4 12 22 12 22C12 22 20 15.4 20 9.995C20 5.589 16.411 2 12 2ZM12 14C9.791 14 8 12.209 8 10C8 7.791 9.791 6 12 6C14.209 6 16 7.791 16 10C16 12.209 14.209 14 12 14Z"/>
                  </svg>
                  Проложить маршрут в Яндекс.Картах
                </Link>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
} 