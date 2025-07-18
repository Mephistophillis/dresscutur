'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { getFabrics, deleteFabric, toggleFabricActive } from '~/app/actions/admin/fabrics-prisma';
import { Fabric } from '~/app/lib/definitions';

export default function FabricsPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [fabrics, setFabrics] = useState<Fabric[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadFabrics() {
      try {
        setIsLoading(true);
        const data = await getFabrics();
        setFabrics(data);
      } catch (err) {
        console.error('Failed to load fabrics:', err);
        setError('Не удалось загрузить список тканей. Пожалуйста, попробуйте позже.');
      } finally {
        setIsLoading(false);
      }
    }

    loadFabrics();
  }, []);

  // Функция для отображения названия категории
  const getCategoryName = (category: string) => {
    const categories = {
      natural: 'Натуральная',
      synthetic: 'Синтетическая',
      mixed: 'Смешанная',
      lining: 'Подкладочная'
    };
    return categories[category as keyof typeof categories] || category;
  };

  // Функция для удаления ткани
  const handleDelete = async (id: string) => {
    if (confirm('Вы уверены, что хотите удалить эту ткань?')) {
      try {
        const result = await deleteFabric(id);
        if (result.success) {
          // Обновляем список тканей, удаляя удаленную
          setFabrics((prevFabrics) => prevFabrics.filter((fabric) => fabric.id !== id));
        } else {
          setError(result.error || 'Не удалось удалить ткань');
        }
      } catch (err) {
        console.error('Failed to delete fabric:', err);
        setError('Ошибка при удалении ткани');
      }
    }
  };

  // Функция для переключения активности ткани
  const handleToggleActive = async (id: string, currentActive: boolean) => {
    try {
      const result = await toggleFabricActive(id);
      if (result.success) {
        // Обновляем список тканей, изменяя статус активности
        setFabrics((prevFabrics) => prevFabrics.map((fabric) => 
          fabric.id === id ? { ...fabric, isActive: !currentActive } : fabric
        ));
      } else {
        setError(result.error || 'Не удалось изменить статус ткани');
      }
    } catch (err) {
      console.error('Failed to toggle fabric active status:', err);
      setError('Ошибка при изменении статуса ткани');
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Ткани</h1>
        <Link
          href="/admin/fabrics/new"
          className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-md"
        >
          Добавить ткань
        </Link>
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
        </div>
      ) : error ? (
        <div className="bg-red-50 text-red-600 p-4 rounded-md mb-6">
          {error}
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Название
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Категория
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Цена (₽/м)
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Статус
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Порядок
                  </th>
                  <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Действия
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {fabrics.length > 0 ? (
                  fabrics.map((fabric) => (
                    <tr key={fabric.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{fabric.name}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-500">{getCategoryName(fabric.category)}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-500">{fabric.price ? `${fabric.price}` : '-'}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            fabric.isActive
                              ? 'bg-green-100 text-green-800'
                              : 'bg-gray-100 text-gray-800'
                          }`}
                        >
                          {fabric.isActive ? 'Активна' : 'Неактивна'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{fabric.order}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex justify-end space-x-3">
                          <Link
                            href={`/admin/fabrics/${fabric.id}`}
                            className="text-blue-600 hover:text-blue-900"
                          >
                            Редактировать
                          </Link>
                          <button 
                            className="text-blue-600 hover:text-blue-900"
                            onClick={() => handleToggleActive(fabric.id, fabric.isActive)}
                          >
                            {fabric.isActive ? 'Деактивировать' : 'Активировать'}
                          </button>
                          <button 
                            className="text-red-600 hover:text-red-900"
                            onClick={() => handleDelete(fabric.id)}
                          >
                            Удалить
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={6} className="px-6 py-4 text-center text-sm text-gray-500">
                      Ткани не найдены
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
} 