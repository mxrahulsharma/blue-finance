import apiClient from './axios.js';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut } from 'firebase/auth';
import { auth } from '../config/firebase.js';

export const authApi = {
  // Firebase sign in
  signIn: async (email, password) => {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const token = await userCredential.user.getIdToken();
    return { user: userCredential.user, token };
  },

  // Firebase sign up
  signUp: async (email, password) => {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const token = await userCredential.user.getIdToken();
    return { user: userCredential.user, token };
  },

  // Sign out
  signOut: async () => {
    await signOut(auth);
  },

  // Get current user token
  getCurrentUserToken: async () => {
    const user = auth.currentUser;
    if (user) {
      return await user.getIdToken();
    }
    return null;
  },

  // Traditional login (if needed)
  login: (email, password) => {
    return apiClient.post('/auth/login', { email, password });
  },

  // Traditional register (if needed)
  register: (data) => {
    return apiClient.post('/auth/register', data);
  },
};
