'use client';

import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';

interface ServiceCardProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  href: string;
  imageSrc?: string;
}

export default function ServiceCard({ title, description, icon, href, imageSrc }: ServiceCardProps) {
  return (
    <motion.div 
      className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300"
      whileHover={{ y: -5, transition: { duration: 0.3 } }}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.5 }}
    >
      {imageSrc && (
        <div className="relative h-48 w-full">
          <Image 
            src={imageSrc} 
            alt={title} 
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        </div>
      )}
      
      <div className="p-6">
        <div className="flex items-center mb-4">
          <span className="text-primary mr-3">
            {icon}
          </span>
          <h3 className="text-xl font-semibold">{title}</h3>
        </div>
        
        <p className="text-gray-600 mb-5">{description}</p>
        
        <Link 
          href={href} 
          className="text-primary hover:text-primary-dark transition-colors duration-300 flex items-center"
        >
          Подробнее
          <svg 
            className="w-4 h-4 ml-2" 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24" 
            xmlns="http://www.w3.org/2000/svg"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth="2" 
              d="M14 5l7 7m0 0l-7 7m7-7H3"
            />
          </svg>
        </Link>
      </div>
    </motion.div>
  );
} 