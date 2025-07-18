const fs = require('fs');
const path = require('path');

// Пути к директориям
const uploadsDir = path.join(process.cwd(), 'public', 'uploads');
const teamDir = path.join(uploadsDir, 'team');

// Функция для создания директорий
function createDirectories() {
  try {
    // Создаем директорию uploads, если она не существует
    if (!fs.existsSync(uploadsDir)) {
      fs.mkdirSync(uploadsDir, { recursive: true });
      console.log(`Создана директория: ${uploadsDir}`);
    }
    
    // Создаем директорию team, если она не существует
    if (!fs.existsSync(teamDir)) {
      fs.mkdirSync(teamDir, { recursive: true });
      console.log(`Создана директория: ${teamDir}`);
    }
    
    console.log('Все необходимые директории созданы успешно!');
    return true;
  } catch (error) {
    console.error('Ошибка при создании директорий:', error);
    return false;
  }
}

// Создаем пустые файлы для тестовых изображений
function createPlaceholderImages() {
  try {
    // Пути к файлам изображений
    const imageFiles = [
      path.join(teamDir, 'anna.jpg'),
      path.join(teamDir, 'ivan.jpg'),
      path.join(teamDir, 'elena.jpg'),
    ];
    
    // Создаем пустые файлы
    for (const file of imageFiles) {
      // Проверяем, существует ли уже файл
      if (!fs.existsSync(file)) {
        // Создаем пустой файл
        fs.writeFileSync(file, '');
        console.log(`Создан файл-заглушка: ${file}`);
      }
    }
    
    console.log('Все файлы-заглушки созданы успешно!');
    console.log('ВАЖНО: Эти файлы пустые и должны быть заменены настоящими изображениями!');
    return true;
  } catch (error) {
    console.error('Ошибка при создании файлов-заглушек:', error);
    return false;
  }
}

// Основная функция
function main() {
  // Создаем директории
  const directoriesCreated = createDirectories();
  
  if (!directoriesCreated) {
    console.error('Не удалось создать необходимые директории. Процесс остановлен.');
    return;
  }
  
  // Создаем файлы-заглушки
  const placeholdersCreated = createPlaceholderImages();
  
  if (!placeholdersCreated) {
    console.error('Не удалось создать файлы-заглушки. Процесс остановлен.');
    return;
  }
  
  console.log('Процесс создания директорий и файлов-заглушек успешно завершен!');
}

// Запускаем основную функцию
main(); 