import apiClient from './axios.js';

export const jobApi = {
  // Create a new job posting
  createJob: (data) => {
    return apiClient.post('/jobs', data);
  },

  // Get all jobs for current user's company
  getMyJobs: () => {
    return apiClient.get('/jobs');
  },

  // Get job by ID
  getJobById: (id) => {
    return apiClient.get(`/jobs/${id}`);
  },

  // Update job
  updateJob: (id, data) => {
    return apiClient.put(`/jobs/${id}`, data);
  },

  // Delete job
  deleteJob: (id) => {
    return apiClient.delete(`/jobs/${id}`);
  },

  // Get job statistics
  getJobStats: () => {
    return apiClient.get('/jobs/stats');
  },
};
