export interface Fabric {
  id: number;
  name: string;
  description: string;
  image: string;
  category: string;
  purpose?: string[];
  colors?: string[];
  price?: number;
  properties?: string[];
  details?: {
    composition?: string;
    width?: number;
    weight?: number;
    care?: string[];
    origin?: string;
    description?: string;
  };
  gallery?: string[];
  recommendations?: string[];
} 