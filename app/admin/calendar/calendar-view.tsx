'use client';

interface Event {
  id: string;
  title: string;
  startDate: Date;
  clientName?: string;
  status: string;
}

interface CalendarViewProps {
  events: Event[];
  selectedDate: string;
}

export default function CalendarView({ events, selectedDate }: CalendarViewProps) {
  const currentDate = new Date(selectedDate);
  const currentMonth = currentDate.getMonth();
  const currentYear = currentDate.getFullYear();

  // Получаем первый день месяца
  const firstDay = new Date(currentYear, currentMonth, 1);
  
  // Получаем первый день недели для отображения
  const startDay = new Date(firstDay);
  startDay.setDate(startDay.getDate() - firstDay.getDay());

  // Генерируем дни для отображения (42 дня = 6 недель)
  const days = [];
  for (let i = 0; i < 42; i++) {
    const day = new Date(startDay);
    day.setDate(day.getDate() + i);
    days.push(day);
  }

  // Группируем события по дням
  const eventsByDate = events.reduce((acc, event) => {
    const eventDate = new Date(event.startDate);
    const dateKey = eventDate.toDateString();
    if (!acc[dateKey]) {
      acc[dateKey] = [];
    }
    acc[dateKey].push(event);
    return acc;
  }, {} as Record<string, Event[]>);

  const monthNames = [
    'Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь',
    'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь'
  ];

  const dayNames = ['Вс', 'Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб'];

  return (
    <div className="bg-white rounded-lg border">
      <div className="p-4 border-b">
        <h3 className="text-lg font-semibold">
          {monthNames[currentMonth]} {currentYear}
        </h3>
      </div>
      
      <div className="p-4">
        {/* Заголовки дней недели */}
        <div className="grid grid-cols-7 gap-1 mb-2">
          {dayNames.map((day) => (
            <div key={day} className="p-2 text-center text-sm font-medium text-gray-600">
              {day}
            </div>
          ))}
        </div>

        {/* Календарная сетка */}
        <div className="grid grid-cols-7 gap-1">
          {days.map((day, index) => {
            const isCurrentMonth = day.getMonth() === currentMonth;
            const isToday = day.toDateString() === new Date().toDateString();
            const dayEvents = eventsByDate[day.toDateString()] || [];

            return (
              <div
                key={index}
                className={`min-h-[80px] border border-gray-200 p-1 ${
                  isCurrentMonth ? 'bg-white' : 'bg-gray-50'
                } ${isToday ? 'bg-blue-50 border-blue-200' : ''}`}
              >
                <div className={`text-sm ${
                  isCurrentMonth ? 'text-gray-900' : 'text-gray-400'
                } ${isToday ? 'font-bold text-blue-600' : ''}`}>
                  {day.getDate()}
                </div>
                
                {/* События дня */}
                <div className="mt-1 space-y-1">
                  {dayEvents.slice(0, 2).map((event) => (
                    <div
                      key={event.id}
                      className={`text-xs p-1 rounded truncate ${
                        event.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                        event.status === 'confirmed' ? 'bg-green-100 text-green-800' :
                        'bg-gray-100 text-gray-800'
                      }`}
                      title={`${event.title} - ${event.clientName || 'Без клиента'}`}
                    >
                      {event.title}
                    </div>
                  ))}
                  {dayEvents.length > 2 && (
                    <div className="text-xs text-gray-500">
                      +{dayEvents.length - 2} еще
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
} 