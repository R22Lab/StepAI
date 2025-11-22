const config = require('./config');
const { google } = require('googleapis');

class GoogleSheetsService {
  constructor() {
    this.spreadsheetId = config.googleSheets.spreadsheetId;
    this.apiKey = config.googleSheets.apiKey;
  }

  // Получить данные из листа
  async getSheetData(sheetName) {
    try {
      const sheets = google.sheets('v4');
      const response = await sheets.spreadsheets.values.get({
        spreadsheetId: this.spreadsheetId,
        range: sheetName,
        key: this.apiKey
      });
      return response.data.values || [];
    } catch (error) {
      console.error('Error getting sheet data:', error);
      throw error;
    }
  }

  // Записать данные в лист
  async appendData(sheetName, values) {
    try {
      const sheets = google.sheets('v4');
      const response = await sheets.spreadsheets.values.append({
        spreadsheetId: this.spreadsheetId,
        range: sheetName,
        valueInputOption: 'USER_ENTERED',
        resource: {
          values: [values]
        },
        key: this.apiKey
      });
      return response.data;
    } catch (error) {
      console.error('Error appending data:', error);
      throw error;
    }
  }

  // Обновить данные в листе
  async updateData(sheetName, range, values) {
    try {
      const sheets = google.sheets('v4');
      const response = await sheets.spreadsheets.values.update({
        spreadsheetId: this.spreadsheetId,
        range: `${sheetName}!${range}`,
        valueInputOption: 'USER_ENTERED',
        resource: {
          values: [values]
        },
        key: this.apiKey
      });
      return response.data;
    } catch (error) {
      console.error('Error updating data:', error);
      throw error;
    }
  }
}

module.exports = GoogleSheetsService;