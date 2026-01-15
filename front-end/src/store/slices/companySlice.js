import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { companyApi } from '../../api/companyApi.js';

const initialState = {
  company: null,
  loading: false,
  error: null,
};

// Async thunks using createAsyncThunk (supports .unwrap())
export const fetchCompanyProfile = createAsyncThunk(
  'company/fetchProfile',
  async (_, { rejectWithValue }) => {
    try {
      const response = await companyApi.getCompanyProfile();
      return response.data.company;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

export const registerCompany = createAsyncThunk(
  'company/register',
  async (data, { rejectWithValue }) => {
    try {
      const response = await companyApi.registerCompany(data);
      return response.data.company;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

export const updateCompanyProfile = createAsyncThunk(
  'company/updateProfile',
  async (data, { rejectWithValue }) => {
    try {
      const response = await companyApi.updateCompanyProfile(data);
      return response.data.company;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

const companySlice = createSlice({
  name: 'company',
  initialState,
  reducers: {
    clearCompany: (state) => {
      state.company = null;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    // fetchCompanyProfile
    builder
      .addCase(fetchCompanyProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCompanyProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.company = action.payload;
        state.error = null;
      })
      .addCase(fetchCompanyProfile.rejected, (state, action) => {
        state.loading = false;
        // Don't set error if it's a 404 (company not found) - this is expected for new users
        const errorMessage = action.payload || '';
        if (errorMessage && !errorMessage.includes('not found') && !errorMessage.includes('Company not found')) {
          state.error = errorMessage;
        } else {
          state.error = null;
        }
        // Keep existing company if error is just "not found"
        if (errorMessage && (errorMessage.includes('not found') || errorMessage.includes('Company not found'))) {
          // Don't clear company if it's just a 404 - might be a temporary network issue
          // state.company = null;
        }
      });

    // registerCompany
    builder
      .addCase(registerCompany.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(registerCompany.fulfilled, (state, action) => {
        state.loading = false;
        state.company = action.payload;
        state.error = null;
      })
      .addCase(registerCompany.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // updateCompanyProfile
    builder
      .addCase(updateCompanyProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateCompanyProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.company = action.payload;
        state.error = null;
      })
      .addCase(updateCompanyProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearCompany } = companySlice.actions;

export default companySlice.reducer;
