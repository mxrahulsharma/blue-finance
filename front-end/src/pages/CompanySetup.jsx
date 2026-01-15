import { useState, useEffect, useMemo, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Button,
  TextField,
  Typography,
  Container,
  Paper,
  Tabs,
  Tab,
  Grid,
  LinearProgress,
  CircularProgress,
  Alert,
} from '@mui/material';
import BusinessIcon from '@mui/icons-material/Business';
import PublicIcon from '@mui/icons-material/Public';
import ContactMailIcon from '@mui/icons-material/ContactMail';
import AccountBalanceIcon from '@mui/icons-material/AccountBalance';
import ImageUploader from '../components/ImageUploader';
import DashboardLayout from '../components/DashboardLayout';
import { fetchCompanyProfile, updateCompanyProfile } from '../store/slices/companySlice';
import { companyApi } from '../api/companyApi';
import { toast } from 'react-toastify';

const TabPanel = ({ children, value, index }) => (
  <Box role="tabpanel" hidden={value !== index} sx={{ pt: 3 }}>
    {value === index && children}
  </Box>
);

const CompanySetup = () => {
  const [tabValue, setTabValue] = useState(0);
  const [logoFile, setLogoFile] = useState(null);
  const [bannerFile, setBannerFile] = useState(null);
  const [uploadingLogo, setUploadingLogo] = useState(false);
  const [uploadingBanner, setUploadingBanner] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState(null);
  const { register, handleSubmit, formState: { errors }, setValue, watch, reset } = useForm();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { company, loading } = useSelector((state) => state.company);

  useEffect(() => {
    // Fetch company profile, but don't let errors block rendering
    dispatch(fetchCompanyProfile()).catch((error) => {
      console.error('Error fetching company profile:', error);
      // Don't block rendering if fetch fails
    });
  }, [dispatch]);

  // Calculate setup progress - memoized to recalculate when company changes
  const progress = useMemo(() => {
    if (!company) return 0;
    
    const requiredFields = [
      { key: 'company_name', weight: 2 },
      { key: 'about_company', weight: 1 },
      { key: 'industry_type', weight: 1 },
      { key: 'organization_type', weight: 1 },
      { key: 'team_size', weight: 1 },
    ];
    
    const optionalFields = [
      { key: 'company_logo_url', weight: 1 },
      { key: 'company_banner_url', weight: 1 },
      { key: 'company_website', weight: 1 },
    ];
    
    let totalWeight = 0;
    let completedWeight = 0;
    
    // Check required fields
    requiredFields.forEach(field => {
      totalWeight += field.weight;
      const dbKey = field.key === 'organization_type' ? 'organizations_type' : field.key;
      const value = company[dbKey] || company[field.key];
      if (value && value.toString().trim() !== '') {
        completedWeight += field.weight;
      }
    });
    
    // Check optional fields
    optionalFields.forEach(field => {
      totalWeight += field.weight;
      if (company[field.key] && company[field.key].toString().trim() !== '') {
        completedWeight += field.weight;
      }
    });
    
    return totalWeight > 0 ? Math.round((completedWeight / totalWeight) * 100) : 0;
  }, [company]);

  // Track previous progress to detect when profile reaches 100%
  const prevProgressRef = useRef(progress);

  // Sync ref with current progress
  useEffect(() => {
    prevProgressRef.current = progress;
  }, [progress]);

  useEffect(() => {
    if (company) {
      // Reset form with company data - this ensures all fields are properly synced
      reset({
        company_name: company.company_name || '',
        about_company: company.about_company || '',
        company_website: company.company_website || '',
        industry_type: company.industry_type || '',
        organization_type: company.organizations_type || company.organization_type || '',
        team_size: company.team_size || '',
        company_vision: company.company_vision || '',
        map_location_url: company.map_location_url || '',
        headquarter_phone_no: company.headquarter_phone_no || '',
        careers_link: company.careers_link || '',
        social_links: company.social_links || '',
      });
      
      // Set logo and banner previews if they exist
      if (company.company_logo_url) {
        setLogoFile({ preview: company.company_logo_url });
      }
      if (company.company_banner_url) {
        setBannerFile({ preview: company.company_banner_url });
      }
    }
  }, [company, reset]);

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const handleLogoUpload = async () => {
    if (!logoFile?.file) return;

    try {
      setUploadingLogo(true);
      const response = await companyApi.uploadLogo(logoFile.file);
      toast.success('Logo uploaded successfully!');
      dispatch(fetchCompanyProfile()); // Refresh company data
      setLogoFile({ preview: response.data.company_logo_url });
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to upload logo');
    } finally {
      setUploadingLogo(false);
    }
  };

  const handleBannerUpload = async () => {
    if (!bannerFile?.file) return;

    try {
      setUploadingBanner(true);
      const response = await companyApi.uploadBanner(bannerFile.file);
      toast.success('Banner uploaded successfully!');
      dispatch(fetchCompanyProfile()); // Refresh company data
      setBannerFile({ preview: response.data.company_banner_url });
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to upload banner');
    } finally {
      setUploadingBanner(false);
    }
  };

  const onSubmit = async (data) => {
    setSaving(true);
    setSaveError(null);
    
    try {
      // Filter out empty strings and undefined values to avoid validation errors
      const cleanData = Object.entries(data).reduce((acc, [key, value]) => {
        if (value !== '' && value !== undefined && value !== null) {
          acc[key] = value;
        }
        return acc;
      }, {});
      
      console.log('Submitting company update:', cleanData);
      
      const result = await dispatch(updateCompanyProfile(cleanData)).unwrap();
      console.log('Company updated successfully:', result);
      
      // Store old progress before refresh
      const oldProgress = prevProgressRef.current;
      
      // Refresh company data to get latest updates from server
      // This will trigger the useEffect that syncs the form
      const refreshedCompany = await dispatch(fetchCompanyProfile()).unwrap();
      console.log('Refreshed company data:', refreshedCompany);
      
      // Wait a bit for Redux state to propagate and useEffect to run
      // The useEffect hook will automatically sync the form with the updated company data
      await new Promise(resolve => setTimeout(resolve, 100));
      
      // Wait for state to update, then check if progress just reached 100%
      setTimeout(() => {
        const newProgress = progress;
        if (oldProgress < 100 && newProgress === 100) {
          // Only navigate if progress just reached 100% after this save
          navigate('/setup-complete');
        }
        // Update ref with new progress
        prevProgressRef.current = newProgress;
      }, 500);
      
      toast.success('Company information updated successfully!');
      setSaveError(null);
    } catch (error) {
      console.error('Error updating company:', error);
      console.error('Error details:', {
        message: error?.message,
        response: error?.response?.data,
        payload: error?.payload,
      });
      
      // Handle different error types
      let errorMsg = 'Failed to update company information. Please try again.';
      
      if (error?.response?.data?.message) {
        errorMsg = error.response.data.message;
      } else if (error?.response?.data?.errors && Array.isArray(error.response.data.errors)) {
        // Handle validation errors
        errorMsg = error.response.data.errors.map(err => err.msg || err.message).join(', ');
      } else if (error?.message) {
        errorMsg = error.message;
      } else if (error?.payload) {
        errorMsg = typeof error.payload === 'string' ? error.payload : error.payload?.message || errorMsg;
      }
      
      setSaveError(errorMsg);
      toast.error(errorMsg);
    } finally {
      setSaving(false);
    }
  };

  const tabs = [
    { label: 'Company Info', icon: <BusinessIcon /> },
    { label: 'Founding Info', icon: <AccountBalanceIcon /> },
    { label: 'Social Media Profile', icon: <PublicIcon /> },
    { label: 'Contact', icon: <ContactMailIcon /> },
  ];

  // Always render the form - don't block on loading state
  // The form will populate with company data when it loads

  return (
    <DashboardLayout>
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Box sx={{ pb: 4 }}>
          {/* Header with Progress */}
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
            <Typography variant="h4" sx={{ fontWeight: 600, color: 'text.primary' }}>
              Settings
            </Typography>
            <Box sx={{ minWidth: 250 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                <Typography variant="body2" sx={{ fontWeight: 500, color: 'text.secondary' }}>
                  Setup Progress
                </Typography>
                <Typography variant="body2" color="primary" sx={{ fontWeight: 600 }}>
                  {progress}% Completed
                </Typography>
              </Box>
              <LinearProgress
                variant="determinate"
                value={progress}
                sx={{
                  height: 8,
                  borderRadius: 4,
                  backgroundColor: 'grey.200',
                  '& .MuiLinearProgress-bar': {
                    borderRadius: 4,
                  },
                }}
              />
            </Box>
          </Box>

          {/* Tabs */}
          <Paper
            elevation={0}
            sx={{
              borderBottom: 1,
              borderColor: 'divider',
              mb: 3,
              backgroundColor: 'background.paper',
            }}
          >
            <Tabs
              value={tabValue}
              onChange={handleTabChange}
              sx={{
                '& .MuiTab-root': {
                  textTransform: 'none',
                  minHeight: 64,
                  fontSize: '0.95rem',
                  gap: 1,
                  px: 3,
                },
                '& .Mui-selected': {
                  color: 'primary.main',
                  fontWeight: 600,
                },
                '& .MuiTabs-indicator': {
                  height: 3,
                },
              }}
            >
              {tabs.map((tab, index) => (
                <Tab
                  key={index}
                  label={tab.label}
                  icon={tab.icon}
                  iconPosition="start"
                />
              ))}
            </Tabs>
          </Paper>

          {/* Tab Panels */}
          <Paper
            elevation={0}
            sx={{
              p: 4,
              backgroundColor: 'background.paper',
              borderRadius: 2,
              boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
            }}
          >
            {/* Company Info Tab */}
            <TabPanel value={tabValue} index={0}>
              <form onSubmit={handleSubmit(onSubmit)}>
                {saveError && (
                  <Alert severity="error" sx={{ mb: 3 }} onClose={() => setSaveError(null)}>
                    {saveError}
                  </Alert>
                )}
                <Typography variant="h6" sx={{ mb: 4, fontWeight: 600, color: 'text.primary' }}>
                  Logo & Banner Image
                </Typography>
              
                <Grid container spacing={4} sx={{ mb: 5 }}>
                  <Grid item xs={12} md={6}>
                    <ImageUploader
                      label="Upload Logo"
                      value={logoFile}
                      onChange={setLogoFile}
                      maxSize={5}
                      optimalDimensions="A photo larger than 400 pixels work best."
                    />
                    {logoFile?.file && (
                      <Button
                        variant="contained"
                        size="medium"
                        onClick={handleLogoUpload}
                        disabled={uploadingLogo}
                        sx={{ mt: 2 }}
                        fullWidth
                      >
                        {uploadingLogo ? 'Uploading...' : 'Upload Logo'}
                      </Button>
                    )}
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <ImageUploader
                      label="Banner Image"
                      value={bannerFile}
                      onChange={setBannerFile}
                      maxSize={5}
                      optimalDimensions="Banner images optimal dimension 1520*400. Supported format JPEG, PNG."
                    />
                    {bannerFile?.file && (
                      <Button
                        variant="contained"
                        size="medium"
                        onClick={handleBannerUpload}
                        disabled={uploadingBanner}
                        sx={{ mt: 2 }}
                        fullWidth
                      >
                        {uploadingBanner ? 'Uploading...' : 'Upload Banner'}
                      </Button>
                    )}
                  </Grid>
                </Grid>

                <Grid container spacing={3}>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Company name"
                      {...register('company_name', { required: 'Company name is required' })}
                      error={!!errors.company_name}
                      helperText={errors.company_name?.message}
                      placeholder="Enter your company name"
                      sx={{ mb: 2 }}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="About Us"
                      {...register('about_company')}
                      multiline
                      rows={6}
                      placeholder="Write down about your company here. Let the candidate know who we are..."
                    />
                  </Grid>
                </Grid>

                <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 4 }}>
                  <Button 
                    type="submit" 
                    variant="contained" 
                    size="large" 
                    sx={{ px: 4 }}
                    disabled={saving}
                  >
                    {saving ? (
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <CircularProgress size={20} />
                        Saving...
                      </Box>
                    ) : (
                      'Save Changes'
                    )}
                  </Button>
                </Box>
            </form>
          </TabPanel>

                {/* Founding Info Tab */}
                <TabPanel value={tabValue} index={1}>
                  <form onSubmit={handleSubmit(onSubmit)}>
                    {saveError && (
                      <Alert severity="error" sx={{ mb: 3 }} onClose={() => setSaveError(null)}>
                        {saveError}
                      </Alert>
                    )}
                    <Typography variant="h6" sx={{ mb: 4, fontWeight: 600, color: 'text.primary' }}>
                      Founding Information
                    </Typography>
              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Industry Type"
                    {...register('industry_type', { required: 'Industry type is required' })}
                    error={!!errors.industry_type}
                    helperText={errors.industry_type?.message}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Organization Type"
                    {...register('organization_type', { required: 'Organization type is required' })}
                    error={!!errors.organization_type}
                    helperText={errors.organization_type?.message}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Team Size"
                    {...register('team_size', { required: 'Team size is required' })}
                    error={!!errors.team_size}
                    helperText={errors.team_size?.message}
                  />
                </Grid>
              </Grid>
                    <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 4 }}>
                      <Button 
                        type="submit" 
                        variant="contained" 
                        size="large" 
                        sx={{ px: 4 }}
                        disabled={saving}
                      >
                        {saving ? (
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <CircularProgress size={20} />
                            Saving...
                          </Box>
                        ) : (
                          'Save Changes'
                        )}
                      </Button>
                    </Box>
                  </form>
                </TabPanel>

                {/* Social Media Profile Tab */}
                <TabPanel value={tabValue} index={2}>
                  <form onSubmit={handleSubmit(onSubmit)}>
                    {saveError && (
                      <Alert severity="error" sx={{ mb: 3 }} onClose={() => setSaveError(null)}>
                        {saveError}
                      </Alert>
                    )}
                    <Typography variant="h6" sx={{ mb: 4, fontWeight: 600, color: 'text.primary' }}>
                      Social Media & Links
                    </Typography>
              <Grid container spacing={3}>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Company Website"
                    {...register('company_website', {
                      pattern: {
                        value: /^https?:\/\/.+/,
                        message: 'Please enter a valid URL',
                      },
                    })}
                    error={!!errors.company_website}
                    helperText={errors.company_website?.message}
                    placeholder="https://www.example.com"
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Careers Link"
                    {...register('careers_link', {
                      pattern: {
                        value: /^https?:\/\/.+/,
                        message: 'Please enter a valid URL',
                      },
                    })}
                    error={!!errors.careers_link}
                    helperText={errors.careers_link?.message}
                    placeholder="https://www.example.com/careers"
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Map Location URL"
                    {...register('map_location_url', {
                      pattern: {
                        value: /^https?:\/\/.+/,
                        message: 'Please enter a valid URL',
                      },
                    })}
                    error={!!errors.map_location_url}
                    helperText={errors.map_location_url?.message}
                    placeholder="https://maps.google.com/..."
                  />
                </Grid>
              </Grid>
                    <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 4 }}>
                      <Button 
                        type="submit" 
                        variant="contained" 
                        size="large" 
                        sx={{ px: 4 }}
                        disabled={saving}
                      >
                        {saving ? (
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <CircularProgress size={20} />
                            Saving...
                          </Box>
                        ) : (
                          'Save Changes'
                        )}
                      </Button>
                    </Box>
                  </form>
                </TabPanel>

                {/* Contact Tab */}
                <TabPanel value={tabValue} index={3}>
                  <form onSubmit={handleSubmit(onSubmit)}>
                    {saveError && (
                      <Alert severity="error" sx={{ mb: 3 }} onClose={() => setSaveError(null)}>
                        {saveError}
                      </Alert>
                    )}
                    <Typography variant="h6" sx={{ mb: 4, fontWeight: 600, color: 'text.primary' }}>
                      Contact Information
                    </Typography>
              <Grid container spacing={3}>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Headquarter Phone Number"
                    {...register('headquarter_phone_no')}
                    error={!!errors.headquarter_phone_no}
                    helperText={errors.headquarter_phone_no?.message}
                    placeholder="+1 (555) 123-4567"
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Company Vision"
                    {...register('company_vision')}
                    multiline
                    rows={4}
                    placeholder="Describe your company's vision..."
                  />
                </Grid>
              </Grid>
                    <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 4 }}>
                      <Button 
                        type="submit" 
                        variant="contained" 
                        size="large" 
                        sx={{ px: 4 }}
                        disabled={saving}
                      >
                        {saving ? (
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <CircularProgress size={20} />
                            Saving...
                          </Box>
                        ) : (
                          'Save Changes'
                        )}
                      </Button>
                    </Box>
                  </form>
                </TabPanel>
              </Paper>
          </Box>
        </Container>
      </DashboardLayout>
    );
};

export default CompanySetup;
