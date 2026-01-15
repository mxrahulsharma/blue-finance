import { useState } from 'react';
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
  Stepper,
  Step,
  StepLabel,
  Grid,
  CircularProgress,
  Alert,
} from '@mui/material';
import { signUp } from '../store/slices/authSlice';
import { registerCompany } from '../store/slices/companySlice';
import { toast } from 'react-toastify';

const steps = ['Company Information', 'Account Details', 'Complete'];

const Register = () => {
  const [activeStep, setActiveStep] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);
  const { register, handleSubmit, formState: { errors }, watch } = useForm();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const password = watch('password');
  const { loading: authLoading } = useSelector((state) => state.auth);
  const { loading: companyLoading } = useSelector((state) => state.company);

  const companyFields = [
    { name: 'company_name', label: 'Company Name', required: true },
    { name: 'industry_type', label: 'Industry Type', required: true },
    { name: 'organization_type', label: 'Organization Type', required: true },
    { name: 'team_size', label: 'Team Size', required: true },
    { name: 'company_website', label: 'Company Website', required: false },
    { name: 'about_company', label: 'About Company', required: false, multiline: true, rows: 4 },
  ];

  const accountFields = [
    { name: 'email', label: 'Email', type: 'email', required: true },
    { name: 'password', label: 'Password', type: 'password', required: true },
    { name: 'confirmPassword', label: 'Confirm Password', type: 'password', required: true },
  ];

  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const onSubmitCompany = async (data) => {
    // Store company data temporarily
    sessionStorage.setItem('companyData', JSON.stringify(data));
    handleNext();
  };

  const onSubmitAccount = async (data) => {
    if (data.password !== data.confirmPassword) {
      setErrorMessage('Passwords do not match');
      toast.error('Passwords do not match');
      return;
    }

    setIsSubmitting(true);
    setErrorMessage(null);

    try {
      // Step 1: Create Firebase user account
      console.log('Step 1: Creating Firebase account...');
      const authResult = await dispatch(signUp({ email: data.email, password: data.password })).unwrap();
      console.log('✅ Firebase account created:', authResult);
      
      // Wait a moment to ensure Firebase token is ready
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Step 2: Get company data from session
      const companyDataStr = sessionStorage.getItem('companyData');
      if (!companyDataStr) {
        throw new Error('Company data not found. Please go back and fill company information.');
      }
      
      const companyData = JSON.parse(companyDataStr);
      console.log('Step 2: Registering company with data:', companyData);
      
      // Verify we have required fields
      if (!companyData.company_name || !companyData.industry_type || !companyData.organization_type || !companyData.team_size) {
        throw new Error('Missing required company information. Please go back and complete all required fields.');
      }
      
      // Step 3: Register company (axios interceptor will add Firebase token automatically)
      console.log('Step 3: Sending company registration request...');
      const companyResult = await dispatch(registerCompany(companyData)).unwrap();
      console.log('✅ Company registered:', companyResult);
      
      // Clear session data
      sessionStorage.removeItem('companyData');
      
      toast.success('Registration successful! Company and account created.');
      handleNext();
    } catch (error) {
      console.error('❌ Registration error:', error);
      console.error('Error details:', {
        message: error?.message,
        response: error?.response?.data,
        stack: error?.stack,
      });
      
      let errorMsg = 'Registration failed. Please try again.';
      
      if (error?.response?.data?.message) {
        errorMsg = error.response.data.message;
      } else if (error?.message) {
        errorMsg = error.message;
      } else if (typeof error === 'string') {
        errorMsg = error;
      }
      
      setErrorMessage(errorMsg);
      toast.error(errorMsg);
      
      // If Firebase signup succeeded but company registration failed, user is still logged in
      // Allow them to continue to company setup or retry
      if (errorMsg.includes('Company already registered')) {
        // Company exists, navigate to setup
        setTimeout(() => {
          navigate('/company-setup');
        }, 2000);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleComplete = () => {
    navigate('/company-setup');
  };

  const renderStepContent = (step) => {
    switch (step) {
      case 0:
        return (
          <form onSubmit={handleSubmit(onSubmitCompany)}>
            <Grid container spacing={2} sx={{ mt: 2 }}>
              {companyFields.map((field) => (
                <Grid item xs={12} key={field.name}>
                  <TextField
                    fullWidth
                    label={field.label}
                    {...register(field.name, {
                      required: field.required ? `${field.label} is required` : false,
                    })}
                    error={!!errors[field.name]}
                    helperText={errors[field.name]?.message}
                    multiline={field.multiline}
                    rows={field.rows}
                  />
                </Grid>
              ))}
            </Grid>
            <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 3 }}>
              <Button type="submit" variant="contained">
                Next
              </Button>
            </Box>
          </form>
        );

      case 1:
        return (
          <form onSubmit={handleSubmit(onSubmitAccount)}>
            {errorMessage && (
              <Alert severity="error" sx={{ mb: 3 }} onClose={() => setErrorMessage(null)}>
                {errorMessage}
              </Alert>
            )}
            <Grid container spacing={2} sx={{ mt: 2 }}>
              {accountFields.map((field) => (
                <Grid item xs={12} key={field.name}>
                  <TextField
                    fullWidth
                    label={field.label}
                    type={field.type || 'text'}
                    {...register(field.name, {
                      required: field.required ? `${field.label} is required` : false,
                      validate: field.name === 'confirmPassword' && password
                        ? (value) => value === password || 'Passwords do not match'
                        : undefined,
                    })}
                    error={!!errors[field.name]}
                    helperText={errors[field.name]?.message}
                    disabled={isSubmitting}
                  />
                </Grid>
              ))}
            </Grid>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 3 }}>
              <Button onClick={handleBack} disabled={isSubmitting}>
                Back
              </Button>
              <Button 
                type="submit" 
                variant="contained"
                disabled={isSubmitting || authLoading || companyLoading}
              >
                {isSubmitting || authLoading || companyLoading ? (
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <CircularProgress size={20} />
                    Registering...
                  </Box>
                ) : (
                  'Register'
                )}
              </Button>
            </Box>
          </form>
        );

      case 2:
        return (
          <Box sx={{ mt: 4, textAlign: 'center' }}>
            <Typography variant="h5" gutterBottom>
              Registration Complete! 🎉
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
              Your company has been registered successfully. You can now access your dashboard.
            </Typography>
            <Button variant="contained" onClick={handleComplete}>
              Go to Dashboard
            </Button>
          </Box>
        );

      default:
        return null;
    }
  };

  return (
    <Container maxWidth="md">
      <Box sx={{ mt: 8, mb: 4 }}>
        <Paper elevation={3} sx={{ p: 4, borderRadius: 3 }}>
          <Box sx={{ textAlign: 'center', mb: 3 }}>
            <Typography variant="h4" component="h1" gutterBottom sx={{ fontWeight: 700, background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
              Join Genius Market
            </Typography>
            <Typography variant="h6" component="h2" color="text.secondary" gutterBottom>
              Register your company and find the best talent
            </Typography>
          </Box>
          <Stepper activeStep={activeStep} sx={{ mt: 4, mb: 4 }}>
            {steps.map((label) => (
              <Step key={label}>
                <StepLabel>{label}</StepLabel>
              </Step>
            ))}
          </Stepper>
          {renderStepContent(activeStep)}
          {activeStep === 0 && (
            <Box sx={{ mt: 2, textAlign: 'center' }}>
              <Typography variant="body2">
                Already have an account?{' '}
                <Button
                  variant="text"
                  onClick={() => navigate('/login')}
                  size="small"
                >
                  Login
                </Button>
              </Typography>
            </Box>
          )}
        </Paper>
      </Box>
    </Container>
  );
};

export default Register;
