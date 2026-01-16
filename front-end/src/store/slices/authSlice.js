import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { authApi } from '../../api/authApi.js';

/* =========================
   Helpers (IMPORTANT)
========================= */
const normalizeUser = (user) => {
  if (!user) return null;

  return {
    id: user.id || user.uid || null,
    email: user.email || null,
    first_name: user.first_name || null,
    last_name: user.last_name || null,
    company_id: user.company_id || null,
    provider: user.provider || 'local',
  };
};

/* =========================
   Initial State
========================= */
const initialState = {
  user: null,
  token: null,
  isAuthenticated: false,
  loading: false,
  error: null,
};

/* =========================
   Thunks
========================= */
export const signIn = createAsyncThunk(
  'auth/signIn',
  async ({ email, password }, { rejectWithValue }) => {
    try {
      const result = await authApi.signIn(email, password);
      return result; // { user, token }
    } catch (error) {
      return rejectWithValue(error.message || 'Sign in failed');
    }
  }
);

export const signUp = createAsyncThunk(
  'auth/signUp',
  async ({ email, password }, { rejectWithValue }) => {
    try {
      const result = await authApi.signUp(email, password);
      return result; // { user, token }
    } catch (error) {
      return rejectWithValue(error.message || 'Sign up failed');
    }
  }
);

export const logout = createAsyncThunk(
  'auth/logout',
  async (_, { rejectWithValue }) => {
    try {
      await authApi.signOut();
      return true;
    } catch (error) {
      return rejectWithValue(error.message || 'Logout failed');
    }
  }
);

/* =========================
   Slice
========================= */
const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    clearUser: (state) => {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      state.error = null;
    },

    // Useful for restoring auth from localStorage
    setAuthState: (state, action) => {
      const { user, token } = action.payload || {};

      state.user = normalizeUser(user);
      state.token = token || null;
      state.isAuthenticated = Boolean(user && token);
      state.error = null;
    },
  },

  extraReducers: (builder) => {
    /* ---------- SIGN IN ---------- */
    builder
      .addCase(signIn.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(signIn.fulfilled, (state, action) => {
        state.loading = false;
        state.user = normalizeUser(action.payload.user);
        state.token = action.payload.token || null;
        state.isAuthenticated = true;
        state.error = null;
      })
      .addCase(signIn.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    /* ---------- SIGN UP ---------- */
    builder
      .addCase(signUp.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(signUp.fulfilled, (state, action) => {
        state.loading = false;
        state.user = normalizeUser(action.payload.user);
        state.token = action.payload.token || null;
        state.isAuthenticated = true;
        state.error = null;
      })
      .addCase(signUp.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    /* ---------- LOGOUT ---------- */
    builder
      .addCase(logout.pending, (state) => {
        state.loading = true;
      })
      .addCase(logout.fulfilled, (state) => {
        state.loading = false;
        state.user = null;
        state.token = null;
        state.isAuthenticated = false;
        state.error = null;
      })
      .addCase(logout.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearUser, setAuthState } = authSlice.actions;
export default authSlice.reducer;
