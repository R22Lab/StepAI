const express = require('express');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware для парсинга JSON
app.use(express.json());
app.use(express.static(path.join(__dirname)));

// Импортируем сервис Google Sheets
const GoogleSheetsService = require('./sheets-service');
const sheetsService = new GoogleSheetsService();

// Route to serve the main page
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// Маршрут для получения данных из Google Sheets
app.get('/api/sheets/:sheetName', async (req, res) => {
    try {
        const { sheetName } = req.params;
        const data = await sheetsService.getSheetData(sheetName);
        res.json({ success: true, data });
    } catch (error) {
        console.error('Error fetching sheet data:', error);
        res.status(500).json({ success: false, error: error.message });
    }
});

// Маршрут для добавления данных в Google Sheets
app.post('/api/sheets/:sheetName', async (req, res) => {
    try {
        const { sheetName } = req.params;
        const { values } = req.body;
        const result = await sheetsService.appendData(sheetName, values);
        res.json({ success: true, result });
    } catch (error) {
        console.error('Error appending data to sheet:', error);
        res.status(500).json({ success: false, error: error.message });
    }
});

// Маршрут для обновления данных в Google Sheets
app.put('/api/sheets/:sheetName', async (req, res) => {
    try {
        const { sheetName } = req.params;
        const { range, values } = req.body;
        const result = await sheetsService.updateData(sheetName, range, values);
        res.json({ success: true, result });
    } catch (error) {
        console.error('Error updating sheet data:', error);
        res.status(500).json({ success: false, error: error.message });
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});