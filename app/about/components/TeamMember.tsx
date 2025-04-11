'use client';

import { useState } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';

interface SocialLink {
  platform: string;
  url: string;
  icon: JSX.Element;
}

interface TeamMemberProps {
  name: string;
  role: string;
  image: string;
  description: string;
  specialization: string[];
  socialLinks?: SocialLink[];
}

export default function TeamMember({ 
  name, 
  role, 
  image, 
  description, 
  specialization,
  socialLinks 
}: TeamMemberProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <motion.div 
      className="bg-white rounded-lg shadow-md overflow-hidden hover-lift"
      whileHover={{ y: -5 }}
    >
      <div className="relative h-80 overflow-hidden">
        <Image
          src={image}
          alt={`${name} - ${role}`}
          fill
          className="object-cover object-center"
          sizes="(max-width: 768px) 100vw, 33vw"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
        
        {/* Overlay info */}
        <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
          <h3 className="text-xl font-semibold mb-1">{name}</h3>
          <p className="text-sm text-white/90">{role}</p>
        </div>
      </div>

      <div className="p-6">
        <div className="flex flex-wrap gap-2 mb-4">
          {specialization.map((skill, index) => (
            <span 
              key={index} 
              className="inline-block px-3 py-1 bg-secondary text-dark text-sm rounded-full"
            >
              {skill}
            </span>
          ))}
        </div>

        <div className={`overflow-hidden transition-all duration-300 ${isExpanded ? 'max-h-96' : 'max-h-24'}`}>
          <p className="text-dark/80">{description}</p>
        </div>

        {description.length > 150 && (
          <button 
            className="mt-3 text-primary font-medium flex items-center text-sm"
            onClick={() => setIsExpanded(!isExpanded)}
            aria-expanded={isExpanded}
          >
            {isExpanded ? 'Свернуть' : 'Узнать больше'}
            <svg 
              width="20" 
              height="20" 
              viewBox="0 0 20 20" 
              fill="none" 
              xmlns="http://www.w3.org/2000/svg"
              className={`ml-1 transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`}
            >
              <path d="M5 7.5L10 12.5L15 7.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
        )}

        {/* Social Links */}
        {socialLinks && socialLinks.length > 0 && (
          <div className="mt-4 flex gap-2">
            {socialLinks.map((link, index) => (
              <a 
                key={index}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 text-gray-600 hover:bg-primary hover:text-white transition-colors duration-300"
                aria-label={`${name} на ${link.platform}`}
              >
                {link.icon}
              </a>
            ))}
          </div>
        )}
      </div>
    </motion.div>
  );
} 