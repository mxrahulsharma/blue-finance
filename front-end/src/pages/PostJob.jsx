import { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
  Box,
  Button,
  TextField,
  Typography,
  Paper,
  Grid,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
  Chip,
  CircularProgress,
  Alert,
} from '@mui/material';
import DashboardLayout from '../components/DashboardLayout';
import { jobApi } from '../api/jobApi';
import { toast } from 'react-toastify';

const PostJob = () => {
  const { register, handleSubmit, formState: { errors }, control } = useForm({
    defaultValues: {
      job_type: '',
      experience_level: '',
      work_mode: '',
    },
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { company } = useSelector((state) => state.company);

  const jobTypes = ['Full-time', 'Part-time', 'Contract', 'Internship', 'Freelance'];
  const experienceLevels = ['Entry Level', 'Mid Level', 'Senior Level', 'Executive'];
  const workModes = ['Remote', 'On-site', 'Hybrid'];

  const onSubmit = async (data) => {
    setSaving(true);
    setError(null);

    try {
      // Format data for backend
      const jobData = {
        ...data,
        // Convert date to ISO format if provided
        deadline: data.deadline ? new Date(data.deadline).toISOString().split('T')[0] : null,
        // Ensure salary fields are integers
        salary_min: data.salary_min ? parseInt(data.salary_min) : null,
        salary_max: data.salary_max ? parseInt(data.salary_max) : null,
        openings: data.openings ? parseInt(data.openings) : 1,
      };

      console.log('Submitting job data:', jobData);
      const response = await jobApi.createJob(jobData);
      
      toast.success('Job posted successfully!');
      
      // Navigate to My Jobs page after successful posting
      setTimeout(() => {
        navigate('/dashboard/jobs');
      }, 1000);
    } catch (err) {
      console.error('Error posting job:', err);
      console.error('Error response:', err?.response?.data);
      
      let errorMsg = 'Failed to post job. Please try again.';
      
      // Handle validation errors
      if (err?.response?.status === 400) {
        if (err?.response?.data?.message) {
          errorMsg = err.response.data.message;
        } else if (err?.response?.data?.errors && Array.isArray(err.response.data.errors)) {
          const validationErrors = err.response.data.errors
            .map(e => e.msg || `${e.param}: ${e.msg}`)
            .join(', ');
          errorMsg = `Validation error: ${validationErrors}`;
        }
      } else if (err?.response?.data?.message) {
        errorMsg = err.response.data.message;
      } else if (err?.message) {
        errorMsg = err.message;
      }
      
      setError(errorMsg);
      toast.error(errorMsg);
    } finally {
      setSaving(false);
    }
  };

  return (
    <DashboardLayout>
      <Box>
        <Typography variant="h4" sx={{ fontWeight: 600, mb: 1 }}>
          Post a Job
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 4 }}>
          Create a new job posting
        </Typography>

        {error && (
          <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError(null)}>
            {error}
          </Alert>
        )}

        <Paper sx={{ p: 4 }}>
          <form onSubmit={handleSubmit(onSubmit)}>
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Job Title"
                  {...register('job_title', { required: 'Job title is required' })}
                  error={!!errors.job_title}
                  helperText={errors.job_title?.message}
                  placeholder="e.g., Senior Software Engineer"
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <FormControl fullWidth error={!!errors.job_type}>
                  <InputLabel>Job Type</InputLabel>
                  <Controller
                    name="job_type"
                    control={control}
                    rules={{ required: 'Job type is required' }}
                    render={({ field }) => (
                      <Select {...field} label="Job Type">
                        {jobTypes.map((type) => (
                          <MenuItem key={type} value={type}>
                            {type}
                          </MenuItem>
                        ))}
                      </Select>
                    )}
                  />
                  {errors.job_type && (
                    <Typography variant="caption" color="error" sx={{ mt: 0.5, ml: 1.75 }}>
                      {errors.job_type.message}
                    </Typography>
                  )}
                </FormControl>
              </Grid>

              <Grid item xs={12} md={6}>
                <FormControl fullWidth error={!!errors.experience_level}>
                  <InputLabel>Experience Level</InputLabel>
                  <Controller
                    name="experience_level"
                    control={control}
                    rules={{ required: 'Experience level is required' }}
                    render={({ field }) => (
                      <Select {...field} label="Experience Level">
                        {experienceLevels.map((level) => (
                          <MenuItem key={level} value={level}>
                            {level}
                          </MenuItem>
                        ))}
                      </Select>
                    )}
                  />
                  {errors.experience_level && (
                    <Typography variant="caption" color="error" sx={{ mt: 0.5, ml: 1.75 }}>
                      {errors.experience_level.message}
                    </Typography>
                  )}
                </FormControl>
              </Grid>

              <Grid item xs={12} md={6}>
                <FormControl fullWidth error={!!errors.work_mode}>
                  <InputLabel>Work Mode</InputLabel>
                  <Controller
                    name="work_mode"
                    control={control}
                    rules={{ required: 'Work mode is required' }}
                    render={({ field }) => (
                      <Select {...field} label="Work Mode">
                        {workModes.map((mode) => (
                          <MenuItem key={mode} value={mode}>
                            {mode}
                          </MenuItem>
                        ))}
                      </Select>
                    )}
                  />
                  {errors.work_mode && (
                    <Typography variant="caption" color="error" sx={{ mt: 0.5, ml: 1.75 }}>
                      {errors.work_mode.message}
                    </Typography>
                  )}
                </FormControl>
              </Grid>

              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Location"
                  {...register('location', { required: 'Location is required' })}
                  error={!!errors.location}
                  helperText={errors.location?.message}
                  placeholder="e.g., New York, NY"
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  type="number"
                  label="Salary Range (Min)"
                  {...register('salary_min', { 
                    min: { value: 0, message: 'Salary must be positive' },
                    validate: (value) => {
                      if (!value || value === '') return true;
                      const num = Number(value);
                      return !isNaN(num) || 'Must be a valid number';
                    }
                  })}
                  error={!!errors.salary_min}
                  helperText={errors.salary_min?.message}
                  placeholder="e.g., 80000"
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  type="number"
                  label="Salary Range (Max)"
                  {...register('salary_max', { 
                    min: { value: 0, message: 'Salary must be positive' },
                    validate: (value) => {
                      if (!value || value === '') return true;
                      const num = Number(value);
                      return !isNaN(num) || 'Must be a valid number';
                    }
                  })}
                  error={!!errors.salary_max}
                  helperText={errors.salary_max?.message}
                  placeholder="e.g., 120000"
                />
              </Grid>

              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Job Description"
                  {...register('job_description', { required: 'Job description is required' })}
                  error={!!errors.job_description}
                  helperText={errors.job_description?.message}
                  multiline
                  rows={6}
                  placeholder="Describe the role, responsibilities, and requirements..."
                />
              </Grid>

              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Required Skills (comma separated)"
                  {...register('required_skills')}
                  error={!!errors.required_skills}
                  helperText={errors.required_skills?.message || "e.g., React, Node.js, AWS"}
                  placeholder="React, Node.js, AWS, PostgreSQL"
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  type="number"
                  label="Number of Openings"
                  {...register('openings', { 
                    required: 'Number of openings is required',
                    min: { value: 1, message: 'Must have at least 1 opening' }
                  })}
                  error={!!errors.openings}
                  helperText={errors.openings?.message}
                  defaultValue={1}
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  type="date"
                  label="Application Deadline"
                  InputLabelProps={{ shrink: true }}
                  {...register('deadline')}
                  error={!!errors.deadline}
                  helperText={errors.deadline?.message}
                />
              </Grid>
            </Grid>

            <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2, mt: 4 }}>
              <Button variant="outlined" onClick={() => window.history.back()}>
                Cancel
              </Button>
              <Button 
                type="submit" 
                variant="contained" 
                size="large"
                disabled={saving}
                sx={{ px: 4 }}
              >
                {saving ? (
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <CircularProgress size={20} />
                    Posting...
                  </Box>
                ) : (
                  'Post Job'
                )}
              </Button>
            </Box>
          </form>
        </Paper>
      </Box>
    </DashboardLayout>
  );
};

export default PostJob;
