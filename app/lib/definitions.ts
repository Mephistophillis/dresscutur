// Определения типов для админ-панели

export type User = {
  id: string;
  name?: string | null;
  email: string;
  role: 'ADMIN' | 'EDITOR';
  isActive: boolean;
  lastLogin?: Date | null;
  createdAt: Date;
  updatedAt: Date;
};

export type Service = {
  id: string;
  title: string;
  description: string;
  icon?: string | null;
  image?: string | null;
  isActive: boolean;
  order: number;
  createdAt: Date;
  updatedAt: Date;
};

export interface Fabric {
  id: string;
  name: string;
  description: string;
  category: string;
  purpose: string[];
  colors: string[];
  price: number | null;
  image: string;
  properties: string[];
  recommendations: string[];
  isActive: boolean;
  order: number;
  details?: {
    composition: string | null;
    width: number | null;
    weight: number | null;
    care: string[];
    origin: string | null;
    description: string | null;
  };
}

export type FabricDetails = {
  id: string;
  fabricId: string;
  composition?: string | null;
  width?: number | null;
  weight?: number | null;
  care: string[];
  origin?: string | null;
  description?: string | null;
};

export type FabricGallery = {
  id: string;
  fabricId: string;
  url: string;
  alt?: string | null;
};

export type GalleryItem = {
  id: string;
  src: string;
  alt: string;
  category: string;
  description: string;
  isNew: boolean;
  order: number;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
  details?: GalleryItemDetails | null;
  relatedImages?: GalleryRelatedImage[];
};

export type GalleryItemDetails = {
  id: string;
  galleryItemId: string;
  client?: string | null;
  materials: string[];
  date?: string | null;
  process?: string | null;
};

export type GalleryRelatedImage = {
  id: string;
  galleryItemId: string;
  src: string;
  alt?: string | null;
};

export type Testimonial = {
  id: string;
  name: string;
  position?: string | null;
  avatar?: string | null;
  text: string;
  rating: number;
  date?: string | null;
  category?: string | null;
  isVerified: boolean;
  isActive: boolean;
  order: number;
  createdAt: Date;
  updatedAt: Date;
};

export type Price = {
  id: string;
  service: string;
  price: string;
  description?: string | null;
  category?: string | null;
  isActive: boolean;
  order: number;
  createdAt: Date;
  updatedAt: Date;
};

export type FAQ = {
  id: string;
  category: string;
  title?: string | null;
  question: string;
  answer: string;
  helpful: number;
  notHelpful: number;
  isActive: boolean;
  order: number;
  createdAt: Date;
  updatedAt: Date;
};

export type Contact = {
  id: string;
  name: string;
  email: string;
  phone?: string | null;
  subject: string;
  message: string;
  status: 'NEW' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELED';
  assignedTo?: string | null;
  notes?: string | null;
  fileAttachment?: string | null;
  createdAt: Date;
  updatedAt: Date;
}; 