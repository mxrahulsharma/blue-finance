import apiClient from './axios.js';
import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5001/api';

// Create a separate axios instance for public endpoints (no auth token)
const publicApiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const companyApi = {
  // Register company
  registerCompany: (data) => {
    return apiClient.post('/company/register', data);
  },

  // Get company profile
  getCompanyProfile: () => {
    return apiClient.get('/company/profile');
  },

  // Update company profile
  updateCompanyProfile: (data) => {
    return apiClient.put('/company/profile', data);
  },

  // Upload company logo
  uploadLogo: (file) => {
    const formData = new FormData();
    formData.append('logo', file);
    return apiClient.post('/company/upload/logo', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },

  // Upload company banner
  uploadBanner: (file) => {
    const formData = new FormData();
    formData.append('banner', file);
    return apiClient.post('/company/upload/banner', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },

  // Get all companies (public endpoint - no auth token needed)
  getAllCompanies: (searchParams = {}) => {
    const params = new URLSearchParams();
    if (searchParams.search) params.append('search', searchParams.search);
    if (searchParams.industry_type) params.append('industry_type', searchParams.industry_type);
    
    const queryString = params.toString();
    return publicApiClient.get(`/company/all${queryString ? `?${queryString}` : ''}`);
  },
};
