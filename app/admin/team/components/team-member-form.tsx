'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { createTeamMember, updateTeamMember } from '~/app/actions/admin/team-members';
import { toast } from 'sonner';

// Типы для соц. сетей
type SocialLinks = {
  instagram?: string;
  facebook?: string;
  vk?: string;
  linkedin?: string;
  website?: string;
};

// Типы для члена команды
interface TeamMember {
  id: string;
  name: string;
  position: string;
  bio: string;
  photo: string;
  location?: string | null;
  isActive: boolean;
  order: number;
  socialLinks?: SocialLinks | null;
}

interface TeamMemberFormProps {
  teamMember?: TeamMember;
}

export default function TeamMemberForm({ teamMember }: TeamMemberFormProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [previewImage, setPreviewImage] = useState<string | null>(teamMember?.photo || null);
  
  // Вспомогательная функция для расшифровки socialLinks из JSON
  const getSocialLink = (key: keyof SocialLinks): string => {
    if (!teamMember?.socialLinks) return '';
    return (teamMember.socialLinks[key] || '') as string;
  };
  
  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSubmitting(true);
    
    try {
      const formData = new FormData(event.currentTarget);
      
      // Добавляем socialLinks как отдельные поля
      formData.append('isActive', teamMember?.isActive !== false ? 'true' : 'false');
      
      let result;
      
      if (teamMember) {
        // Обновление существующего члена команды
        result = await updateTeamMember(teamMember.id, formData);
      } else {
        // Создание нового члена команды
        result = await createTeamMember(formData);
      }
      
      if (result.success) {
        toast.success(result.message || 'Данные успешно сохранены');
        router.push('/admin/team');
        router.refresh();
      } else {
        toast.error(result.message || 'Произошла ошибка при сохранении');
      }
    } catch (error) {
      console.error('Ошибка при отправке формы:', error);
      toast.error('Произошла ошибка при сохранении данных');
    } finally {
      setIsSubmitting(false);
    }
  };
  
  // Обработчик изменения файла изображения
  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setPreviewImage(url);
    }
  };
  
  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Основная информация */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div>
            <label 
              htmlFor="name" 
              className="block text-sm font-medium text-gray-700"
            >
              Имя <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="name"
              name="name"
              defaultValue={teamMember?.name || ''}
              required
              className="mt-1 block w-full border border-gray-300 px-3 py-2 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>
          
          <div>
            <label 
              htmlFor="position" 
              className="block text-sm font-medium text-gray-700"
            >
              Должность <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="position"
              name="position"
              defaultValue={teamMember?.position || ''}
              required
              className="mt-1 block w-full border border-gray-300 px-3 py-2 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>
          
          <div>
            <label 
              htmlFor="location" 
              className="block text-sm font-medium text-gray-700"
            >
              Локация / Филиал
            </label>
            <input
              type="text"
              id="location"
              name="location"
              defaultValue={teamMember?.location || ''}
              className="mt-1 block w-full border border-gray-300 px-3 py-2 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>
          
          <div>
            <label 
              htmlFor="order" 
              className="block text-sm font-medium text-gray-700"
            >
              Порядок сортировки
            </label>
            <input
              type="number"
              id="order"
              name="order"
              defaultValue={teamMember?.order || 0}
              min="0"
              className="mt-1 block w-full border border-gray-300 px-3 py-2 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>
        </div>
        
        <div className="space-y-4">
          <div>
            <label 
              htmlFor="photo" 
              className="block text-sm font-medium text-gray-700"
            >
              Фото <span className="text-red-500">*</span>
            </label>
            <input
              type="file"
              id="photo"
              name="photo"
              accept="image/*"
              onChange={handleImageChange}
              className="sr-only"
            />
            <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
              <div className="space-y-1 text-center">
                {previewImage ? (
                  <div className="relative w-40 h-40 mx-auto mb-4">
                    <Image
                      src={previewImage}
                      alt="Preview"
                      fill
                      className="object-cover rounded-full"
                    />
                  </div>
                ) : (
                  <svg
                    className="mx-auto h-12 w-12 text-gray-400"
                    stroke="currentColor"
                    fill="none"
                    viewBox="0 0 48 48"
                  >
                    <path
                      d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                      strokeWidth={2}
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                )}
                <div className="flex text-sm text-gray-600">
                  <label
                    htmlFor="photo"
                    className="relative cursor-pointer bg-white rounded-md font-medium text-indigo-600 hover:text-indigo-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-indigo-500"
                  >
                    <span>Загрузить изображение</span>
                  </label>
                </div>
                <p className="text-xs text-gray-500">
                  PNG, JPG, GIF до 10MB
                </p>
              </div>
            </div>
          </div>
          
          <div>
            <label 
              htmlFor="bio" 
              className="block text-sm font-medium text-gray-700"
            >
              Описание <span className="text-red-500">*</span>
            </label>
            <textarea
              id="bio"
              name="bio"
              rows={4}
              defaultValue={teamMember?.bio || ''}
              required
              className="mt-1 block w-full border border-gray-300 px-3 py-2 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>
        </div>
      </div>
      
      {/* Социальные сети */}
      <div className="border-t border-gray-200 pt-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Социальные сети</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label 
              htmlFor="instagram" 
              className="block text-sm font-medium text-gray-700"
            >
              Instagram
            </label>
            <input
              type="text"
              id="instagram"
              name="instagram"
              defaultValue={getSocialLink('instagram')}
              className="mt-1 block w-full border border-gray-300 px-3 py-2 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>
          
          <div>
            <label 
              htmlFor="facebook" 
              className="block text-sm font-medium text-gray-700"
            >
              Facebook
            </label>
            <input
              type="text"
              id="facebook"
              name="facebook"
              defaultValue={getSocialLink('facebook')}
              className="mt-1 block w-full border border-gray-300 px-3 py-2 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>
          
          <div>
            <label 
              htmlFor="vk" 
              className="block text-sm font-medium text-gray-700"
            >
              ВКонтакте
            </label>
            <input
              type="text"
              id="vk"
              name="vk"
              defaultValue={getSocialLink('vk')}
              className="mt-1 block w-full border border-gray-300 px-3 py-2 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>
          
          <div>
            <label 
              htmlFor="linkedin" 
              className="block text-sm font-medium text-gray-700"
            >
              LinkedIn
            </label>
            <input
              type="text"
              id="linkedin"
              name="linkedin"
              defaultValue={getSocialLink('linkedin')}
              className="mt-1 block w-full border border-gray-300 px-3 py-2 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>
          
          <div>
            <label 
              htmlFor="website" 
              className="block text-sm font-medium text-gray-700"
            >
              Личный сайт
            </label>
            <input
              type="text"
              id="website"
              name="website"
              defaultValue={getSocialLink('website')}
              className="mt-1 block w-full border border-gray-300 px-3 py-2 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>
        </div>
      </div>
      
      {/* Кнопки действий */}
      <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200">
        <button
          type="button"
          onClick={() => router.push('/admin/team')}
          className="px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          disabled={isSubmitting}
        >
          Отмена
        </button>
        <button
          type="submit"
          className="px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Сохранение...' : teamMember ? 'Обновить' : 'Создать'}
        </button>
      </div>
    </form>
  );
} 