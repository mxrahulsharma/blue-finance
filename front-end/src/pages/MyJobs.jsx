import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Button,
  Typography,
  Paper,
  Grid,
  Card,
  CardContent,
  Chip,
  IconButton,
  Menu,
  MenuItem,
  CircularProgress,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from '@mui/material';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import VisibilityIcon from '@mui/icons-material/Visibility';
import DashboardLayout from '../components/DashboardLayout';
import { jobApi } from '../api/jobApi';
import { toast } from 'react-toastify';

const MyJobs = () => {
  const navigate = useNavigate();
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedJob, setSelectedJob] = useState(null);

  const fetchJobs = async () => {
    setLoading(true);
    try {
      const response = await jobApi.getMyJobs();
      const jobsData = response.data.jobs.map(job => ({
        id: job.id,
        title: job.job_title,
        type: job.job_type,
        location: job.location,
        status: job.status,
        applications: job.application_count || 0,
        posted_date: job.created_at,
        job: job, // Keep full job object for actions
      }));
      setJobs(jobsData);
    } catch (error) {
      console.error('Error fetching jobs:', error);
      toast.error('Failed to load jobs. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJobs();
  }, []);

  const handleMenuOpen = (event, job) => {
    setAnchorEl(event.currentTarget);
    setSelectedJob(job);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedJob(null);
  };

  const handleEdit = (job) => {
    handleMenuClose();
    // Navigate to edit page or open edit dialog
    console.log('Edit job:', job);
  };

  const handleDelete = async (job) => {
    handleMenuClose();
    
    if (!window.confirm(`Are you sure you want to delete "${job.title}"?`)) {
      return;
    }

    try {
      await jobApi.deleteJob(job.id);
      toast.success('Job deleted successfully');
      fetchJobs(); // Refresh the list
    } catch (error) {
      console.error('Error deleting job:', error);
      toast.error(error?.response?.data?.message || 'Failed to delete job');
    }
  };

  const handleView = (job) => {
    handleMenuClose();
    // Navigate to job details page
    console.log('View job:', job);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Active':
        return 'success';
      case 'Draft':
        return 'default';
      case 'Closed':
        return 'error';
      default:
        return 'default';
    }
  };

  if (loading) {
    return (
      <DashboardLayout>
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 8 }}>
          <CircularProgress />
        </Box>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <Box>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
          <Box>
            <Typography variant="h4" sx={{ fontWeight: 600, mb: 1 }}>
              My Jobs
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Manage your job postings
            </Typography>
          </Box>
          <Button
            variant="contained"
            onClick={() => navigate('/dashboard/post-job')}
            sx={{ px: 3 }}
          >
            Post a Job
          </Button>
        </Box>

        {jobs.length === 0 ? (
          <Paper sx={{ p: 6, textAlign: 'center' }}>
            <Typography variant="h6" color="text.secondary" gutterBottom>
              No jobs posted yet
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
              Start by posting your first job opening
            </Typography>
            <Button
              variant="contained"
              onClick={() => navigate('/dashboard/post-job')}
              size="large"
            >
              Post a Job
            </Button>
          </Paper>
        ) : (
          <TableContainer component={Paper} sx={{ boxShadow: 2 }}>
            <Table>
              <TableHead>
                <TableRow sx={{ backgroundColor: '#f5f5f5' }}>
                  <TableCell><strong>Job Title</strong></TableCell>
                  <TableCell><strong>Type</strong></TableCell>
                  <TableCell><strong>Location</strong></TableCell>
                  <TableCell><strong>Status</strong></TableCell>
                  <TableCell><strong>Applications</strong></TableCell>
                  <TableCell><strong>Posted Date</strong></TableCell>
                  <TableCell align="right"><strong>Actions</strong></TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {jobs.map((job) => (
                  <TableRow key={job.id} hover sx={{ '&:hover': { backgroundColor: '#fafafa' } }}>
                    <TableCell>
                      <Typography variant="body1" sx={{ fontWeight: 500 }}>
                        {job.title}
                      </Typography>
                    </TableCell>
                    <TableCell>{job.type}</TableCell>
                    <TableCell>{job.location}</TableCell>
                    <TableCell>
                      <Chip
                        label={job.status}
                        color={getStatusColor(job.status)}
                        size="small"
                      />
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" sx={{ fontWeight: 500 }}>
                        {job.applications}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      {job.posted_date ? new Date(job.posted_date).toLocaleDateString() : 'N/A'}
                    </TableCell>
                    <TableCell align="right">
                      <IconButton
                        size="small"
                        onClick={(e) => handleMenuOpen(e, job)}
                      >
                        <MoreVertIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}

        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={handleMenuClose}
        >
          <MenuItem onClick={() => handleView(selectedJob)}>
            <VisibilityIcon sx={{ mr: 1, fontSize: 18 }} />
            View
          </MenuItem>
          <MenuItem onClick={() => handleEdit(selectedJob)}>
            <EditIcon sx={{ mr: 1, fontSize: 18 }} />
            Edit
          </MenuItem>
          <MenuItem onClick={() => handleDelete(selectedJob)} sx={{ color: 'error.main' }}>
            <DeleteIcon sx={{ mr: 1, fontSize: 18 }} />
            Delete
          </MenuItem>
        </Menu>
      </Box>
    </DashboardLayout>
  );
};

export default MyJobs;
