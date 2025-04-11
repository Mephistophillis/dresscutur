'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import FabricDetail from './FabricDetail';
import { Fabric } from '../../lib/types';

interface FabricCardProps {
  fabric: Fabric;
}

const FabricCard: React.FC<FabricCardProps> = ({ fabric }) => {
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [imageError, setImageError] = useState(false);

  const cardVariants = {
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

  // Function to generate a background color based on fabric name
  const generateColor = (name: string): string => {
    const colors = [
      'bg-pink-100', 'bg-blue-100', 'bg-green-100', 
      'bg-yellow-100', 'bg-purple-100', 'bg-red-100', 
      'bg-indigo-100', 'bg-gray-100'
    ];
    
    // Use the sum of char codes to deterministically select a color
    const sum = name.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    return colors[sum % colors.length];
  };

  return (
    <>
      <motion.div
        className="bg-white rounded-xl overflow-hidden shadow-md hover-lift"
        variants={cardVariants}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        whileHover={{
          y: -8,
          transition: { duration: 0.2 }
        }}
      >
        <div className="relative h-64 overflow-hidden">
          {imageError ? (
            // Placeholder for failed images
            <div className={`w-full h-full flex items-center justify-center ${generateColor(fabric.name)}`}>
              <div className="text-center p-4">
                <div className="text-primary text-4xl mb-2 font-bold">{fabric.name.charAt(0)}</div>
                <div className="text-sm text-gray-600">{fabric.name}</div>
              </div>
            </div>
          ) : (
            <>
              <div className="absolute inset-0 bg-gray-300 animate-pulse">
                {/* Placeholder for image loading */}
              </div>
              <Image
                src={fabric.image}
                alt={fabric.name}
                fill
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                className={`object-cover transition-transform duration-500 ${
                  isHovered ? 'scale-110' : 'scale-100'
                }`}
                onError={() => setImageError(true)}
              />
            </>
          )}
          
          {fabric.colors && (
            <div className="absolute bottom-4 left-4 flex space-x-2">
              {fabric.colors.map((color, index) => (
                <div
                  key={index}
                  className="w-6 h-6 rounded-full border-2 border-white"
                  style={{ backgroundColor: color }}
                ></div>
              ))}
              {fabric.colors.length > 4 && (
                <div className="w-6 h-6 rounded-full bg-white text-xs flex items-center justify-center">
                  +{fabric.colors.length - 4}
                </div>
              )}
            </div>
          )}
        </div>
        <div className="p-6">
          <div className="flex justify-between items-start mb-2">
            <h3 className="text-xl font-semibold text-dark">{fabric.name}</h3>
            {fabric.price && (
              <span className="text-primary font-medium">{fabric.price} ₽/м</span>
            )}
          </div>
          <p className="text-gray-600 mb-4 line-clamp-2">{fabric.description}</p>
          <div className="flex flex-wrap gap-2 mb-4">
            {fabric.properties?.map((property, index) => (
              <span key={index} className="text-xs bg-secondary px-2 py-1 rounded-full text-dark">
                {property}
              </span>
            ))}
          </div>
          <button
            className="w-full py-2 text-primary border border-primary rounded-md hover:bg-primary hover:text-white transition-colors"
            onClick={() => setIsDetailOpen(true)}
          >
            Подробнее
          </button>
        </div>
      </motion.div>

      {isDetailOpen && (
        <FabricDetail fabric={fabric} onClose={() => setIsDetailOpen(false)} />
      )}
    </>
  );
};

export default FabricCard; 