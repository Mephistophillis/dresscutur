// Константы контактных данных ателье DressCutur
export const CONTACTS = {
  // Основные контакты
  address: "г. Москва, ул. Тверская, д. 15, стр. 1",
  phone: "+7 (495) 123-45-67",
  email: "info@dresscutur.ru",
  
  // Рабочие часы
  workingHours: {
    weekdays: "Пн-Пт: 10:00 - 20:00",
    saturday: "Сб: 10:00 - 18:00",
    sunday: "Вс: выходной",
    full: "Пн-Пт: 10:00 - 20:00, Сб: 10:00 - 18:00"
  },
  
  // Социальные сети
  social: {
    instagram: "https://instagram.com/dresscutur",
    facebook: "https://facebook.com/dresscutur",
    youtube: "https://youtube.com/@dresscutur",
    telegram: "https://t.me/dresscutur",
    whatsapp: "https://wa.me/74951234567"
  },
  
  // Ссылки для href
  links: {
    phone: "tel:+74951234567",
    email: "mailto:info@dresscutur.ru",
    address: "https://yandex.ru/maps/-/CCUAMHcrhA" // Ссылка на карту
  }
} as const;

// Типы для TypeScript
export type ContactsType = typeof CONTACTS; 