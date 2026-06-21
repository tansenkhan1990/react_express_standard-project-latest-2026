import { Routes, Route, Navigate } from 'react-router-dom';
import AuthLayout from '../layouts/AuthLayout';
import DashboardLayout from '../layouts/DashboardLayout';
import PrivateRoute from './PrivateRoute';
import PublicRoute from './PublicRoute';

/* ---------- Auth pages ---------- */
import LoginPage from '../features/auth/pages/LoginPage';
import RegisterPage from '../features/auth/pages/RegisterPage';

/* ---------- Landing ---------- */
import HomePage from '../features/auth/pages/HomePage';

/* ---------- User pages ---------- */
import DashboardPage from '../features/users/pages/DashboardPage';
import ProfilePage from '../features/users/pages/ProfilePage';
import SettingsPage from '../features/users/pages/SettingsPage';

/* ---------- Shared ---------- */
import NotFoundPage from './NotFoundPage';

const AppRoutes: React.FC = () => {
  return (
    <Routes>
      {/* Public routes — AuthLayout (centered, no header) */}
      <Route element={<AuthLayout />}>
        <Route element={<PublicRoute />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
        </Route>
      </Route>

      {/* Protected routes — DashboardLayout (with header & nav) */}
      <Route element={<DashboardLayout />}>
        <Route element={<PrivateRoute />}>
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/settings" element={<SettingsPage />} />
        </Route>
      </Route>

      {/* Redirects */}
      <Route path="/home" element={<Navigate to="/" replace />} />

      {/* 404 */}
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
};

export default AppRoutes;
