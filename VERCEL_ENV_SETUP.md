# 📝 Vercel Environment Variables Setup Guide

## ✅ Yes, You NEED to Add Environment Variables in Vercel!

When deploying to Vercel, you **cannot** upload your local `.env` file directly. Instead, you must add each environment variable individually through the Vercel dashboard or CLI.

## 🚀 Two Ways to Add Environment Variables

### Method 1: Via Vercel Dashboard (Recommended)

1. **Go to your project** on [vercel.com](https://vercel.com)
2. Click on your project name
3. Go to **Settings** → **Environment Variables**
4. Add each variable one by one:

#### Frontend Variables (for `front-end` directory):

```
VITE_API_BASE_URL
Value: https://your-backend-url.railway.app/api
(or your deployed backend URL)

VITE_FIREBASE_API_KEY
Value: AIzaSyAbwTSS5L5RTKrNZWKiwkNmj2G1UvNfVKk
(or your Firebase API key)

VITE_FIREBASE_AUTH_DOMAIN
Value: backend-52270.firebaseapp.com
(or your Firebase auth domain)

VITE_FIREBASE_PROJECT_ID
Value: backend-52270
(or your Firebase project ID)

VITE_FIREBASE_STORAGE_BUCKET
Value: backend-52270.appspot.com
(or your Firebase storage bucket)

VITE_FIREBASE_MESSAGING_SENDER_ID
Value: [Your messaging sender ID from Firebase]

VITE_FIREBASE_APP_ID
Value: [Your app ID from Firebase]
```

**Important:** 
- Select **Production**, **Preview**, and **Development** environments for each variable
- Click **Save** after adding each variable

### Method 2: Via Vercel CLI

1. Install Vercel CLI (if not already installed):
   ```bash
   npm install -g vercel
   ```

2. Login to Vercel:
   ```bash
   vercel login
   ```

3. Add environment variables one by one:
   ```bash
   # Navigate to front-end directory
   cd front-end
   
   # Add each variable
   vercel env add VITE_API_BASE_URL
   # Paste the value when prompted
   
   vercel env add VITE_FIREBASE_API_KEY
   # Paste the value when prompted
   
   # ... repeat for all variables
   ```

4. Redeploy after adding variables:
   ```bash
   vercel --prod
   ```

## ⚠️ Important Notes

### 1. Variable Prefixes Matter
- Frontend variables **MUST** start with `VITE_` for Vite to expose them
- Backend variables on Railway/Render don't need any prefix

### 2. Never Commit `.env` Files
- Your `.env` files should already be in `.gitignore`
- Never commit sensitive credentials to GitHub

### 3. Different Variables for Different Environments
- **Production**: Variables for production deployment
- **Preview**: Variables for preview deployments (pull requests)
- **Development**: Variables for local development

### 4. After Adding Variables
After adding environment variables, you **must redeploy** your project:
- In Vercel dashboard: Go to **Deployments** → Click **...** → **Redeploy**
- Or via CLI: `vercel --prod`

### 5. Backend Variables (Railway/Render)
For your backend deployment on Railway or Render:
- Add environment variables in their respective dashboards
- Use the same variables from `back-end/.env.example`
- Don't use `VITE_` prefix (that's only for frontend)

## 🔍 How to Verify Environment Variables Are Set

1. In Vercel Dashboard → Settings → Environment Variables
2. You should see all your variables listed
3. Check the environment type (Production/Preview/Development) for each

## 📋 Quick Checklist

- [ ] All `VITE_*` variables added in Vercel
- [ ] Variables set for Production environment
- [ ] Variables set for Preview environment (optional but recommended)
- [ ] Backend URL points to your deployed backend (Railway/Render)
- [ ] Firebase credentials are correct
- [ ] Project redeployed after adding variables
- [ ] Test the deployed site to verify it works

## 🆘 Troubleshooting

**Problem:** Variables not showing up in the app
- **Solution:** Make sure you redeployed after adding variables
- **Solution:** Check that variables start with `VITE_` for frontend
- **Solution:** Verify you're using `import.meta.env.VITE_*` in your code

**Problem:** Can't find where to add variables
- **Solution:** Go to Project → Settings → Environment Variables

**Problem:** Backend URL not working
- **Solution:** Make sure backend is deployed and accessible
- **Solution:** Update `VITE_API_BASE_URL` with correct backend URL
- **Solution:** Check CORS settings in backend

---

**Remember:** Environment variables in Vercel are project-specific and secure. They're only visible to project collaborators with appropriate access.
