// Примеры использования API Google Sheets для проекта

// Импортируем класс SheetsClient
const SheetsClient = require('../sheets-client.js');

// Создаем экземпляр клиента
const sheetsClient = new SheetsClient('http://localhost:3000');

// Пример 1: Получение всех регистраций
async function getAllRegistrations() {
  try {
    const result = await sheetsClient.getSheetData('registrations');
    console.log('Все регистрации:', result.data);
    return result.data;
  } catch (error) {
    console.error('Ошибка при получении регистраций:', error);
  }
}

// Пример 2: Добавление новой регистрации
async function addRegistration(name, email, date, time, telegramId = null) {
  try {
    const registrationData = [
      name,
      email,
      date,
      time,
      telegramId || 'N/A',
      new Date().toISOString()
    ];
    
    const result = await sheetsClient.addDataToSheet('registrations', registrationData);
    console.log('Регистрация добавлена:', result);
    return result;
  } catch (error) {
    console.error('Ошибка при добавлении регистрации:', error);
  }
}

// Пример 3: Обновление данных в таблице
async function updateRegistration(row, name, email) {
  try {
    const range = `A${row}:B${row}`; // Обновляем имя и email в указанной строке
    const values = [name, email];
    
    const result = await sheetsClient.updateSheetData('registrations', range, values);
    console.log('Данные обновлены:', result);
    return result;
  } catch (error) {
    console.error('Ошибка при обновлении данных:', error);
  }
}

// Пример использования:
/*
// Добавить новую регистрацию
addRegistration('Петр Петров', 'petr@example.com', '2025-12-01', '14:00', '987654321')
  .then(() => {
    console.log('Регистрация успешно добавлена в Google Sheets');
  });

// Получить все регистрации
getAllRegistrations()
  .then(data => {
    console.log(`Получено ${data.length} регистраций`);
  });
*/

module.exports = {
  getAllRegistrations,
  addRegistration,
  updateRegistration
};