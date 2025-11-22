// Клиентская библиотека для работы с Google Sheets API
class SheetsClient {
  constructor(baseUrl = '') {
    this.baseUrl = baseUrl;
  }

  // Получить данные из листа
  async getSheetData(sheetName) {
    try {
      const response = await fetch(`${this.baseUrl}/api/sheets/${sheetName}`);
      const result = await response.json();
      return result;
    } catch (error) {
      console.error('Error fetching sheet data:', error);
      throw error;
    }
  }

  // Добавить данные в лист
  async addDataToSheet(sheetName, values) {
    try {
      const response = await fetch(`${this.baseUrl}/api/sheets/${sheetName}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ values })
      });
      const result = await response.json();
      return result;
    } catch (error) {
      console.error('Error adding data to sheet:', error);
      throw error;
    }
  }

  // Обновить данные в листе
  async updateSheetData(sheetName, range, values) {
    try {
      const response = await fetch(`${this.baseUrl}/api/sheets/${sheetName}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ range, values })
      });
      const result = await response.json();
      return result;
    } catch (error) {
      console.error('Error updating sheet data:', error);
      throw error;
    }
  }
}

// Пример использования
/*
const sheetsClient = new SheetsClient();

// Пример добавления регистрации
sheetsClient.addDataToSheet('registrations', [
  'Иван Иванов',
  'ivan@example.com',
  new Date().toISOString().split('T')[0],
  'Telegram ID: 123456789'
])
.then(result => console.log('Регистрация добавлена:', result))
.catch(error => console.error('Ошибка при добавлении регистрации:', error));

// Пример получения всех регистраций
sheetsClient.getSheetData('registrations')
.then(result => console.log('Данные регистраций:', result.data))
.catch(error => console.error('Ошибка при получении данных:', error));
*/