import { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Paper,
  Grid,
  Card,
  CardContent,
  TextField,
  InputAdornment,
  CircularProgress,
  Avatar,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import BusinessIcon from '@mui/icons-material/Business';
import DashboardLayout from '../components/DashboardLayout';
import { companyApi } from '../api/companyApi';
import { toast } from 'react-toastify';

const AllCompanies = () => {
  const [companies, setCompanies] = useState([]);
  const [filteredCompanies, setFilteredCompanies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchCompanies = async () => {
      setLoading(true);
      try {
        const response = await companyApi.getAllCompanies();
        const companiesData = response.data.companies || [];
        
        setCompanies(companiesData);
        setFilteredCompanies(companiesData);
      } catch (error) {
        console.error('Error fetching companies:', error);
        toast.error('Failed to load companies. Please try again.');
        setCompanies([]);
        setFilteredCompanies([]);
      } finally {
        setLoading(false);
      }
    };

    fetchCompanies();
  }, []);

  useEffect(() => {
    // Client-side filtering for better UX
    if (searchTerm.trim() === '') {
      setFilteredCompanies(companies);
    } else {
      const filtered = companies.filter((company) =>
        company.company_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        company.industry_type?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (company.about_company && company.about_company.toLowerCase().includes(searchTerm.toLowerCase()))
      );
      setFilteredCompanies(filtered);
    }
  }, [searchTerm, companies]);

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
        <Typography variant="h4" sx={{ fontWeight: 600, mb: 1 }}>
          All Companies
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 4 }}>
          Browse all registered companies on the platform
        </Typography>

        <Paper sx={{ p: 3, mb: 4 }}>
          <TextField
            fullWidth
            placeholder="Search companies by name, industry, or description..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
            }}
          />
        </Paper>

        {filteredCompanies.length === 0 ? (
          <Paper sx={{ p: 6, textAlign: 'center' }}>
            <Typography variant="h6" color="text.secondary">
              {searchTerm ? 'No companies found' : 'No companies registered yet'}
            </Typography>
          </Paper>
        ) : (
          <Grid container spacing={3}>
            {filteredCompanies.map((company) => (
              <Grid item xs={12} md={6} lg={4} key={company.id}>
                <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                  <CardContent sx={{ flexGrow: 1 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                      {company.company_logo_url ? (
                        <Box
                          component="img"
                          src={company.company_logo_url}
                          alt={company.company_name}
                          sx={{ width: 60, height: 60, borderRadius: 1, mr: 2, objectFit: 'cover' }}
                        />
                      ) : (
                        <Avatar sx={{ width: 60, height: 60, mr: 2, bgcolor: 'primary.main' }}>
                          <BusinessIcon />
                        </Avatar>
                      )}
                      <Box>
                        <Typography variant="h6" sx={{ fontWeight: 600 }}>
                          {company.company_name}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {company.industry_type}
                        </Typography>
                      </Box>
                    </Box>

                    {company.location && (
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                        <LocationOnIcon sx={{ fontSize: 16, mr: 0.5, color: 'text.secondary' }} />
                        <Typography variant="body2" color="text.secondary">
                          {company.location}
                        </Typography>
                      </Box>
                    )}

                    {company.about_company && (
                      <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{ mb: 2, minHeight: 60 }}
                      >
                        {company.about_company.length > 100
                          ? `${company.about_company.substring(0, 100)}...`
                          : company.about_company}
                      </Typography>
                    )}

                    {company.company_website && (
                      <Typography
                        variant="body2"
                        component="a"
                        href={company.company_website}
                        target="_blank"
                        rel="noopener noreferrer"
                        sx={{
                          color: 'primary.main',
                          textDecoration: 'none',
                          fontWeight: 500,
                          display: 'inline-flex',
                          alignItems: 'center',
                          '&:hover': { textDecoration: 'underline' },
                        }}
                      >
                        Visit Website →
                      </Typography>
                    )}
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        )}
      </Box>
    </DashboardLayout>
  );
};

export default AllCompanies;
