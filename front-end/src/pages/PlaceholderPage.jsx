import { Typography, Box } from '@mui/material';
import DashboardLayout from '../components/DashboardLayout';

const PlaceholderPage = ({ title, description }) => {
  return (
    <DashboardLayout>
      <Box>
        <Typography variant="h4" sx={{ fontWeight: 600, mb: 2 }}>
          {title}
        </Typography>
        <Typography variant="body1" color="text.secondary">
          {description || 'This page is coming soon.'}
        </Typography>
      </Box>
    </DashboardLayout>
  );
};

export default PlaceholderPage;
