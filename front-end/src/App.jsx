import { Routes, Route, Navigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { useEffect, useState } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from './config/firebase';
import { setAuthState } from './store/slices/authSlice';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Settings from './pages/Settings';
import CompanySetup from './pages/CompanySetup';
import SetupComplete from './pages/SetupComplete';
import PostJob from './pages/PostJob';
import MyJobs from './pages/MyJobs';
import AllCompanies from './pages/AllCompanies';
import PlaceholderPage from './pages/PlaceholderPage';
import { Box, CircularProgress } from '@mui/material';

function App() {
  const dispatch = useDispatch();
  const { isAuthenticated } = useSelector((state) => state.auth);
  const [checkingAuth, setCheckingAuth] = useState(true);

  // Check Firebase auth state on mount
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        try {
          const token = await user.getIdToken();
          // Update Redux state with current user
          dispatch(setAuthState({ user, token }));
        } catch (error) {
          console.error('Error getting token:', error);
        }
      } else {
        // User is signed out
        dispatch(setAuthState(null));
      }
      setCheckingAuth(false);
    });

    return () => unsubscribe();
  }, [dispatch]);

  // Show loading while checking auth state
  if (checkingAuth) {
    return (
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: '100vh',
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Routes>
      <Route
        path="/register"
        element={isAuthenticated ? <Navigate to="/dashboard" replace /> : <Register />}
      />
      <Route
        path="/login"
        element={isAuthenticated ? <Navigate to="/dashboard" replace /> : <Login />}
      />
      <Route
        path="/dashboard"
        element={isAuthenticated ? <Dashboard /> : <Navigate to="/register" replace />}
      />
      <Route
        path="/settings"
        element={isAuthenticated ? <Navigate to="/company-setup" replace /> : <Navigate to="/register" replace />}
      />
      <Route
        path="/company-setup"
        element={isAuthenticated ? <CompanySetup /> : <Navigate to="/register" replace />}
      />
      <Route
        path="/setup-complete"
        element={isAuthenticated ? <SetupComplete /> : <Navigate to="/register" replace />}
      />
      {/* Dashboard Routes */}
      <Route
        path="/dashboard/profile"
        element={
          isAuthenticated ? (
            <PlaceholderPage title="Employers Profile" description="Manage your employer profile information." />
          ) : (
            <Navigate to="/register" replace />
          )
        }
      />
      <Route
        path="/dashboard/post-job"
        element={isAuthenticated ? <PostJob /> : <Navigate to="/register" replace />}
      />
      <Route
        path="/dashboard/jobs"
        element={isAuthenticated ? <MyJobs /> : <Navigate to="/register" replace />}
      />
      <Route
        path="/dashboard/applications"
        element={
          isAuthenticated ? (
            <PlaceholderPage title="Applications" description="View and manage job applications." />
          ) : (
            <Navigate to="/register" replace />
          )
        }
      />
      <Route
        path="/dashboard/saved-candidates"
        element={
          isAuthenticated ? (
            <PlaceholderPage title="Saved Candidates" description="View your saved candidate profiles." />
          ) : (
            <Navigate to="/register" replace />
          )
        }
      />
      <Route
        path="/dashboard/billing"
        element={
          isAuthenticated ? (
            <PlaceholderPage title="Plans & Billing" description="Manage your subscription and billing." />
          ) : (
            <Navigate to="/register" replace />
          )
        }
      />
      <Route
        path="/dashboard/companies"
        element={isAuthenticated ? <AllCompanies /> : <Navigate to="/register" replace />}
      />
      <Route path="/" element={<Navigate to={isAuthenticated ? "/dashboard" : "/register"} replace />} />
    </Routes>
  );
}

export default App;
