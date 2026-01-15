import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
  Box,
  AppBar,
  Toolbar,
  Typography,
  Button,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  IconButton,
  Avatar,
  Menu,
  MenuItem,
  Badge,
  FormControl,
  Select,
} from '@mui/material';
import WorkIcon from '@mui/icons-material/Work';
import DashboardIcon from '@mui/icons-material/Dashboard';
import BusinessCenterIcon from '@mui/icons-material/BusinessCenter';
import DescriptionIcon from '@mui/icons-material/Description';
import BusinessIcon from '@mui/icons-material/Business';
import SettingsIcon from '@mui/icons-material/Settings';
import LogoutIcon from '@mui/icons-material/Logout';
import PhoneIcon from '@mui/icons-material/Phone';
import NotificationsIcon from '@mui/icons-material/Notifications';
import { logout } from '../store/slices/authSlice';

const drawerWidth = 280;

const DashboardLayout = ({ children }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const [anchorEl, setAnchorEl] = useState(null);

  const menuItems = [
    { label: 'Overview', icon: <DashboardIcon />, path: '/dashboard' },
    { label: 'Post a Job', icon: <BusinessCenterIcon />, path: '/dashboard/post-job' },
    { label: 'My Jobs', icon: <DescriptionIcon />, path: '/dashboard/jobs' },
    { label: 'All Companies', icon: <BusinessIcon />, path: '/dashboard/companies' },
    { label: 'Settings', icon: <SettingsIcon />, path: '/company-setup' },
  ];

  const topNavItems = [
    { label: 'Home', path: '/' },
    { label: 'Dashboard', path: '/dashboard' },
    { label: 'My Jobs', path: '/dashboard/jobs' },
    { label: 'All Companies', path: '/dashboard/companies' },
  ];

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  const handleProfileMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleProfileMenuClose = () => {
    setAnchorEl(null);
  };

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', backgroundColor: '#f5f5f5' }}>
      {/* Top Navigation Bar */}
      <AppBar
        position="fixed"
        sx={{
          zIndex: (theme) => theme.zIndex.drawer + 1,
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          boxShadow: '0 4px 20px rgba(0,0,0,0.15)',
        }}
      >
        <Toolbar>
          {/* Logo */}
          <Box sx={{ display: 'flex', alignItems: 'center', mr: 4 }}>
            <WorkIcon sx={{ mr: 1, fontSize: 28 }} />
            <Typography variant="h6" component="div" sx={{ fontWeight: 700, fontSize: '1.5rem', letterSpacing: '-0.02em' }}>
              Genius Market
            </Typography>
          </Box>

          {/* Navigation Links */}
          <Box sx={{ display: 'flex', gap: 1, flexGrow: 1 }}>
            {topNavItems.map((item) => (
              <Button
                key={item.path}
                color="inherit"
                onClick={() => navigate(item.path)}
                sx={{
                  color: 'white',
                  textTransform: 'none',
                  '&:hover': {
                    backgroundColor: 'rgba(255, 255, 255, 0.1)',
                  },
                  ...(location.pathname === item.path && {
                    borderBottom: '2px solid white',
                    borderRadius: 0,
                  }),
                }}
              >
                {item.label}
              </Button>
            ))}
          </Box>

          {/* Right Side Actions */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Button
              variant="contained"
              sx={{
                backgroundColor: 'white',
                color: '#667eea',
                textTransform: 'none',
                fontWeight: 600,
                boxShadow: '0 2px 8px rgba(102, 126, 234, 0.3)',
                '&:hover': {
                  backgroundColor: '#f8f9ff',
                  boxShadow: '0 4px 12px rgba(102, 126, 234, 0.4)',
                  transform: 'translateY(-2px)',
                },
                transition: 'all 0.2s ease',
              }}
              onClick={() => navigate('/dashboard/post-job')}
            >
              Post A Job
            </Button>

            <IconButton onClick={handleProfileMenuOpen}>
              <Avatar sx={{ width: 32, height: 32, bgcolor: '#fff', color: '#667eea' }}>
                {user?.email?.[0]?.toUpperCase() || 'U'}
              </Avatar>
            </IconButton>

            <Menu
              anchorEl={anchorEl}
              open={Boolean(anchorEl)}
              onClose={handleProfileMenuClose}
            >
              <MenuItem onClick={() => { handleProfileMenuClose(); navigate('/company-setup'); }}>
                Settings
              </MenuItem>
              <MenuItem onClick={() => { handleProfileMenuClose(); handleLogout(); }}>
                <LogoutIcon sx={{ mr: 1, fontSize: 18 }} />
                Logout
              </MenuItem>
            </Menu>
          </Box>
        </Toolbar>
      </AppBar>

      {/* Sidebar */}
      <Drawer
        variant="permanent"
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: drawerWidth,
            boxSizing: 'border-box',
            backgroundColor: 'white',
            borderRight: '1px solid #e0e0e0',
          },
        }}
      >
        <Toolbar />
        <Box sx={{ overflow: 'auto', py: 2 }}>
          <Typography
            variant="overline"
            sx={{
              px: 3,
              py: 1,
              color: 'text.secondary',
              fontWeight: 600,
              letterSpacing: 1,
            }}
          >
            GENIUS MARKET
          </Typography>
          <List>
            {menuItems.map((item) => {
              const isActive = location.pathname === item.path || location.pathname.startsWith(item.path + '/');
              return (
                <ListItem key={item.label} disablePadding sx={{ px: 2, mb: 0.5 }}>
                  <ListItemButton
                    onClick={() => navigate(item.path)}
                    sx={{
                      borderRadius: 2,
                      backgroundColor: isActive ? '#e3f2fd' : 'transparent',
                      color: isActive ? '#1976d2' : 'text.primary',
                      '&:hover': {
                        backgroundColor: isActive ? '#e3f2fd' : '#f5f5f5',
                      },
                    }}
                  >
                    <ListItemIcon
                      sx={{
                        color: isActive ? '#1976d2' : 'text.secondary',
                        minWidth: 40,
                      }}
                    >
                      {item.icon}
                    </ListItemIcon>
                    <ListItemText
                      primary={item.label}
                      primaryTypographyProps={{
                        fontWeight: isActive ? 600 : 400,
                        fontSize: '0.95rem',
                      }}
                    />
                  </ListItemButton>
                </ListItem>
              );
            })}
          </List>

          {/* Logout at bottom */}
          <Box sx={{ mt: 'auto', px: 2, pt: 2 }}>
            <ListItem disablePadding>
              <ListItemButton
                onClick={handleLogout}
                sx={{
                  borderRadius: 2,
                  color: 'text.secondary',
                  '&:hover': {
                    backgroundColor: '#f5f5f5',
                  },
                }}
              >
                <ListItemIcon sx={{ minWidth: 40, color: 'text.secondary' }}>
                  <LogoutIcon />
                </ListItemIcon>
                <ListItemText
                  primary="Log-out"
                  primaryTypographyProps={{
                    fontSize: '0.95rem',
                  }}
                />
              </ListItemButton>
            </ListItem>
          </Box>
        </Box>
      </Drawer>

      {/* Main Content */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          mt: 8,
          backgroundColor: '#f5f5f5',
          minHeight: 'calc(100vh - 64px)',
        }}
      >
        {children}
      </Box>
    </Box>
  );
};

export default DashboardLayout;
