'use client';

import React, { useState } from 'react';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '../components/ui/card';
import { Tabs, TabList, Tab, TabPanel } from '../components/ui/tabs';
import { Input } from '../components/ui/form-controls/input';
import { Textarea } from '../components/ui/form-controls/textarea';
import { Select } from '../components/ui/form-controls/select';
import { Toggle } from '../components/ui/toggle';
import { Alert } from '../components/ui/alert';

// Типы для данных настроек
interface PageSettings {
  title: string;
  description: string;
  enabled: boolean;
}

interface SeoSettings {
  metaTitle: string;
  metaDescription: string;
  keywords: string;
  ogImage: string;
  enableIndexing: boolean;
  pages: {
    [key: string]: PageSettings;
  };
}

interface Settings {
  general: {
    siteName: string;
    siteTagline: string;
    contactEmail: string;
    contactPhone: string;
    address: string;
    workingHours: string;
  };
  seo: SeoSettings;
  notifications: {
    emailNotifications: boolean;
    newOrderNotification: boolean;
    newContactRequestNotification: boolean;
    notificationEmail: string;
  };
  advanced: {
    maintenanceMode: boolean;
    enableCache: boolean;
    cacheTimeout: string;
    debugMode: boolean;
    googleAnalyticsId: string;
  };
}

// Временные данные для демонстрации
const mockSettings: Settings = {
  general: {
    siteName: 'DressCutur Ателье',
    siteTagline: 'Индивидуальный пошив одежды и ремонт',
    contactEmail: 'info@dresscutur.ru',
    contactPhone: '+7 (495) 123-45-67',
    address: 'г. Москва, ул. Тверская, д. 15, стр. 1',
    workingHours: 'Пн-Пт: 10:00-20:00, Сб: 10:00-18:00',
  },
  seo: {
    metaTitle: 'DressCutur - Ателье индивидуального пошива одежды',
    metaDescription: 'Профессиональное ателье по пошиву и ремонту одежды. Индивидуальный подход, качественные ткани, опытные мастера.',
    keywords: 'ателье, пошив одежды, ремонт одежды, индивидуальный пошив, платья на заказ',
    ogImage: '/images/og-image.jpg',
    enableIndexing: true,
    // Настройки для публичных страниц
    pages: {
      home: {
        title: 'Главная - DressCutur',
        description: 'Ателье индивидуального пошива одежды. Создаем уникальные вещи с учетом ваших пожеланий и особенностей фигуры.',
        enabled: true
      },
      services: {
        title: 'Услуги - DressCutur',
        description: 'Наши услуги: индивидуальный пошив, ремонт одежды, подгонка по фигуре, пошив штор и текстиля для дома.',
        enabled: true
      },
      fabrics: {
        title: 'Ткани - DressCutur',
        description: 'Широкий выбор премиальных тканей для пошива одежды. Натуральные, смесовые и синтетические материалы.',
        enabled: true
      },
      gallery: {
        title: 'Наши работы - DressCutur',
        description: 'Галерея наших работ: свадебные платья, деловые костюмы, вечерние наряды и повседневная одежда.',
        enabled: true
      },
      about: {
        title: 'О нас - DressCutur',
        description: 'История ателье, наша миссия и ценности. Познакомьтесь с нашей командой профессиональных мастеров.',
        enabled: true
      },
      contact: {
        title: 'Контакты - DressCutur',
        description: 'Свяжитесь с нами: адрес, телефон, email. Закажите обратный звонок или запишитесь на консультацию.',
        enabled: true
      }
    }
  },
  notifications: {
    emailNotifications: true,
    newOrderNotification: true,
    newContactRequestNotification: true,
    notificationEmail: 'admin@dresscutur.ru',
  },
  advanced: {
    maintenanceMode: false,
    enableCache: true,
    cacheTimeout: '3600',
    debugMode: false,
    googleAnalyticsId: 'UA-XXXXXXXXX-X',
  }
};

// Основной компонент страницы
export default function SettingsPage() {
  const [settings, setSettings] = useState(mockSettings);
  const [isSuccessAlertVisible, setIsSuccessAlertVisible] = useState(false);

  // Функция для обновления настроек
  const handleSettingsChange = (
    section: keyof typeof settings,
    field: string,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    value: string | boolean | number | Record<string, any>
  ) => {
    setSettings({
      ...settings,
      [section]: {
        ...settings[section],
        [field]: value,
      },
    });
  };

  // Функция для обновления настроек страниц
  const handlePageSettingsChange = (
    pageKey: string,
    field: string,
    value: string | boolean
  ) => {
    setSettings({
      ...settings,
      seo: {
        ...settings.seo,
        pages: {
          ...settings.seo.pages,
          [pageKey]: {
            ...settings.seo.pages[pageKey],
            [field]: value
          }
        }
      }
    });
  };

  // Функция для сохранения настроек
  const handleSaveSettings = () => {
    // В реальном приложении здесь был бы API-запрос
    console.log('Сохраняем настройки:', settings);
    
    // Показываем уведомление об успешном сохранении
    setIsSuccessAlertVisible(true);
    
    // Скрываем уведомление через 3 секунды
    setTimeout(() => {
      setIsSuccessAlertVisible(false);
    }, 3000);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Настройки</h1>
        <p className="text-gray-500 mt-1">Управление настройками сайта и панели администратора</p>
      </div>

      {isSuccessAlertVisible && (
        <Alert 
          variant="success"
          onClose={() => setIsSuccessAlertVisible(false)}
        >
          Настройки успешно сохранены!
        </Alert>
      )}

      <Tabs defaultTab="general" className="space-y-4">
        <TabList>
          <Tab value="general">Общие</Tab>
          <Tab value="seo">SEO</Tab>
          <Tab value="notifications">Уведомления</Tab>
          <Tab value="advanced">Расширенные</Tab>
        </TabList>

        {/* Общие настройки */}
        <TabPanel value="general">
          <Card>
            <CardHeader>
              <CardTitle>Общие настройки</CardTitle>
              <CardDescription>Основная информация о сайте</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Input
                label="Название сайта"
                value={settings.general.siteName}
                onChange={(e) => handleSettingsChange('general', 'siteName', e.target.value)}
                required
              />
              
              <Input
                label="Слоган сайта"
                value={settings.general.siteTagline}
                onChange={(e) => handleSettingsChange('general', 'siteTagline', e.target.value)}
              />
              
              <Input
                label="Email для связи"
                type="email"
                value={settings.general.contactEmail}
                onChange={(e) => handleSettingsChange('general', 'contactEmail', e.target.value)}
              />
              
              <Input
                label="Телефон для связи"
                value={settings.general.contactPhone}
                onChange={(e) => handleSettingsChange('general', 'contactPhone', e.target.value)}
              />
              
              <Input
                label="Адрес"
                value={settings.general.address}
                onChange={(e) => handleSettingsChange('general', 'address', e.target.value)}
              />
              
              <Input
                label="Часы работы"
                value={settings.general.workingHours}
                onChange={(e) => handleSettingsChange('general', 'workingHours', e.target.value)}
              />
            </CardContent>
            <CardFooter className="justify-end">
              <Button variant="default" onClick={handleSaveSettings}>
                Сохранить
              </Button>
            </CardFooter>
          </Card>
        </TabPanel>

        {/* SEO настройки */}
        <TabPanel value="seo">
          <div className="space-y-6">
            {/* Основные SEO настройки */}
            <Card>
              <CardHeader>
                <CardTitle>Общие SEO настройки</CardTitle>
                <CardDescription>Основные настройки для поисковой оптимизации</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Input
                  label="Meta Title (по умолчанию)"
                  value={settings.seo.metaTitle}
                  onChange={(e) => handleSettingsChange('seo', 'metaTitle', e.target.value)}
                  helperText="Заголовок страницы, который отображается в поисковой выдаче"
                />
                
                <Textarea
                  label="Meta Description (по умолчанию)"
                  value={settings.seo.metaDescription}
                  onChange={(e) => handleSettingsChange('seo', 'metaDescription', e.target.value)}
                  helperText="Описание страницы для поисковых систем"
                  rows={3}
                  maxLength={160}
                  showCharCount
                />
                
                <Input
                  label="Ключевые слова"
                  value={settings.seo.keywords}
                  onChange={(e) => handleSettingsChange('seo', 'keywords', e.target.value)}
                  helperText="Ключевые слова, разделенные запятыми"
                />
                
                <Input
                  label="Изображение для соцсетей (OG Image)"
                  value={settings.seo.ogImage}
                  onChange={(e) => handleSettingsChange('seo', 'ogImage', e.target.value)}
                  helperText="URL изображения, которое будет отображаться при публикации в соцсетях"
                />
                
                <div className="mt-4">
                  <Toggle
                    checked={settings.seo.enableIndexing}
                    onChange={(checked) => handleSettingsChange('seo', 'enableIndexing', checked)}
                    label="Разрешить индексацию сайта поисковыми системами"
                  />
                </div>
              </CardContent>
              <CardFooter className="justify-end">
                <Button variant="default" onClick={handleSaveSettings}>
                  Сохранить
                </Button>
              </CardFooter>
            </Card>

            {/* Настройки публичных страниц */}
            <Card>
              <CardHeader>
                <CardTitle>Настройки страниц</CardTitle>
                <CardDescription>Управление метаданными для публичных страниц сайта</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {Object.entries(settings.seo.pages).map(([pageKey, pageData]) => (
                  <div key={pageKey} className="border-b pb-4 mb-4 last:border-0 last:pb-0 last:mb-0">
                    <h3 className="text-lg font-medium mb-3 capitalize">
                      {pageKey === 'home' ? 'Главная страница' : pageData.title.split(' - ')[0]}
                    </h3>
                    <div className="space-y-4">
                      <Input
                        label="Title"
                        value={pageData.title}
                        onChange={(e) => handlePageSettingsChange(pageKey, 'title', e.target.value)}
                        helperText="Заголовок страницы для браузера и поисковиков"
                      />
                      
                      <Textarea
                        label="Description"
                        value={pageData.description}
                        onChange={(e) => handlePageSettingsChange(pageKey, 'description', e.target.value)}
                        helperText="Описание страницы для поисковых систем"
                        rows={2}
                        maxLength={160}
                        showCharCount
                      />
                      
                      <Toggle
                        checked={pageData.enabled}
                        onChange={(checked) => handlePageSettingsChange(pageKey, 'enabled', checked)}
                        label="Включить страницу"
                      />
                    </div>
                  </div>
                ))}
              </CardContent>
              <CardFooter className="justify-end">
                <Button variant="default" onClick={handleSaveSettings}>
                  Сохранить
                </Button>
              </CardFooter>
            </Card>
          </div>
        </TabPanel>

        {/* Настройки уведомлений */}
        <TabPanel value="notifications">
          <Card>
            <CardHeader>
              <CardTitle>Настройки уведомлений</CardTitle>
              <CardDescription>Управление уведомлениями о событиях</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Input
                label="Email для уведомлений"
                type="email"
                value={settings.notifications.notificationEmail}
                onChange={(e) => handleSettingsChange('notifications', 'notificationEmail', e.target.value)}
              />
              
              <div className="space-y-3 mt-4">
                <Toggle
                  checked={settings.notifications.emailNotifications}
                  onChange={(checked) => handleSettingsChange('notifications', 'emailNotifications', checked)}
                  label="Включить email-уведомления"
                />
                
                <Toggle
                  checked={settings.notifications.newOrderNotification}
                  onChange={(checked) => handleSettingsChange('notifications', 'newOrderNotification', checked)}
                  label="Уведомлять о новых заказах"
                />
                
                <Toggle
                  checked={settings.notifications.newContactRequestNotification}
                  onChange={(checked) => handleSettingsChange('notifications', 'newContactRequestNotification', checked)}
                  label="Уведомлять о новых заявках"
                />
              </div>
            </CardContent>
            <CardFooter className="justify-end">
              <Button variant="default" onClick={handleSaveSettings}>
                Сохранить
              </Button>
            </CardFooter>
          </Card>
        </TabPanel>

        {/* Расширенные настройки */}
        <TabPanel value="advanced">
          <Card>
            <CardHeader>
              <CardTitle>Расширенные настройки</CardTitle>
              <CardDescription>Дополнительные настройки для опытных пользователей</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Alert variant="warning">
                Будьте осторожны при изменении расширенных настроек. Неправильная конфигурация может повлиять на работу сайта.
              </Alert>
              
              <div className="space-y-3 mt-4">
                <Toggle
                  checked={settings.advanced.maintenanceMode}
                  onChange={(checked) => handleSettingsChange('advanced', 'maintenanceMode', checked)}
                  label="Режим обслуживания"
                />
                
                <Toggle
                  checked={settings.advanced.enableCache}
                  onChange={(checked) => handleSettingsChange('advanced', 'enableCache', checked)}
                  label="Включить кэширование"
                />
                
                <Toggle
                  checked={settings.advanced.debugMode}
                  onChange={(checked) => handleSettingsChange('advanced', 'debugMode', checked)}
                  label="Режим отладки"
                />
              </div>
              
              <Input
                label="ID Google Analytics"
                value={settings.advanced.googleAnalyticsId}
                onChange={(e) => handleSettingsChange('advanced', 'googleAnalyticsId', e.target.value)}
                helperText="Оставьте пустым, чтобы отключить аналитику"
              />
              
              <Select
                label="Время кэширования (в секундах)"
                value={settings.advanced.cacheTimeout}
                onChange={(e) => handleSettingsChange('advanced', 'cacheTimeout', e.target.value)}
                options={[
                  { value: '300', label: '5 минут' },
                  { value: '900', label: '15 минут' },
                  { value: '1800', label: '30 минут' },
                  { value: '3600', label: '1 час' },
                  { value: '86400', label: '24 часа' },
                ]}
                disabled={!settings.advanced.enableCache}
              />
            </CardContent>
            <CardFooter className="justify-end">
              <Button variant="default" onClick={handleSaveSettings}>
                Сохранить
              </Button>
            </CardFooter>
          </Card>
        </TabPanel>
      </Tabs>
    </div>
  );
} 