# AI Intensive Booking Website - Telegram Mini App

A modern, mobile-optimized website for booking a 4-hour AI intensive, specifically designed for use as a Telegram Mini App.

## Features

1. **Telegram Web App Integration**: Full support for Telegram Mini App features including Main Button, header customization, and theme changes
2. **Mobile-First Design**: Optimized for mobile devices with touch-friendly UI elements
3. **Course Details**: Added a "What You'll Learn" section with course content
4. **Improved Form Validation**: Real-time validation with visual feedback
5. **Success Overlay**: Elegant modal confirmation instead of alert
6. **Accessibility**: Added ARIA attributes and proper labeling
7. **Date Restrictions**: Limited booking to 30 days in the future
8. **Loading State**: Visual feedback during form submission
9. **Formatted Display**: Dates and times formatted in a user-friendly way
10. **Enhanced Animations**: Smooth transitions and loading spinner
11. **Responsive Design**: Optimized for all screen sizes
12. **Google Sheets Integration**: Registration data is stored in Google Sheets for easy access and management

## Telegram-Specific Features

- Header and background color customization to match Telegram's UI
- Main Button integration for form submission
- Automatic expansion to full screen
- Theme change event handling
- Proper closing functionality after booking

## Data Management

The application integrates with Google Sheets as a database for storing registration information. All registered users are automatically added to the Google Sheets document with the following details:
- Spreadsheet ID: `1R-8ekalS1cWW4PV2wQmwwLgDL9e-slFldLp3VRvkdyw`
- Registration data includes name, email, date, and Telegram ID
- The system provides API endpoints to manage the data

For more details about the Sheets API, see [SHEETS_API.md](./SHEETS_API.md).

## Technologies Used

- HTML5
- CSS3
- JavaScript (ES6+)
- Telegram Web Apps SDK
- Three.js (for 3D graphics)
- Express.js (backend)
- Google Sheets API

## How to Use

The app is designed to work as a Telegram Mini App when connected to a Telegram bot. It can also be used as a regular web application on mobile and desktop devices.

To set up the Google Sheets integration:
1. Create a Google Cloud project and enable the Google Sheets API
2. Create an API key
3. Update the `/config` file with your API key
4. Ensure the Google Sheet has the appropriate sharing settings to allow API access