import { Suspense } from 'react';
import Link from 'next/link';
import { getDashboardStats, getRecentContacts, getRecentEvents, getWeeklyContactsStats } from '../actions/admin/dashboard-stats';
import { Card, CardContent, CardHeader, CardTitle, MetricCard } from './components/ui/card';
import { Badge } from './components/ui/badge';
import { CalendarDays, MessageCircle, Image, TrendingUp, TrendingDown, Clock, AlertCircle, ArrowUpRight } from 'lucide-react';

// Компонент загрузки
function LoadingCard() {
  return (
    <Card>
      <CardContent className="p-6">
        <div className="space-y-3">
          <div className="h-4 bg-slate-200 rounded animate-pulse"></div>
          <div className="h-8 bg-slate-200 rounded animate-pulse"></div>
          <div className="h-3 bg-slate-200 rounded animate-pulse w-1/2"></div>
        </div>
      </CardContent>
    </Card>
  );
}

// Компонент статистической карточки
function StatsCard({ 
  title, 
  value, 
  change,
  trend,
  icon: Icon 
}: { 
  title: string;
  value: string | number;
  change?: number;
  trend?: 'up' | 'down' | 'neutral';
  icon: React.ElementType;
}) {
  const getTrendColor = () => {
    if (trend === 'up') return 'text-green-600';
    if (trend === 'down') return 'text-red-600';
    return 'text-slate-500';
  };

  const getTrendIcon = () => {
    if (trend === 'up') return <TrendingUp className="w-4 h-4" />;
    if (trend === 'down') return <TrendingDown className="w-4 h-4" />;
    return null;
  };

  return (
    <MetricCard
      title={title}
      value={value}
      subtitle={
        change !== undefined ? (
          <span className={`flex items-center ${getTrendColor()}`}>
            {getTrendIcon()}
            <span className="ml-1">{Math.abs(change)}% за неделю</span>
          </span>
        ) : undefined
      }
      icon={<Icon className="w-6 h-6" />}
      color="violet"
    />
  );
}

// Компонент недавней активности
interface Contact {
  id: string;
  name: string;
  email: string;
  subject: string;
  status: string;
  createdAt: Date;
}

interface Event {
  id: string;
  title: string;
  clientName?: string | null;
  startDate: Date;
  createdAt: Date;
  status: string;
}

function RecentActivities({ 
  contacts, 
  events 
}: { 
  contacts: Contact[];
  events: Event[];
}) {
  const getStatusBadge = (status: string) => {
    const statusMap: { [key: string]: { variant: 'default' | 'success' | 'warning' | 'destructive' | 'info', label: string } } = {
      'NEW': { variant: 'info', label: 'Новая' },
      'IN_PROGRESS': { variant: 'warning', label: 'В работе' },
      'COMPLETED': { variant: 'success', label: 'Завершена' },
      'CANCELED': { variant: 'destructive', label: 'Отменена' },
      'PENDING': { variant: 'warning', label: 'Ожидает' },
      'CONFIRMED': { variant: 'success', label: 'Подтверждено' },
    };

    const config = statusMap[status] || { variant: 'default' as const, label: status };
    return <Badge variant={config.variant}>{config.label}</Badge>;
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Недавние заявки */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center text-lg">
              <MessageCircle className="h-5 w-5 mr-2 text-violet-600" />
              Недавние заявки
            </CardTitle>
            <Link 
              href="/admin/contacts" 
              className="text-sm text-violet-600 hover:text-violet-700 flex items-center"
            >
              Все заявки
              <ArrowUpRight className="w-4 h-4 ml-1" />
            </Link>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          {contacts.length === 0 ? (
            <div className="p-6 text-center text-slate-500">
              <MessageCircle className="w-8 h-8 mx-auto mb-2 text-slate-300" />
              <p>Нет новых заявок</p>
            </div>
          ) : (
            <div className="space-y-0">
              {contacts.map((contact, index) => (
                <div 
                  key={contact.id}
                  className={`p-4 ${index !== contacts.length - 1 ? 'border-b border-slate-100' : ''}`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-slate-900 truncate">
                        {contact.name}
                      </p>
                      <p className="text-sm text-slate-500 truncate">
                        {contact.email}
                      </p>
                      <p className="text-xs text-slate-400 mt-1">
                        {contact.subject}
                      </p>
                    </div>
                    <div className="flex flex-col items-end ml-4">
                      {getStatusBadge(contact.status)}
                      <p className="text-xs text-slate-400 mt-1">
                        {new Date(contact.createdAt).toLocaleDateString('ru-RU')}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Недавние события */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center text-lg">
              <CalendarDays className="h-5 w-5 mr-2 text-violet-600" />
              Недавние события
            </CardTitle>
            <Link 
              href="/admin/calendar" 
              className="text-sm text-violet-600 hover:text-violet-700 flex items-center"
            >
              Календарь
              <ArrowUpRight className="w-4 h-4 ml-1" />
            </Link>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          {events.length === 0 ? (
            <div className="p-6 text-center text-slate-500">
              <CalendarDays className="w-8 h-8 mx-auto mb-2 text-slate-300" />
              <p>Нет новых событий</p>
            </div>
          ) : (
            <div className="space-y-0">
              {events.map((event, index) => (
                <div 
                  key={event.id}
                  className={`p-4 ${index !== events.length - 1 ? 'border-b border-slate-100' : ''}`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-slate-900 truncate">
                        {event.title}
                      </p>
                      <p className="text-sm text-slate-500 truncate">
                        {event.clientName}
                      </p>
                      <p className="text-xs text-slate-400 mt-1">
                        {new Date(event.startDate).toLocaleDateString('ru-RU')}
                      </p>
                    </div>
                    <div className="flex flex-col items-end ml-4">
                      {getStatusBadge(event.status)}
                      <p className="text-xs text-slate-400 mt-1">
                        {new Date(event.createdAt).toLocaleDateString('ru-RU')}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

// Главный компонент дашборда
export default async function AdminDashboard() {
  const [stats, weeklyStats, recentContacts, recentEvents] = await Promise.all([
    getDashboardStats(),
    getWeeklyContactsStats(),
    getRecentContacts(5),
    getRecentEvents(5)
  ]);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Добро пожаловать!</h1>
          <p className="text-slate-600 mt-1">
            Обзор активности вашего ателье за сегодня
          </p>
        </div>
        <div className="text-sm text-slate-500 bg-slate-50 px-3 py-2 rounded-lg">
          <Clock className="w-4 h-4 inline mr-2" />
          Обновлено: {new Date().toLocaleString('ru-RU')}
        </div>
      </div>
      
      {/* Основная статистика */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <Suspense fallback={<LoadingCard />}>
          <StatsCard 
            title="Заявки за неделю" 
            value={weeklyStats.thisWeek} 
            change={weeklyStats.change}
            trend={weeklyStats.change > 0 ? 'up' : weeklyStats.change < 0 ? 'down' : 'neutral'}
            icon={MessageCircle} 
          />
        </Suspense>
        
        <Suspense fallback={<LoadingCard />}>
          <StatsCard 
            title="Новые заявки" 
            value={stats.contacts.new} 
            icon={AlertCircle} 
          />
        </Suspense>
        
        <Suspense fallback={<LoadingCard />}>
          <StatsCard 
            title="События календаря" 
            value={stats.events.total} 
            icon={CalendarDays} 
          />
        </Suspense>
        
        <Suspense fallback={<LoadingCard />}>
          <StatsCard 
            title="Работы в галерее" 
            value={stats.gallery.active} 
            icon={Image} 
          />
        </Suspense>
      </div>

      {/* Детальная статистика */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Статистика заявок */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center text-lg">
              <MessageCircle className="h-5 w-5 mr-2 text-violet-600" />
              Заявки
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center p-3 bg-slate-50 rounded-lg">
                <p className="text-2xl font-bold text-slate-900">{stats.contacts.total}</p>
                <p className="text-sm text-slate-600">Всего</p>
              </div>
              <div className="text-center p-3 bg-blue-50 rounded-lg">
                <p className="text-2xl font-bold text-blue-600">{stats.contacts.new}</p>
                <p className="text-sm text-blue-600">Новые</p>
              </div>
            </div>
            <div className="flex justify-between items-center text-sm">
              <span className="text-slate-600">В работе:</span>
              <span className="font-medium text-amber-600">{stats.contacts.inProgress}</span>
            </div>
            <Link href="/admin/contacts" className="block">
              <button className="w-full mt-3 px-4 py-2 text-sm bg-violet-50 text-violet-700 rounded-lg hover:bg-violet-100 transition-colors">
                Управлять заявками
              </button>
            </Link>
          </CardContent>
        </Card>

        {/* Статистика календаря */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center text-lg">
              <CalendarDays className="h-5 w-5 mr-2 text-violet-600" />
              Календарь
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center p-3 bg-slate-50 rounded-lg">
                <p className="text-2xl font-bold text-slate-900">{stats.events.pending}</p>
                <p className="text-sm text-slate-600">Ожидают</p>
              </div>
              <div className="text-center p-3 bg-green-50 rounded-lg">
                <p className="text-2xl font-bold text-green-600">{stats.events.confirmed}</p>
                <p className="text-sm text-green-600">Подтверждены</p>
              </div>
            </div>
            <div className="flex justify-between items-center text-sm">
              <span className="text-slate-600">Завершены:</span>
              <span className="font-medium text-green-600">{stats.events.completed}</span>
            </div>
            <Link href="/admin/calendar" className="block">
              <button className="w-full mt-3 px-4 py-2 text-sm bg-violet-50 text-violet-700 rounded-lg hover:bg-violet-100 transition-colors">
                Открыть календарь
              </button>
            </Link>
          </CardContent>
        </Card>

        {/* Статистика контента */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center text-lg">
              <Image className="h-5 w-5 mr-2 text-violet-600" />
              Контент
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-slate-600">Галерея:</span>
                <span className="font-medium">{stats.gallery.active}/{stats.gallery.total}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-slate-600">Услуги:</span>
                <span className="font-medium">{stats.services.active}/{stats.services.total}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-slate-600">Отзывы:</span>
                <span className="font-medium">{stats.testimonials.active}/{stats.testimonials.total}</span>
              </div>
            </div>
            <Link href="/admin/gallery" className="block">
              <button className="w-full mt-3 px-4 py-2 text-sm bg-violet-50 text-violet-700 rounded-lg hover:bg-violet-100 transition-colors">
                Управлять контентом
              </button>
            </Link>
          </CardContent>
        </Card>
      </div>

      {/* Недавние активности */}
      <div>
        <h2 className="text-xl font-semibold text-slate-900 mb-6">Недавняя активность</h2>
        <Suspense fallback={<LoadingCard />}>
          <RecentActivities contacts={recentContacts} events={recentEvents} />
        </Suspense>
      </div>
    </div>
  );
} 