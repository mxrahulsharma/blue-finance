import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  Box,
  Typography,
  Paper,
  CircularProgress,
  Grid,
  Card,
  CardContent,
  Button,
  Container,
} from '@mui/material';
import DashboardIcon from '@mui/icons-material/Dashboard';
import BusinessCenterIcon from '@mui/icons-material/BusinessCenter';
import PersonSearchIcon from '@mui/icons-material/PersonSearch';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import { fetchCompanyProfile } from '../store/slices/companySlice';
import DashboardLayout from '../components/DashboardLayout';
import { jobApi } from '../api/jobApi';

const Dashboard = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { company, loading, error } = useSelector((state) => state.company);
  const { user } = useSelector((state) => state.auth);
  const [jobStats, setJobStats] = useState({
    total_jobs: 0,
    active_jobs: 0,
    total_applications: 0,
  });
  const [loadingStats, setLoadingStats] = useState(true);

  const fetchData = async () => {
    try {
      await dispatch(fetchCompanyProfile()).unwrap().catch(err => {
        console.error('Error fetching company profile:', err);
        // Don't block rendering if company fetch fails
      });
      fetchJobStats();
    } catch (error) {
      console.error('Error in fetchData:', error);
    }
  };

  useEffect(() => {
    // Fetch data on mount and when location changes (navigation)
    fetchData();

    // Refetch when window regains focus (user navigates back to tab)
    const handleFocus = () => {
      fetchData();
    };
    window.addEventListener('focus', handleFocus);

    return () => {
      window.removeEventListener('focus', handleFocus);
    };
  }, [dispatch, location.pathname]); // Refetch when pathname changes

  const fetchJobStats = async () => {
    try {
      setLoadingStats(true);
      const response = await jobApi.getJobStats();
      setJobStats(response?.data?.stats || {
        total_jobs: 0,
        active_jobs: 0,
        total_applications: 0,
      });
    } catch (error) {
      console.error('Error fetching job stats:', error);
      // Set default stats on error - don't let this break the page
      setJobStats({
        total_jobs: 0,
        active_jobs: 0,
        total_applications: 0,
      });
    } finally {
      setLoadingStats(false);
    }
  };

  const stats = [
    {
      title: 'Total Jobs Posted',
      value: loadingStats ? '...' : (jobStats?.total_jobs || 0).toString(),
      icon: <BusinessCenterIcon sx={{ fontSize: 40, color: '#1976d2' }} />,
      color: '#e3f2fd',
      link: '/dashboard/jobs',
    },
    {
      title: 'Active Jobs',
      value: loadingStats ? '...' : (jobStats?.active_jobs || 0).toString(),
      icon: <PersonSearchIcon sx={{ fontSize: 40, color: '#2e7d32' }} />,
      color: '#e8f5e9',
      link: '/dashboard/jobs',
    },
    {
      title: 'Applications',
      value: loadingStats ? '...' : (jobStats?.total_applications || 0).toString(),
      icon: <DashboardIcon sx={{ fontSize: 40, color: '#ed6c02' }} />,
      color: '#fff3e0',
    },
  ];

  return (
    <DashboardLayout>
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Typography variant="h4" sx={{ fontWeight: 600, mb: 3 }}>
          Overview
        </Typography>

        {/* Stats Cards */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          {stats.map((stat, index) => (
            <Grid item xs={12} sm={6} md={4} key={index}>
              <Card 
                sx={{ 
                  height: '100%',
                  cursor: stat.link ? 'pointer' : 'default',
                  transition: 'transform 0.2s, box-shadow 0.2s',
                  '&:hover': stat.link ? {
                    transform: 'translateY(-4px)',
                    boxShadow: 4,
                  } : {},
                }}
                onClick={stat.link ? () => navigate(stat.link) : undefined}
              >
                <CardContent>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <Box>
                      <Typography variant="body2" color="text.secondary" gutterBottom>
                        {stat.title}
                      </Typography>
                      <Typography variant="h4" sx={{ fontWeight: 600 }}>
                        {stat.value}
                      </Typography>
                    </Box>
                    <Box
                      sx={{
                        backgroundColor: stat.color,
                        borderRadius: 2,
                        p: 1,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      {stat.icon}
                    </Box>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>

        {/* Company Profile Section */}
        {error && (
          <Paper sx={{ p: 2, mb: 2, bgcolor: 'error.light' }}>
            <Typography color="error">{error}</Typography>
          </Paper>
        )}

        {company ? (
          <Grid container spacing={3}>
            <Grid item xs={12} md={8}>
              <Paper sx={{ p: 3 }}>
                <Typography variant="h5" gutterBottom sx={{ fontWeight: 600 }}>
                  Company Profile
                </Typography>
                <Box sx={{ mt: 2 }}>
                  <Typography variant="body1" sx={{ mb: 1 }}>
                    <strong>Company Name:</strong> {company.company_name}
                  </Typography>
                  <Typography variant="body1" sx={{ mb: 1 }}>
                    <strong>Industry:</strong> {company.industry_type || 'Not specified'}
                  </Typography>
                  <Typography variant="body1" sx={{ mb: 1 }}>
                    <strong>Organization Type:</strong>{' '}
                    {company.organizations_type || company.organization_type || 'Not specified'}
                  </Typography>
                  <Typography variant="body1" sx={{ mb: 1 }}>
                    <strong>Team Size:</strong> {company.team_size || 'Not specified'}
                  </Typography>
                  {company.about_company && (
                    <Typography variant="body1" sx={{ mb: 1, mt: 2 }}>
                      <strong>About:</strong> {company.about_company}
                    </Typography>
                  )}
                </Box>
                <Button
                  variant="contained"
                  sx={{ mt: 3 }}
                  onClick={() => navigate('/company-setup')}
                >
                  Edit Profile
                </Button>
              </Paper>
            </Grid>
            <Grid item xs={12} md={4}>
              <Paper sx={{ p: 3 }}>
                <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
                  Quick Actions
                </Typography>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 2 }}>
                  <Button
                    variant="contained"
                    fullWidth
                    onClick={() => navigate('/dashboard/post-job')}
                  >
                    Post a Job
                  </Button>
                  <Button
                    variant="outlined"
                    fullWidth
                    onClick={() => navigate('/company-setup')}
                  >
                    Edit Company Settings
                  </Button>
                  <Button
                    variant="outlined"
                    fullWidth
                    onClick={() => navigate('/dashboard/jobs')}
                  >
                    View My Jobs
                  </Button>
                </Box>
              </Paper>
            </Grid>
          </Grid>
        ) : (
          <Paper sx={{ p: 4, textAlign: 'center' }}>
            <Typography variant="h6" gutterBottom>
              No Company Profile Found
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
              Please complete your company setup to get started.
            </Typography>
            <Button
              variant="contained"
              onClick={() => navigate('/company-setup')}
            >
            Setup Company Profile
          </Button>
        </Paper>
        )}
      </Container>
    </DashboardLayout>
  );
};

export default Dashboard;
