# Company Registration Frontend

Frontend application for company registration module built with React, Vite, Redux Toolkit, and Material-UI.

## Features

- Multi-step registration form with validation
- Firebase authentication integration
- Company profile management
- Responsive design
- Real-time notifications

## Setup

1. Install dependencies:
```bash
npm install
```

2. Create `.env` file:
```env
VITE_API_BASE_URL=http://localhost:5001
VITE_FIREBASE_API_KEY=your_firebase_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=backend-52270
```

3. Start development server:
```bash
npm run dev
```

## Project Structure

```
front-end/
├── public/
│   └── assets/
├── src/
│   ├── assets/
│   ├── components/
│   ├── pages/
│   ├── store/
│   ├── api/
│   ├── styles/
│   ├── App.jsx
│   └── main.jsx
├── vite.config.js
└── package.json
```
