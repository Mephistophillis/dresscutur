const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Массив с тестовыми данными членов команды
const teamMembersData = [
  {
    name: 'Анна Петрова',
    position: 'Ведущий дизайнер',
    bio: 'Профессиональный дизайнер одежды с опытом более 10 лет. Специализируется на создании эксклюзивных свадебных нарядов и вечерних платьев.',
    photo: '/uploads/team/anna.jpg',
    socialLinks: {
      instagram: 'anna_designer',
      facebook: 'anna.petrova',
      vk: 'annapetrova'
    },
    location: 'Москва, ул. Тверская, 15',
    isActive: true,
    order: 1,
  },
  {
    name: 'Иван Сергеев',
    position: 'Портной высшего разряда',
    bio: 'Мастер по пошиву мужских костюмов. Работал в ведущих ателье Италии и Франции. Создает индивидуальные костюмы, учитывая все особенности фигуры клиента.',
    photo: '/uploads/team/ivan.jpg',
    socialLinks: {
      instagram: 'ivan_tailor',
      linkedin: 'ivan-sergeev'
    },
    location: 'Москва, ул. Тверская, 15',
    isActive: true,
    order: 2,
  },
  {
    name: 'Елена Смирнова',
    position: 'Модельер-конструктор',
    bio: 'Разрабатывает лекала и конструкции для одежды любой сложности. Обладает глубокими знаниями в области конструирования одежды и материаловедения.',
    photo: '/uploads/team/elena.jpg',
    socialLinks: {
      instagram: 'elena_pattern',
      website: 'elenasmirova.ru'
    },
    location: 'Санкт-Петербург, Невский пр., 22',
    isActive: true,
    order: 3,
  }
];

// Асинхронная функция для заполнения базы данных
async function seedTeamMembers() {
  try {
    console.log('Начинаем заполнение таблицы TeamMember...');
    
    // Создаем записи в базе данных
    for (const member of teamMembersData) {
      await prisma.teamMember.create({
        data: member
      });
      console.log(`Добавлен член команды: ${member.name}`);
    }
    
    console.log('Заполнение таблицы TeamMember завершено успешно!');
  } catch (error) {
    console.error('Ошибка при заполнении таблицы TeamMember:', error);
  } finally {
    // Закрываем соединение с базой данных
    await prisma.$disconnect();
  }
}

// Запускаем функцию заполнения
seedTeamMembers(); 