import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Button } from '../components/ui/button';
import { CalendarDays, List, Users, Clock, CheckCircle, XCircle } from 'lucide-react';
import Link from 'next/link';
import { getEvents, getEventsStatistics } from '../../actions/admin/events-prisma';
import EventsTable from './events-table';
import CalendarView from './calendar-view';

export const dynamic = 'force-dynamic';

type ViewType = 'calendar' | 'list';
type StatusType = 'all' | 'pending' | 'confirmed' | 'completed';

export default async function CalendarPage({
  searchParams,
}: {
  searchParams: Promise<{
    view?: ViewType;
    status?: StatusType;
    date?: string;
  }>;
}) {
  const params = await searchParams;
  const view = params?.view || 'calendar';
  const status = params?.status || 'all';
  const selectedDate = params?.date || new Date().toISOString().split('T')[0];

  // Получаем события за текущий месяц
  const startOfMonth = new Date(selectedDate);
  startOfMonth.setDate(1);
  const endOfMonth = new Date(startOfMonth);
  endOfMonth.setMonth(endOfMonth.getMonth() + 1);
  endOfMonth.setDate(0);

  const eventsData = await getEvents(
    startOfMonth.toISOString(),
    endOfMonth.toISOString(),
    status === 'all' ? undefined : status
  );
  
  // Преобразуем строковые даты в Date объекты для компонентов
  const events = eventsData.map(event => ({
    ...event,
    startDate: new Date(event.startDate),
    endDate: new Date(event.endDate),
    clientName: event.clientName || undefined
  }));
  const stats = await getEventsStatistics();

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Календарь событий</h1>
        <div className="flex gap-2">
          <Link 
            href={`/admin/calendar?view=calendar&status=${status}&date=${selectedDate}`}
            className={view === 'calendar' ? 'opacity-100' : 'opacity-60'}
          >
            <Button variant={view === 'calendar' ? 'default' : 'outline'} size="sm">
              <CalendarDays className="w-4 h-4 mr-2" />
              Календарь
            </Button>
          </Link>
          <Link 
            href={`/admin/calendar?view=list&status=${status}&date=${selectedDate}`}
            className={view === 'list' ? 'opacity-100' : 'opacity-60'}
          >
            <Button variant={view === 'list' ? 'default' : 'outline'} size="sm">
              <List className="w-4 h-4 mr-2" />
              Список
            </Button>
          </Link>
        </div>
      </div>

      {/* Статистика */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Всего событий</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Ожидают</CardTitle>
            <Clock className="h-4 w-4 text-yellow-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">{stats.pending}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Подтверждены</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{stats.confirmed}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Завершены</CardTitle>
            <XCircle className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{stats.completed}</div>
          </CardContent>
        </Card>
      </div>

      {/* Фильтр по статусу */}
      <div className="flex gap-2">
        <Link href={`/admin/calendar?view=${view}&status=all&date=${selectedDate}`}>
          <Badge variant={status === 'all' ? 'default' : 'outline'}>
            Все
          </Badge>
        </Link>
        <Link href={`/admin/calendar?view=${view}&status=pending&date=${selectedDate}`}>
          <Badge variant={status === 'pending' ? 'default' : 'outline'}>
            Ожидают
          </Badge>
        </Link>
        <Link href={`/admin/calendar?view=${view}&status=confirmed&date=${selectedDate}`}>
          <Badge variant={status === 'confirmed' ? 'default' : 'outline'}>
            Подтверждены
          </Badge>
        </Link>
        <Link href={`/admin/calendar?view=${view}&status=completed&date=${selectedDate}`}>
          <Badge variant={status === 'completed' ? 'default' : 'outline'}>
            Завершены
          </Badge>
        </Link>
      </div>

      {/* Контент */}
      {view === 'calendar' ? (
        <CalendarView events={events} selectedDate={selectedDate} />
      ) : (
        <EventsTable events={events} />
      )}
    </div>
  );
} 