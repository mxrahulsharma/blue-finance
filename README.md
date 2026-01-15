# Company Register Module

A full-stack web application for company registration, profile management, and job posting built with Node.js, Express, PostgreSQL, React, and Firebase Authentication.

## 🚀 Features

- **User Authentication**: Firebase-based authentication with email/password
- **Company Registration**: Multi-step company registration process
- **Company Profile Management**: Complete company profile setup with logo, banner, and detailed information
- **Job Posting**: Create, view, update, and delete job postings
- **Dashboard**: Overview with statistics and quick actions
- **Company Directory**: Browse all registered companies
- **Responsive Design**: Modern UI built with Material-UI

## 📋 Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v18 or higher)
- **PostgreSQL** (v14 or higher)
- **npm** or **yarn**
- **Firebase Account** (for authentication)
- **Cloudinary Account** (for image uploads - optional)

## 🛠️ Installation

### 1. Clone the Repository

```bash
git clone https://github.com/mxrahulsharma/blue-finance.git
cd blue-finance
```

### 2. Backend Setup

```bash
cd back-end
npm install
```

#### Create `.env` file:

Copy the example environment file and fill in your credentials:

```bash
cp .env.example .env
```

**Required Environment Variables:**

```env
# Server
PORT=5001
NODE_ENV=development

# Database
DB_HOST=localhost
DB_PORT=5432
DB_NAME=your_database_name
DB_USER=your_database_user
DB_PASSWORD=your_database_password

# Firebase Service Account (get from Firebase Console > Project Settings > Service Accounts)
FIREBASE_PROJECT_ID=your-firebase-project-id
FIREBASE_PRIVATE_KEY_ID=your-private-key-id
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nYOUR_PRIVATE_KEY_HERE\n-----END PRIVATE KEY-----\n"
FIREBASE_CLIENT_EMAIL=firebase-adminsdk-xxxxx@your-project.iam.gserviceaccount.com
FIREBASE_CLIENT_ID=your-client-id
FIREBASE_CLIENT_X509_CERT_URL=https://www.googleapis.com/robot/v1/metadata/x509/...

# Firebase API Key (for client-side)
FIREBASE_API_KEY=your-firebase-api-key

# Cloudinary (for image uploads)
CLOUDINARY_CLOUD_NAME=your-cloudinary-cloud-name
CLOUDINARY_API_KEY=your-cloudinary-api-key
CLOUDINARY_API_SECRET=your-cloudinary-api-secret
```

#### Setup Database:

1. Create a PostgreSQL database:

```sql
CREATE DATABASE your_database_name;
```

2. Run the SQL migration script:

```bash
psql -U your_database_user -d your_database_name -f job_postings_table.sql
```

Or manually execute the SQL in `back-end/job_postings_table.sql` to create the required tables.

#### Run Backend:

```bash
npm run dev
```

The backend server will start on `http://localhost:5001`

### 3. Frontend Setup

```bash
cd front-end
npm install
```

#### Create `.env` file:

```bash
cp .env.example .env
```

**Required Environment Variables:**

```env
VITE_API_BASE_URL=http://localhost:5001/api
VITE_FIREBASE_API_KEY=your-firebase-api-key
VITE_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your-firebase-project-id
VITE_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your-messaging-sender-id
VITE_FIREBASE_APP_ID=your-app-id
```

#### Run Frontend:

```bash
npm run dev
```

The frontend will start on `http://localhost:3000`

## 🔥 Firebase Setup

### 1. Create Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Create a new project
3. Enable **Authentication** > **Email/Password** sign-in method

### 2. Get Firebase Service Account Credentials

1. Go to **Project Settings** > **Service Accounts**
2. Click **Generate New Private Key**
3. Copy the JSON content and add it to your `.env` file as shown above

### 3. Get Firebase Web API Key

1. Go to **Project Settings** > **General**
2. Scroll down to **Your apps** section
3. Copy the **API Key** and add it to both `.env` files

## 📦 Database Schema

The application uses PostgreSQL with the following main tables:

- `users` - User accounts linked to Firebase UID
- `company_profile` - Company information and profiles
- `job_postings` - Job postings created by companies
- `applications` - Job applications (for future use)

See `back-end/job_postings_table.sql` for the complete schema.

## 🌐 API Endpoints

### Authentication
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login user
- `POST /api/auth/firebase-signin` - Firebase sign-in (for testing)

### Company
- `POST /api/company/register` - Register a company
- `GET /api/company/profile` - Get company profile
- `PUT /api/company/profile` - Update company profile
- `POST /api/company/upload/logo` - Upload company logo
- `POST /api/company/upload/banner` - Upload company banner
- `GET /api/company/all` - Get all companies (public)

### Jobs
- `POST /api/jobs` - Create a job posting
- `GET /api/jobs` - Get my jobs
- `GET /api/jobs/stats` - Get job statistics
- `GET /api/jobs/:id` - Get job by ID
- `PUT /api/jobs/:id` - Update job
- `DELETE /api/jobs/:id` - Delete job

All protected endpoints require Firebase authentication token in the Authorization header:
```
Authorization: Bearer <firebase-id-token>
```

## 📁 Project Structure

```
company-register-module/
├── back-end/
│   ├── src/
│   │   ├── config/          # Configuration files (db, firebase, cloudinary)
│   │   ├── controllers/     # Route controllers
│   │   ├── middleware/      # Express middleware
│   │   ├── routes/          # API routes
│   │   ├── services/        # Business logic services
│   │   ├── utils/           # Utility functions
│   │   └── server.js        # Express server entry point
│   ├── job_postings_table.sql
│   └── package.json
├── front-end/
│   ├── src/
│   │   ├── api/             # API service functions
│   │   ├── components/      # React components
│   │   ├── pages/           # Page components
│   │   ├── store/           # Redux store and slices
│   │   ├── styles/          # Theme and styles
│   │   ├── App.jsx          # Main app component
│   │   └── main.jsx         # Entry point
│   └── package.json
└── README.md
```

## 🔐 Security Notes

- **Never commit** `.env` files or `firebase-service-account.json` to version control
- The `.gitignore` file already excludes these sensitive files
- Use environment variables for all sensitive credentials
- Keep your Firebase private keys secure
- Use HTTPS in production

## 🚀 Deployment

### Backend Deployment

1. Set all environment variables on your hosting platform
2. Ensure PostgreSQL database is accessible
3. Run database migrations
4. Start the server with `npm start`

### Frontend Deployment

1. Set all environment variables
2. Build the project: `npm run build`
3. Deploy the `dist` folder to your hosting service (Vercel, Netlify, etc.)

## 🧪 Testing

### Backend

```bash
cd back-end
npm test
```

### Manual Testing

1. Start both backend and frontend servers
2. Register a new company
3. Complete company setup
4. Post a job
5. View dashboard statistics

## 📝 Available Scripts

### Backend

- `npm start` - Start production server
- `npm run dev` - Start development server with nodemon
- `npm test` - Run tests

### Frontend

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build

## 🐛 Troubleshooting

### Common Issues

1. **Database Connection Error**
   - Verify PostgreSQL is running
   - Check database credentials in `.env`
   - Ensure database exists

2. **Firebase Authentication Error**
   - Verify Firebase credentials in `.env`
   - Check Firebase project settings
   - Ensure Email/Password authentication is enabled

3. **Port Already in Use**
   - Change `PORT` in backend `.env`
   - Update `VITE_API_BASE_URL` in frontend `.env`

4. **Image Upload Fails**
   - Verify Cloudinary credentials
   - Check file size limits
   - Ensure Cloudinary account is active

## 📄 License

This project is private and proprietary.

## 👥 Contributing

This is a private project. For issues or questions, please contact the repository owner.

## 📧 Support

For support, please open an issue in the GitHub repository.

---

**Built with ❤️ using Node.js, Express, React, Redux, PostgreSQL, and Firebase**
