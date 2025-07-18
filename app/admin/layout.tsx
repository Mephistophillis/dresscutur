'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { logout, getCurrentUser } from '~/app/actions/admin/auth';
import AuthGuard from './components/layout/AuthGuard';
import { 
  Home, 
  Scissors, 
  Shirt, 
  ImageIcon, 
  MessageSquare, 
  DollarSign, 
  HelpCircle, 
  Mail, 
  Calendar, 
  Settings, 
  Menu, 
  X,
  LogOut,
  User
} from 'lucide-react';

const sidebarLinks = [
  { name: 'Дашборд', href: '/admin', icon: Home },
  { name: 'Услуги', href: '/admin/services', icon: Scissors },
  { name: 'Ткани', href: '/admin/fabrics', icon: Shirt },
  { name: 'Галерея', href: '/admin/gallery', icon: ImageIcon },
  { name: 'Отзывы', href: '/admin/testimonials', icon: MessageSquare },
  { name: 'Цены', href: '/admin/prices', icon: DollarSign },
  { name: 'FAQ', href: '/admin/faqs', icon: HelpCircle },
  { name: 'Заявки', href: '/admin/contacts', icon: Mail },
  { name: 'Календарь', href: '/admin/calendar', icon: Calendar },
  { name: 'Настройки', href: '/admin/settings', icon: Settings },
];

interface LayoutProps {
  children: React.ReactNode;
}

export default function AdminLayout({ children }: LayoutProps) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const pathname = usePathname();
  const [user, setUser] = useState<{ name?: string | null; email: string } | null>(null);
  
  // Не применяем AuthGuard к странице авторизации
  const isAuthPage = pathname === '/admin/auth';

  useEffect(() => {
    const fetchUser = async () => {
      const userData = await getCurrentUser();
      setUser(userData);
    };
    
    fetchUser();
  }, [pathname]);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setIsSidebarOpen(true);
        setIsMobileMenuOpen(false);
      } else {
        setIsSidebarOpen(false);
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const handleLogout = async () => {
    await logout();
  };

  const getCurrentPageName = () => {
    const currentLink = sidebarLinks.find((link) => link.href === pathname);
    return currentLink?.name || 'Администрирование';
  };

  // Если это страница авторизации, не применяем AuthGuard
  if (isAuthPage) {
    return <>{children}</>;
  }

  return (
    <AuthGuard>
      <div className="flex h-screen bg-slate-50">
        {/* Mobile Menu Overlay */}
        {isMobileMenuOpen && (
          <div 
            className="fixed inset-0 z-40 bg-black bg-opacity-50 lg:hidden"
            onClick={() => setIsMobileMenuOpen(false)}
          />
        )}

        {/* Sidebar */}
        <div
          className={`
            ${isSidebarOpen ? 'w-64' : 'w-16'} 
            ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
            fixed lg:static inset-y-0 left-0 z-50 flex flex-col
            bg-white border-r border-slate-200 shadow-sm
            transition-all duration-300 ease-in-out
          `}
        >
          {/* Sidebar Header */}
          <div className={`border-b border-slate-200 ${isSidebarOpen ? 'flex items-center justify-between p-4' : 'flex flex-col items-center py-3 px-2 space-y-3'}`}>
            {isSidebarOpen ? (
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-gradient-to-br from-violet-500 to-purple-600 rounded-lg flex items-center justify-center">
                  <Scissors className="w-5 h-5 text-white" />
                </div>
                <h1 className="text-lg font-semibold text-slate-800">DressCutur</h1>
              </div>
            ) : (
              <div className="w-8 h-8 bg-gradient-to-br from-violet-500 to-purple-600 rounded-lg flex items-center justify-center">
                <Scissors className="w-5 h-5 text-white" />
              </div>
            )}
            <button
              onClick={toggleSidebar}
              className={`${isSidebarOpen ? 'p-2' : 'p-1.5'} rounded-lg hover:bg-slate-100 text-slate-600 transition-colors`}
            >
              {isSidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4 space-y-1">
            {sidebarLinks.map((link) => {
              const isActive = pathname === link.href;
              const Icon = link.icon;
              
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                                  className={`
                  flex items-center rounded-lg text-sm font-medium transition-all duration-200
                  ${isActive 
                    ? 'bg-violet-50 text-violet-700 mx-2 px-3 py-2.5' 
                    : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900 px-3 py-2.5'
                  }
                  ${!isSidebarOpen ? 'justify-center' : 'justify-start'}
                `}
                >
                  <Icon className={`${isSidebarOpen ? 'w-6 h-6' : 'w-9 h-9 flex-shrink-0'} ${isActive ? 'text-violet-600' : ''} ${isSidebarOpen ? 'mr-3' : ''}`} />
                  {isSidebarOpen && <span>{link.name}</span>}
                </Link>
              );
            })}
          </nav>

          {/* User Profile Section */}
          {user && isSidebarOpen && (
            <div className="p-4 border-t border-slate-200">
              <div className="flex items-center space-x-3 mb-3">
                <div className="w-8 h-8 bg-slate-200 rounded-full flex items-center justify-center">
                  <User className="w-5 h-5 text-slate-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-slate-900 truncate">
                    {user?.name || user?.email || 'Администратор'}
                  </p>
                  <p className="text-xs text-slate-500 truncate">{user?.email}</p>
                </div>
              </div>
              <button 
                onClick={handleLogout}
                className="flex items-center w-full px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors"
              >
                <LogOut className="w-5 h-5 mr-2" />
                Выход
              </button>
            </div>
          )}
        </div>

        {/* Main Content */}
        <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
          {/* Header */}
          <header className="bg-white border-b border-slate-200 px-4 py-3 lg:px-6 lg:py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <button
                  onClick={toggleMobileMenu}
                  className="p-2 rounded-lg hover:bg-slate-100 text-slate-600 lg:hidden"
                >
                  <Menu className="w-6 h-6" />
                </button>
                <div>
                  <h2 className="text-xl font-semibold text-slate-800">
                    {getCurrentPageName()}
                  </h2>
                  <p className="text-sm text-slate-500 mt-0.5">
                    Управление содержимым сайта
                  </p>
                </div>
              </div>
              
              {/* Header Actions */}
              <div className="flex items-center space-x-3">
                {user && (
                  <>
                    <div className="hidden sm:block text-right">
                      <p className="text-sm font-medium text-slate-700">
                        {user?.name || 'Администратор'}
                      </p>
                      <p className="text-xs text-slate-500">{user?.email}</p>
                    </div>
                    <button 
                      onClick={handleLogout}
                      className="flex items-center px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    >
                      <LogOut className="w-5 h-5 sm:mr-2" />
                      <span className="hidden sm:inline">Выход</span>
                    </button>
                  </>
                )}
              </div>
            </div>
          </header>

          {/* Page Content */}
          <main className="flex-1 p-4 lg:p-6 overflow-auto">
            <div className="max-w-7xl mx-auto">
              {children}
            </div>
          </main>
        </div>
      </div>
    </AuthGuard>
  );
} 