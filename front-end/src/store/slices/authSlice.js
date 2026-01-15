import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { authApi } from '../../api/authApi.js';

const initialState = {
  user: null,
  token: null,
  isAuthenticated: false,
  loading: false,
  error: null,
};

// Async thunks using createAsyncThunk (supports .unwrap())
export const signIn = createAsyncThunk(
  'auth/signIn',
  async ({ email, password }, { rejectWithValue }) => {
    try {
      const result = await authApi.signIn(email, password);
      return result;
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
      return result;
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
      return null;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

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
    setAuthState: (state, action) => {
      if (action.payload) {
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.isAuthenticated = true;
        state.error = null;
      } else {
        state.user = null;
        state.token = null;
        state.isAuthenticated = false;
        state.error = null;
      }
    },
  },
  extraReducers: (builder) => {
    // signIn
    builder
      .addCase(signIn.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(signIn.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.isAuthenticated = true;
        state.error = null;
      })
      .addCase(signIn.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // signUp
    builder
      .addCase(signUp.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(signUp.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.isAuthenticated = true;
        state.error = null;
      })
      .addCase(signUp.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // logout
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
