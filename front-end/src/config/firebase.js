import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "AIzaSyAbwTSS5L5RTKrNZWKiwkNmj2G1UvNfVKk",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "backend-52270.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "backend-52270",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "backend-52270.appspot.com",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication and get a reference to the service
export const auth = getAuth(app);
export default app;
