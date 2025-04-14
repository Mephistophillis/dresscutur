'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const sidebarLinks = [
  { name: 'Дашборд', href: '/admin', icon: 'dashboard' },
  { name: 'Услуги', href: '/admin/services', icon: 'services' },
  { name: 'Ткани', href: '/admin/fabrics', icon: 'fabrics' },
  { name: 'Галерея', href: '/admin/gallery', icon: 'gallery' },
  { name: 'Отзывы', href: '/admin/testimonials', icon: 'testimonials' },
  { name: 'Цены', href: '/admin/prices', icon: 'prices' },
  { name: 'FAQ', href: '/admin/faqs', icon: 'faqs' },
  { name: 'Заявки', href: '/admin/contacts', icon: 'contacts' },
  { name: 'Настройки', href: '/admin/settings', icon: 'settings' },
];

interface LayoutProps {
  children: React.ReactNode;
}

export default function AdminLayout({ children }: LayoutProps) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const pathname = usePathname();

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const renderIcon = (icon: string) => {
    // Простая реализация отображения иконок
    return (
      <div className="w-6 h-6 flex items-center justify-center">
        {icon === 'dashboard' && <span>📊</span>}
        {icon === 'services' && <span>🛠️</span>}
        {icon === 'fabrics' && <span>🧵</span>}
        {icon === 'gallery' && <span>🖼️</span>}
        {icon === 'testimonials' && <span>💬</span>}
        {icon === 'prices' && <span>💰</span>}
        {icon === 'faqs' && <span>❓</span>}
        {icon === 'contacts' && <span>📩</span>}
        {icon === 'settings' && <span>⚙️</span>}
      </div>
    );
  };

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <div
        className={`bg-gray-900 text-white transition-all duration-300 ${
          isSidebarOpen ? 'w-64' : 'w-20'
        } min-h-screen`}
      >
        <div className="p-4">
          <div className="flex items-center justify-between">
            {isSidebarOpen && <h1 className="text-xl font-bold">DressCutur Admin</h1>}
            <button
              onClick={toggleSidebar}
              className="p-2 rounded-md bg-gray-800 text-white hover:bg-gray-700"
            >
              {isSidebarOpen ? '◀' : '▶'}
            </button>
          </div>
        </div>
        <nav className="mt-6">
          <ul>
            {sidebarLinks.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className={`flex items-center py-3 px-4 ${
                    pathname === link.href
                      ? 'bg-blue-600 text-white'
                      : 'text-gray-300 hover:bg-gray-800'
                  } ${isSidebarOpen ? 'justify-start' : 'justify-center'}`}
                >
                  {renderIcon(link.icon)}
                  {isSidebarOpen && <span className="ml-3">{link.name}</span>}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-auto">
        {/* Header */}
        <header className="bg-white shadow-md py-4 px-6 flex justify-between items-center">
          <div>
            <h2 className="text-xl font-semibold text-gray-800">
              {sidebarLinks.find((link) => link.href === pathname)?.name || 'Администрирование'}
            </h2>
          </div>
          <div className="flex items-center space-x-4">
            <span className="text-gray-600">Администратор</span>
            <button className="px-3 py-2 bg-red-500 text-white rounded-md hover:bg-red-600">
              Выход
            </button>
          </div>
        </header>

        {/* Page Content */}
        <main className="p-6">{children}</main>
      </div>
    </div>
  );
} 