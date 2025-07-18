const { exec } = require('child_process');
const path = require('path');
const fs = require('fs');

// Путь к директории миграций
const migrationsDir = path.join(__dirname, '..', 'prisma', 'migrations');

// Функция для создания директории миграции
function createMigrationDirectory() {
  try {
    // Создаем название миграции с текущей датой
    const date = new Date().toISOString().replace(/[-:]/g, '').split('.')[0];
    const migrationName = `${date}_create_teammember_table`;
    const migrationPath = path.join(migrationsDir, migrationName);
    
    // Создаем директорию для миграции, если она не существует
    if (!fs.existsSync(migrationPath)) {
      fs.mkdirSync(migrationPath, { recursive: true });
      console.log(`Создана директория для миграции: ${migrationPath}`);
    }
    
    // Копируем SQL скрипт в директорию миграции
    const sqlSource = path.join(__dirname, '..', 'prisma', 'migrations', 'create_teammember_table.sql');
    const sqlDest = path.join(migrationPath, 'migration.sql');
    
    if (fs.existsSync(sqlSource)) {
      fs.copyFileSync(sqlSource, sqlDest);
      console.log(`SQL скрипт скопирован в ${sqlDest}`);
    } else {
      console.error(`Исходный SQL скрипт не найден: ${sqlSource}`);
      return false;
    }
    
    return true;
  } catch (error) {
    console.error('Ошибка при создании директории миграции:', error);
    return false;
  }
}

// Функция для выполнения миграции с Prisma
function runPrismaMigration() {
  return new Promise((resolve, reject) => {
    console.log('Выполняется миграция с Prisma...');
    
    exec('npx prisma migrate dev', (error, stdout, stderr) => {
      if (error) {
        console.error('Ошибка при выполнении миграции:', error);
        console.error(stderr);
        reject(error);
        return;
      }
      
      console.log(stdout);
      console.log('Миграция успешно выполнена!');
      resolve();
    });
  });
}

// Функция для запуска скрипта заполнения
function runSeedScript() {
  return new Promise((resolve, reject) => {
    console.log('Запуск скрипта заполнения таблицы Team Member...');
    
    exec('node scripts/seed-team-members.js', (error, stdout, stderr) => {
      if (error) {
        console.error('Ошибка при запуске скрипта заполнения:', error);
        console.error(stderr);
        reject(error);
        return;
      }
      
      console.log(stdout);
      console.log('Скрипт заполнения успешно выполнен!');
      resolve();
    });
  });
}

// Основная функция
async function main() {
  try {
    // Создаем директорию для миграции
    const migrationCreated = createMigrationDirectory();
    
    if (!migrationCreated) {
      console.error('Не удалось создать миграцию. Процесс остановлен.');
      return;
    }
    
    // Выполняем миграцию
    await runPrismaMigration();
    
    // Запускаем скрипт заполнения
    await runSeedScript();
    
    console.log('Процесс миграции и заполнения данных успешно завершен!');
  } catch (error) {
    console.error('Произошла ошибка в процессе выполнения:', error);
  }
}

// Запускаем основную функцию
main(); 