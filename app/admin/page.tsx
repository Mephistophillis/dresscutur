import { Suspense } from 'react';
import Link from 'next/link';
import { DashboardCard, StatsCard, ActivityCard } from './components/ui/cards';

// Simple icon components
const Icons = {
  Scissors: (props: any) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <circle cx="6" cy="6" r="3" />
      <circle cx="6" cy="18" r="3" />
      <line x1="20" y1="4" x2="8.12" y2="15.88" />
      <line x1="14.47" y1="14.48" x2="20" y2="20" />
      <line x1="8.12" y1="8.12" x2="12" y2="12" />
    </svg>
  ),
  Shirt: (props: any) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M20.38 3.46 16 2a4 4 0 0 1-8 0L3.62 3.46a2 2 0 0 0-1.34 2.23l.58 3.47a1 1 0 0 0 .99.84H6v10c0 1.1.9 2 2 2h8a2 2 0 0 0 2-2V10h2.15a1 1 0 0 0 .99-.84l.58-3.47a2 2 0 0 0-1.34-2.23z" />
    </svg>
  ),
  Image: (props: any) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
      <circle cx="8.5" cy="8.5" r="1.5" />
      <polyline points="21 15 16 10 5 21" />
    </svg>
  ),
  MessageSquare: (props: any) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
    </svg>
  ),
  FileText: (props: any) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
      <polyline points="14 2 14 8 20 8" />
      <line x1="16" y1="13" x2="8" y2="13" />
      <line x1="16" y1="17" x2="8" y2="17" />
      <polyline points="10 9 9 9 8 9" />
    </svg>
  ),
  DollarSign: (props: any) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <line x1="12" y1="1" x2="12" y2="23" />
      <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
    </svg>
  ),
  MessageCircle: (props: any) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
    </svg>
  ),
  Settings: (props: any) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <circle cx="12" cy="12" r="3" />
      <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" />
    </svg>
  ),
  Users: (props: any) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
      <path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
  ),
  BarChart: (props: any) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <line x1="12" y1="20" x2="12" y2="10" />
      <line x1="18" y1="20" x2="18" y2="4" />
      <line x1="6" y1="20" x2="6" y2="16" />
    </svg>
  ),
  Calendar: (props: any) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
      <line x1="16" y1="2" x2="16" y2="6" />
      <line x1="8" y1="2" x2="8" y2="6" />
      <line x1="3" y1="10" x2="21" y2="10" />
    </svg>
  ),
  Email: (props: any) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
      <polyline points="22,6 12,13 2,6" />
    </svg>
  )
};

// Заглушка для загрузки
function LoadingStats() {
  return <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6 animate-pulse">
    {[1, 2, 3].map(i => (
      <div key={i} className="h-32 bg-gray-200 rounded-lg"></div>
    ))}
  </div>;
}

// Мок данных последних активностей
const recentActivities = [
  { id: '1', description: 'Новый заказ №1234 создан', time: '2 часа назад', user: 'Админ' },
  { id: '2', description: 'Добавлена новая ткань "Шёлк премиум"', time: '5 часов назад', user: 'Админ' },
  { id: '3', description: 'Обновлена галерея', time: 'вчера, 15:30', user: 'Админ' },
  { id: '4', description: 'Получен новый отзыв от клиента', time: 'вчера, 10:15', user: 'Система' },
];

// Компонент дашборда
export default function AdminDashboard() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold mb-6">Панель управления</h1>
      
      {/* Статистика */}
      <div className="mb-8">
        <h2 className="text-lg font-semibold mb-4">Статистика сайта</h2>
        <Suspense fallback={<LoadingStats />}>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <StatsCard 
              title="Заявки за неделю" 
              value={12} 
              change={3} 
              icon={Icons.MessageCircle} 
            />
            <StatsCard 
              title="Просмотры галереи" 
              value={254} 
              change="15%" 
              icon={Icons.BarChart} 
            />
            <StatsCard 
              title="Новые посетители" 
              value={47} 
              change={-5} 
              positive={false} 
              icon={Icons.Users} 
            />
          </div>
        </Suspense>
      </div>
      
      {/* Разделы админки */}
      <div className="mb-8">
        <h2 className="text-lg font-semibold mb-4">Управление контентом</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <DashboardCard 
            title="Услуги" 
            description="Управление списком услуг" 
            href="/admin/services" 
            icon={Icons.Scissors} 
          />
          <DashboardCard 
            title="Ткани" 
            description="Управление каталогом тканей" 
            href="/admin/fabrics" 
            icon={Icons.Shirt} 
          />
          <DashboardCard 
            title="Галерея" 
            description="Управление фотогалереей" 
            href="/admin/gallery" 
            icon={Icons.Image} 
          />
          <DashboardCard 
            title="Отзывы" 
            description="Модерация отзывов" 
            href="/admin/testimonials" 
            icon={Icons.MessageSquare} 
          />
          <DashboardCard 
            title="Цены" 
            description="Настройка прайс-листа" 
            href="/admin/prices" 
            icon={Icons.DollarSign} 
          />
          <DashboardCard 
            title="FAQ" 
            description="Часто задаваемые вопросы" 
            href="/admin/faqs" 
            icon={Icons.FileText} 
          />
          <DashboardCard 
            title="Заявки" 
            description="Управление заявками" 
            href="/admin/contacts" 
            icon={Icons.Email} 
          />
          <DashboardCard 
            title="Настройки" 
            description="Общие настройки сайта" 
            href="/admin/settings" 
            icon={Icons.Settings} 
          />
        </div>
      </div>
      
      {/* Последние активности */}
      <div className="mb-6">
        <h2 className="text-lg font-semibold mb-4">Последние активности</h2>
        <ActivityCard 
          title="Недавние действия"
          activities={recentActivities}
        />
      </div>
      
      {/* Календарь событий (заглушка) */}
      <div className="bg-white p-6 rounded-lg shadow border border-gray-200">
        <div className="flex items-center mb-4">
          <Icons.Calendar className="w-5 h-5 text-gray-500 mr-2" />
          <h2 className="text-lg font-semibold">Календарь событий</h2>
        </div>
        <p className="text-gray-500">Функционал календаря в разработке</p>
      </div>
    </div>
  );
} 