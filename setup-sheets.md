# Настройка Google Sheets API для проекта

## Шаг 1: Создание проекта в Google Cloud Console

1. Перейдите на [Google Cloud Console](https://console.cloud.google.com/)
2. Нажмите "Создать проект" и укажите имя проекта
3. Выберите созданный проект

## Шаг 2: Включение Google Sheets API

1. В боковом меню перейдите в раздел "API и сервисы" → "Библиотека"
2. Найдите "Google Sheets API" и нажмите на него
3. Нажмите "Включить"

## Шаг 3: Создание API ключа

1. В боковом меню перейдите в раздел "API и сервисы" → "Учетные данные"
2. Нажмите "Создать учетные данные" → "API-ключ"
3. Скопируйте созданный ключ

## Шаг 4: Настройка доступа к таблице

1. Откройте вашу Google таблицу: [https://docs.google.com/spreadsheets/d/1R-8ekalS1cWW4PV2wQmwwLgDL9e-slFldLp3VRvkdyw](https://docs.google.com/spreadsheets/d/1R-8ekalS1cWW4PV2wQmwwLgDL9e-slFldLp3VRvkdyw)
2. Перейдите в меню "Файл" → "Опубликовать в вебе"
3. В открывшемся окне нажмите "Опубликовать"
4. Убедитесь, что таблица доступна для чтения любому пользователю с ссылкой

## Шаг 5: Обновление конфигурационного файла

1. Откройте файл `/config` в проекте
2. Замените значение `"YOUR_GOOGLE_API_KEY"` на ваш API ключ:

```json
{
  "googleSheets": {
    "spreadsheetId": "1R-8ekalS1cWW4PV2wQmwwLgDL9e-slFldLp3VRvkdyw",
    "apiKey": "ВАШ_API_КЛЮЧ_ЗДЕСЬ", 
    "sheetIds": {
      "registrations": 0,
      "users": 1091838685
    }
  }
}
```

## Шаг 6: Установка зависимостей (если возможно)

Если у вас есть возможность установить npm-пакеты, выполните:

```bash
npm install googleapis google-auth-library
```

В противном случае, код использует встроенные возможности Node.js для выполнения HTTP-запросов к Google Sheets API.

## Шаг 7: Запуск сервера

После настройки запустите сервер:

```bash
npm start
```

Сервер будет доступен по адресу `http://localhost:3000`

## Тестирование интеграции

После настройки вы можете протестировать интеграцию с Google Sheets через следующие API-эндпоинты:

- GET `/api/sheets/{sheetName}` - получить данные из листа
- POST `/api/sheets/{sheetName}` - добавить данные в лист
- PUT `/api/sheets/{sheetName}` - обновить данные в листе

Пример запроса для добавления регистрации:

```bash
curl -X POST http://localhost:3000/api/sheets/registrations \
  -H "Content-Type: application/json" \
  -d '{"values": ["Иван Иванов", "ivan@example.com", "2025-11-22", "10:00", "123456789", "2025-11-22T10:30:00.000Z"]}'
```

## Безопасность

**ВАЖНО:** Не публикуйте ваш API ключ в открытом репозитории. В продакшене рекомендуется использовать OAuth 2.0 вместо API ключа для лучшей безопасности.