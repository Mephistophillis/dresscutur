'use client';

import { useState, useRef, ChangeEvent } from 'react';
import Image from 'next/image';
import { uploadImage } from '~/app/actions/admin/upload';

export interface ImageUploadProps {
  id: string;
  initialImage?: string | null;
  onImageUpload: (url: string) => void;
  className?: string;
  category?: string;
  label?: string;
  accept?: string;
  maxSizeMB?: number;
}

export default function ImageUpload({
  id,
  initialImage = null,
  onImageUpload,
  className = '',
  category = 'general',
  label = 'Изображение',
  accept = 'image/jpeg, image/png, image/webp',
  maxSizeMB = 5
}: ImageUploadProps) {
  const [imageUrl, setImageUrl] = useState<string | null>(initialImage);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [dropActive, setDropActive] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const maxSizeBytes = maxSizeMB * 1024 * 1024; // Convert MB to bytes

  const handleFileChange = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    await uploadFile(file);
  };

  const uploadFile = async (file: File) => {
    // Validate file size
    if (file.size > maxSizeBytes) {
      setError(`Размер файла превышает ${maxSizeMB}MB`);
      return;
    }

    // Validate file type
    if (!file.type.startsWith('image/')) {
      setError('Файл должен быть изображением');
      return;
    }

    try {
      setIsUploading(true);
      setError(null);

      // Create form data for upload
      const formData = new FormData();
      formData.append('file', file);
      formData.append('category', category);

      // Upload the image
      const result = await uploadImage(formData);

      if (result.success && result.url) {
        setImageUrl(result.url);
        onImageUpload(result.url);
      } else {
        setError(result.error || 'Ошибка при загрузке изображения');
      }
    } catch (err) {
      console.error('Ошибка при загрузке:', err);
      setError('Ошибка при загрузке изображения');
    } finally {
      setIsUploading(false);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setDropActive(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setDropActive(false);
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    setDropActive(false);
    
    const file = e.dataTransfer.files?.[0];
    if (!file) return;
    
    await uploadFile(file);
  };

  const handleRemoveImage = () => {
    setImageUrl(null);
    onImageUpload('');
    if (inputRef.current) {
      inputRef.current.value = '';
    }
  };

  const handleBrowseClick = () => {
    inputRef.current?.click();
  };

  return (
    <div className={`w-full ${className}`}>
      <label htmlFor={id} className="block text-sm font-medium text-gray-700 mb-1">
        {label}
      </label>
      
      <div
        className={`border-2 border-dashed rounded-lg p-4 transition-colors ${
          dropActive 
            ? 'border-blue-400 bg-blue-50' 
            : 'border-gray-300 hover:border-gray-400'
        }`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <input
          ref={inputRef}
          type="file"
          id={id}
          accept={accept}
          onChange={handleFileChange}
          className="hidden"
        />
        
        {imageUrl ? (
          <div className="relative">
            <div className="relative w-full h-48 overflow-hidden rounded-md bg-gray-100">
              <Image
                src={imageUrl}
                alt="Предпросмотр изображения"
                fill
                sizes="(max-width: 768px) 100vw, 300px"
                className="object-contain"
              />
            </div>
            <button
              type="button"
              onClick={handleRemoveImage}
              className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full hover:bg-red-600"
              aria-label="Удалить изображение"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </button>
          </div>
        ) : (
          <div className="text-center">
            <svg 
              className="mx-auto h-12 w-12 text-gray-400" 
              fill="none" 
              viewBox="0 0 24 24" 
              stroke="currentColor" 
              aria-hidden="true"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" 
              />
            </svg>
            <div className="mt-2">
              <button
                type="button"
                onClick={handleBrowseClick}
                className="px-3 py-1.5 bg-white border border-gray-300 rounded-md text-sm text-blue-600 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              >
                Выбрать файл
              </button>
            </div>
            <p className="mt-1 text-xs text-gray-500">
              PNG, JPG, WEBP до {maxSizeMB}MB
            </p>
            <p className="mt-2 text-xs text-gray-500">
              или перетащите файл сюда
            </p>
          </div>
        )}
      </div>
      
      {isUploading && (
        <div className="mt-2 h-1.5 w-full bg-gray-200 rounded-full overflow-hidden">
          <div className="h-full bg-blue-600 rounded-full animate-pulse"></div>
        </div>
      )}
      
      {error && (
        <p className="mt-2 text-sm text-red-600">{error}</p>
      )}
    </div>
  );
} 