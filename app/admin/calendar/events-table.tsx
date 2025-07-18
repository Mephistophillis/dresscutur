'use client';

interface Event {
  id: string;
  title: string;
  startDate: Date;
  clientName?: string;
  status: string;
}

interface EventsTableProps {
  events: Event[];
}

export default function EventsTable({ events }: EventsTableProps) {
  return (
    <div className="bg-white rounded-lg border">
      <div className="p-4">
        <h3 className="text-lg font-semibold">События ({events.length})</h3>
      </div>
      <div className="border-t">
        {events.length === 0 ? (
          <div className="p-8 text-center text-gray-500">
            Нет событий для отображения
          </div>
        ) : (
          <div className="divide-y">
            {events.map((event) => (
              <div key={event.id} className="p-4 flex justify-between items-center">
                <div>
                  <h4 className="font-medium">{event.title}</h4>
                  <p className="text-sm text-gray-500">
                    {new Date(event.startDate).toLocaleDateString('ru-RU')}
                  </p>
                  {event.clientName && (
                    <p className="text-sm text-gray-600">Клиент: {event.clientName}</p>
                  )}
                </div>
                <div>
                  <span className={`px-2 py-1 text-xs rounded-full ${
                    event.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                    event.status === 'confirmed' ? 'bg-green-100 text-green-800' :
                    'bg-gray-100 text-gray-800'
                  }`}>
                    {event.status === 'pending' ? 'Ожидает' :
                     event.status === 'confirmed' ? 'Подтверждено' :
                     'Завершено'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
} 