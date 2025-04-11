import React from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';

interface FabricProps {
  fabric: {
    id: number;
    name: string;
    description: string;
    image: string;
    color: string;
  };
}

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

const FabricCard: React.FC<FabricProps> = ({ fabric }) => {
  return (
    <motion.div 
      className="overflow-hidden rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300"
      style={{ backgroundColor: fabric.color }}
      variants={itemVariants}
      whileHover={{ 
        scale: 1.03,
        transition: { duration: 0.2 }
      }}
    >
      <div className="h-64 relative overflow-hidden">
        <div className="absolute inset-0 bg-gray-300 animate-pulse">
          {/* Placeholder for image loading */}
        </div>
        <Image
          src={fabric.image}
          alt={fabric.name}
          fill
          className="object-cover transition-transform duration-300 group-hover:scale-105"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          priority={fabric.id <= 3}
        />
      </div>
      <div className="p-6">
        <h3 className="text-xl font-bold mb-2 text-gray-900">{fabric.name}</h3>
        <p className="text-gray-700">{fabric.description}</p>
      </div>
    </motion.div>
  );
};

export default FabricCard; 