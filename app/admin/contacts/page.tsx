import { Metadata } from 'next';
import { getContacts } from '~/app/actions/admin/contacts';
import ContactsTable from '~/app/components/admin/ContactsTable';
import Link from 'next/link';

// Отключаем кеширование данных для этой страницы
export const dynamic = 'force-dynamic';
export const revalidate = 0;

// Заставляем Next.js полностью перерендерить страницу
export const fetchCache = 'force-no-store';

export const metadata: Metadata = {
  title: 'Управление заявками | Админ-панель',
  description: 'Управление контактными заявками.'
};

export default async function ContactsPage({
  searchParams,
}: {
  searchParams: Promise<{
    status?: string;
  }>;
}) {
  const params = await searchParams;
  const status = params?.status || 'all';
  const contacts = await getContacts(status);
  
  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'NEW': return 'Новые';
      case 'IN_PROGRESS': return 'В обработке';
      case 'COMPLETED': return 'Завершенные';
      case 'CANCELED': return 'Отмененные';
      default: return 'Все';
    }
  };
  
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold tracking-tight">Управление заявками</h1>
        <div className="text-sm text-gray-500">
          Всего заявок: <span className="font-medium">{contacts.length}</span>
        </div>
      </div>
      
      {/* Фильтры */}
      <div className="flex space-x-1 p-1 bg-gray-100 rounded-lg w-fit">
        <Link 
          href="/admin/contacts"
          className={`px-3 py-2 text-sm font-medium rounded-md transition-colors ${
            status === 'all' 
              ? 'bg-white text-gray-900 shadow-sm' 
              : 'text-gray-700 hover:text-gray-900 hover:bg-gray-50'
          }`}
        >
          Все
        </Link>
        <Link 
          href="/admin/contacts?status=NEW"
          className={`px-3 py-2 text-sm font-medium rounded-md transition-colors ${
            status === 'NEW' 
              ? 'bg-white text-gray-900 shadow-sm' 
              : 'text-gray-700 hover:text-gray-900 hover:bg-gray-50'
          }`}
        >
          Новые
        </Link>
        <Link 
          href="/admin/contacts?status=IN_PROGRESS"
          className={`px-3 py-2 text-sm font-medium rounded-md transition-colors ${
            status === 'IN_PROGRESS' 
              ? 'bg-white text-gray-900 shadow-sm' 
              : 'text-gray-700 hover:text-gray-900 hover:bg-gray-50'
          }`}
        >
          В обработке
        </Link>
        <Link 
          href="/admin/contacts?status=COMPLETED"
          className={`px-3 py-2 text-sm font-medium rounded-md transition-colors ${
            status === 'COMPLETED' 
              ? 'bg-white text-gray-900 shadow-sm' 
              : 'text-gray-700 hover:text-gray-900 hover:bg-gray-50'
          }`}
        >
          Завершенные
        </Link>
        <Link 
          href="/admin/contacts?status=CANCELED"
          className={`px-3 py-2 text-sm font-medium rounded-md transition-colors ${
            status === 'CANCELED' 
              ? 'bg-white text-gray-900 shadow-sm' 
              : 'text-gray-700 hover:text-gray-900 hover:bg-gray-50'
          }`}
        >
          Отмененные
        </Link>
      </div>
      
      {/* Таблица заявок */}
      <div className="bg-white rounded-lg border">
        <div className="px-6 py-4 border-b">
          <h2 className="text-lg font-semibold">
            {getStatusLabel(status)} заявки ({contacts.length})
          </h2>
        </div>
        <ContactsTable contacts={contacts} />
      </div>
      
      {contacts.length === 0 && (
        <div className="p-8 text-center">
          <p className="text-gray-500">
            {status === 'all' 
              ? 'Заявки не найдены. Когда клиенты отправят новые запросы, они появятся здесь.'
              : `Нет заявок со статусом "${getStatusLabel(status)}".`
            }
          </p>
        </div>
      )}
    </div>
  );
} 