# 🚀 Deployment Guide for Genius Market

## Deploying to Vercel

Vercel is the easiest way to deploy the frontend. For the backend, you'll need a Node.js hosting service like Railway, Render, or Heroku.

### Option 1: Frontend Only on Vercel (Recommended for Quick Start)

#### Step 1: Prepare Frontend for Deployment

1. **Update API Base URL** in `front-end/.env`:
   ```env
   VITE_API_BASE_URL=https://your-backend-api-url.com/api
   ```

2. **Build the frontend**:
   ```bash
   cd front-end
   npm run build
   ```

#### Step 2: Deploy to Vercel

**Method A: Using Vercel CLI (Recommended)**

1. Install Vercel CLI:
   ```bash
   npm install -g vercel
   ```

2. Login to Vercel:
   ```bash
   vercel login
   ```

3. Deploy from the front-end directory:
   ```bash
   cd front-end
   vercel
   ```

4. Follow the prompts:
   - Set up and deploy? **Yes**
   - Which scope? Select your account
   - Link to existing project? **No**
   - Project name? `genius-market` (or your choice)
   - Directory? `./` (current directory)
   - Override settings? **No**

5. Add environment variables:
   ```bash
   vercel env add VITE_API_BASE_URL
   vercel env add VITE_FIREBASE_API_KEY
   vercel env add VITE_FIREBASE_AUTH_DOMAIN
   vercel env add VITE_FIREBASE_PROJECT_ID
   vercel env add VITE_FIREBASE_STORAGE_BUCKET
   vercel env add VITE_FIREBASE_MESSAGING_SENDER_ID
   vercel env add VITE_FIREBASE_APP_ID
   ```

6. Redeploy with environment variables:
   ```bash
   vercel --prod
   ```

**Method B: Using Vercel Dashboard**

1. Go to [vercel.com](https://vercel.com) and sign up/login
2. Click **"Add New Project"**
3. Import your GitHub repository: `mxrahulsharma/blue-finance`
4. Configure:
   - **Framework Preset**: Vite
   - **Root Directory**: `front-end`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
5. Add environment variables in the dashboard
6. Click **Deploy**

### Option 2: Backend Deployment (Required for Full Functionality)

#### Deploy Backend to Railway (Recommended)

1. **Go to [railway.app](https://railway.app)** and sign up/login
2. **Create New Project** → **Deploy from GitHub**
3. Select your repository: `mxrahulsharma/blue-finance`
4. **Configure**:
   - Root Directory: `back-end`
   - Build Command: `npm install`
   - Start Command: `npm start`
5. **Add Environment Variables** in Railway dashboard:
   - Copy all variables from `back-end/.env.example`
   - Add your actual values
6. **Generate Domain**: Railway will provide a URL like `your-app.railway.app`
7. **Update Frontend API URL**: 
   - In Vercel, update `VITE_API_BASE_URL` to `https://your-app.railway.app/api`

#### Alternative: Deploy Backend to Render

1. Go to [render.com](https://render.com) and sign up
2. Create **New Web Service**
3. Connect GitHub repository
4. Configure:
   - **Name**: `genius-market-api`
   - **Root Directory**: `back-end`
   - **Environment**: Node
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
5. Add environment variables
6. Deploy

#### Alternative: Deploy Backend to Heroku

1. Install Heroku CLI:
   ```bash
   npm install -g heroku
   ```

2. Login to Heroku:
   ```bash
   heroku login
   ```

3. Create app:
   ```bash
   cd back-end
   heroku create genius-market-api
   ```

4. Add PostgreSQL addon:
   ```bash
   heroku addons:create heroku-postgresql:mini
   ```

5. Set environment variables:
   ```bash
   heroku config:set DB_HOST=...
   heroku config:set DB_NAME=...
   # Add all other env variables
   ```

6. Deploy:
   ```bash
   git push heroku main
   ```

### Option 3: Full Stack Deployment (Frontend + Backend on Vercel)

**Note**: Vercel works best for frontend. For backend with PostgreSQL, Railway or Render is recommended.

If you want to deploy backend to Vercel:

1. Install Vercel CLI:
   ```bash
   npm install -g vercel
   ```

2. Create `back-end/vercel.json`:
   ```json
   {
     "version": 2,
     "builds": [
       {
         "src": "src/server.js",
         "use": "@vercel/node"
       }
     ],
     "routes": [
       {
         "src": "/(.*)",
         "dest": "src/server.js"
       }
     ]
   }
   ```

3. Deploy backend:
   ```bash
   cd back-end
   vercel
   ```

4. Set environment variables for backend

### Environment Variables Setup

#### Frontend (Vercel)

In Vercel dashboard → Project → Settings → Environment Variables:

```
VITE_API_BASE_URL=https://your-backend-url.com/api
VITE_FIREBASE_API_KEY=your-firebase-api-key
VITE_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your-project-id
VITE_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your-sender-id
VITE_FIREBASE_APP_ID=your-app-id
```

#### Backend (Railway/Render/Heroku)

```
PORT=5001
NODE_ENV=production
DB_HOST=your-db-host
DB_PORT=5432
DB_NAME=your-db-name
DB_USER=your-db-user
DB_PASSWORD=your-db-password
FIREBASE_PROJECT_ID=your-project-id
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"
FIREBASE_CLIENT_EMAIL=your-client-email
FIREBASE_CLIENT_ID=your-client-id
FIREBASE_PRIVATE_KEY_ID=your-key-id
FIREBASE_CLIENT_X509_CERT_URL=your-cert-url
FIREBASE_API_KEY=your-api-key
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret
```

### Database Setup

#### Option 1: Railway PostgreSQL (Recommended)

1. In Railway dashboard, add **PostgreSQL** service
2. Copy connection details to backend environment variables
3. Run migrations:
   ```bash
   # Connect to Railway database and run:
   psql $DATABASE_URL -f job_postings_table.sql
   ```

#### Option 2: Render PostgreSQL

1. Create PostgreSQL database in Render
2. Copy connection string
3. Update backend environment variables

#### Option 3: External Database (Supabase, Neon, etc.)

1. Create database on your preferred provider
2. Get connection string
3. Update backend `.env` variables

### Post-Deployment Checklist

- [ ] Frontend deployed to Vercel
- [ ] Backend deployed to Railway/Render
- [ ] Database created and migrations run
- [ ] Environment variables configured
- [ ] Frontend API URL points to backend
- [ ] Firebase authentication working
- [ ] Test user registration
- [ ] Test company profile creation
- [ ] Test job posting
- [ ] Test image uploads (Cloudinary)
- [ ] CORS configured correctly
- [ ] HTTPS enabled (automatic on Vercel/Railway)

### Troubleshooting

**Frontend can't connect to backend:**
- Check `VITE_API_BASE_URL` in Vercel
- Verify backend is running
- Check CORS settings in backend

**Backend errors:**
- Verify all environment variables are set
- Check database connection
- Verify Firebase credentials

**Build fails:**
- Check Node.js version (use 18+)
- Verify all dependencies installed
- Check build logs for specific errors

### Custom Domain Setup (Optional)

1. In Vercel dashboard → Project → Settings → Domains
2. Add your custom domain
3. Update DNS records as instructed
4. SSL certificate is automatic

### Monitoring

- **Vercel Analytics**: Enable in project settings
- **Backend Logs**: Check Railway/Render logs dashboard
- **Error Tracking**: Consider adding Sentry or similar

---

**Need Help?** Check the [README.md](./README.md) for more details or open an issue on GitHub.
