import { Box, Button, Typography, Container } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';

const SetupComplete = () => {
  const navigate = useNavigate();

  return (
    <Box
      sx={{
        backgroundColor: 'background.default',
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        pt: 4,
        pb: 4,
      }}
    >
      <Container maxWidth="md">
        <Box
          sx={{
            textAlign: 'center',
            backgroundColor: 'background.paper',
            borderRadius: 3,
            p: 6,
            boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
          }}
        >
          {/* Success Icon */}
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'center',
              mb: 4,
            }}
          >
            <Box
              sx={{
                width: 120,
                height: 120,
                borderRadius: '50%',
                border: '4px solid',
                borderColor: 'primary.main',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: 'primary.light',
                backgroundColor: 'rgba(25, 118, 210, 0.1)',
              }}
            >
              <CheckCircleIcon
                sx={{
                  fontSize: 80,
                  color: 'primary.main',
                }}
              />
            </Box>
          </Box>

          {/* Success Message */}
          <Typography
            variant="h3"
            sx={{
              fontWeight: 700,
              mb: 2,
              color: 'text.primary',
            }}
          >
            Congratulations, You profile is 100% complete! 🎉
          </Typography>

          <Typography
            variant="body1"
            sx={{
              color: 'text.secondary',
              mb: 6,
              fontSize: '1.1rem',
              maxWidth: '600px',
              mx: 'auto',
            }}
          >
            Your company profile has been successfully set up. You can now start posting jobs,
            finding candidates, and managing your hiring process.
          </Typography>

          {/* Action Buttons */}
          <Box
            sx={{
              display: 'flex',
              gap: 2,
              justifyContent: 'center',
              flexWrap: 'wrap',
            }}
          >
            <Button
              variant="outlined"
              size="large"
              onClick={() => navigate('/dashboard')}
              sx={{
                px: 4,
                py: 1.5,
                fontSize: '1rem',
                borderWidth: 2,
                '&:hover': {
                  borderWidth: 2,
                },
              }}
            >
              View Dashboard
            </Button>
            <Button
              variant="contained"
              size="large"
              onClick={() => navigate('/company-setup')}
              sx={{
                px: 4,
                py: 1.5,
                fontSize: '1rem',
              }}
            >
              View Profile
            </Button>
          </Box>
        </Box>
      </Container>
    </Box>
  );
};

export default SetupComplete;
