import Link from 'next/link';

// Демо-данные для услуг
const services = [
  {
    id: '1',
    title: 'Индивидуальный пошив',
    description: 'Создание уникальной одежды по вашим меркам и пожеланиям.',
    isActive: true,
    order: 1,
  },
  {
    id: '2',
    title: 'Ремонт и реставрация',
    description: 'Профессиональный ремонт любимых вещей: замена молний, подгонка по фигуре, устранение дефектов.',
    isActive: true,
    order: 2,
  },
  {
    id: '3',
    title: 'Пошив штор и текстиля',
    description: 'Изготовление штор, покрывал, подушек и другого домашнего текстиля по индивидуальным размерам.',
    isActive: false,
    order: 3,
  },
  {
    id: '4',
    title: 'Свадебная и вечерняя мода',
    description: 'Создание эксклюзивных свадебных и вечерних нарядов с учетом последних тенденций моды.',
    isActive: true,
    order: 4,
  },
];

export default function ServicesPage() {
  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Услуги</h1>
        <Link
          href="/admin/services/new"
          className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-md"
        >
          Добавить услугу
        </Link>
      </div>

      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Название
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Описание
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
              {services.map((service) => (
                <tr key={service.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{service.title}</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-500 line-clamp-2">{service.description}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        service.isActive
                          ? 'bg-green-100 text-green-800'
                          : 'bg-gray-100 text-gray-800'
                      }`}
                    >
                      {service.isActive ? 'Активна' : 'Неактивна'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{service.order}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex justify-end space-x-3">
                      <Link
                        href={`/admin/services/${service.id}`}
                        className="text-blue-600 hover:text-blue-900"
                      >
                        Редактировать
                      </Link>
                      <button className="text-red-600 hover:text-red-900">
                        Удалить
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
} 