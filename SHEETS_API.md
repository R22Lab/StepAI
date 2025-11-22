# API Google Sheets для проекта

## Описание
Этот проект интегрирован с Google Sheets таблицей, которая используется как база данных для хранения информации о зарегистрированных пользователях.

## Конфигурация
- Spreadsheet ID: `1R-8ekalS1cWW4PV2wQmwwLgDL9e-slFldLp3VRvkdyw`
- Основной лист: `registrations` (ID: 0)
- Лист пользователей: `users` (ID: 1091838685)

## API endpoints

### GET /api/sheets/:sheetName
Получить все данные из указанного листа

**Пример:**
```bash
curl http://localhost:3000/api/sheets/A1:B10
```

### POST /api/sheets/:sheetName
Добавить новую строку в указанный лист

**Пример:**
```bash
curl -X POST http://localhost:3000/api/sheets/registrations \
  -H "Content-Type: application/json" \
  -d '{"values": ["Имя", "Email", "Дата регистрации"]}'
```

### PUT /api/sheets/:sheetName
Обновить данные в указанном диапазоне листа

**Пример:**
```bash
curl -X PUT http://localhost:3000/api/sheets/registrations \
  -H "Content-Type: application/json" \
  -d '{"range": "A1:C1", "values": ["НовоеИмя", "новый@email.com", "2025-11-22"]}'
```

## Настройка Google API ключа

Для работы с Google Sheets API необходимо:

1. Создать проект в Google Cloud Console
2. Включить Google Sheets API для проекта
3. Создать API ключ
4. Заменить `YOUR_GOOGLE_API_KEY` в файле `/config` на ваш действительный API ключ

## Безопасность

**ВАЖНО:** Не публикуйте ваш API ключ в открытом репозитории. В продакшене рекомендуется использовать OAuth 2.0 вместо API ключа для лучшей безопасности.