import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AppProvider, useApp } from './context/AppContext';
import { MainLayout } from './components/Layout/MainLayout';

// Auth Pages
import { LoginPage } from './pages/Auth/LoginPage';
import { SignupPage } from './pages/Auth/SignupPage';
import { ForgotPasswordPage } from './pages/Auth/ForgotPasswordPage';

// Employee Pages
import { EmployeeDashboard } from './pages/Employee/EmployeeDashboard';
import { SubmitExpense } from './pages/Employee/SubmitExpense';
import { MyExpenses } from './pages/Employee/MyExpenses';

// Manager Pages
import { ManagerDashboard } from './pages/Manager/ManagerDashboard';
import { PendingApprovals } from './pages/Manager/PendingApprovals';

// Admin Pages
import { AdminDashboard } from './pages/Admin/AdminDashboard';
import { UserManagement } from './pages/Admin/UserManagement';
import { ApprovalRules } from './pages/Admin/ApprovalRules';

// Common Pages
import { Profile } from './pages/Common/Profile';
import { Notifications } from './pages/Common/Notifications';
import { Help } from './pages/Common/Help';

// Protected Route Component
const ProtectedRoute: React.FC<{
  children: React.ReactNode;
  allowedRoles?: string[];
}> = ({ children, allowedRoles }) => {
  const { currentUser } = useApp();

  if (!currentUser) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(currentUser.role)) {
    return <Navigate to="/dashboard" replace />;
  }

  return <>{children}</>;
};

// Dashboard Router Component
const DashboardRouter: React.FC = () => {
  const { currentUser } = useApp();

  if (!currentUser) {
    return <Navigate to="/login" replace />;
  }

  switch (currentUser.role) {
    case 'admin':
      return <AdminDashboard />;
    case 'manager':
      return <ManagerDashboard />;
    case 'employee':
      return <EmployeeDashboard />;
    default:
      return <Navigate to="/login" replace />;
  }
};

const AppRoutes: React.FC = () => {
  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />

        {/* Protected Routes */}
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <MainLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<Navigate to="/dashboard" replace />} />
          <Route path="dashboard" element={<DashboardRouter />} />

          {/* Employee Routes */}
          <Route
            path="expenses/submit"
            element={
              <ProtectedRoute allowedRoles={['employee']}>
                <SubmitExpense />
              </ProtectedRoute>
            }
          />
          <Route
            path="expenses"
            element={
              <ProtectedRoute allowedRoles={['employee']}>
                <MyExpenses />
              </ProtectedRoute>
            }
          />

          {/* Manager Routes */}
          <Route
            path="approvals"
            element={
              <ProtectedRoute allowedRoles={['manager', 'admin']}>
                <PendingApprovals />
              </ProtectedRoute>
            }
          />
          <Route
            path="team-expenses"
            element={
              <ProtectedRoute allowedRoles={['manager']}>
                <MyExpenses />
              </ProtectedRoute>
            }
          />

          {/* Admin Routes */}
          <Route
            path="all-expenses"
            element={
              <ProtectedRoute allowedRoles={['admin']}>
                <MyExpenses />
              </ProtectedRoute>
            }
          />
          <Route
            path="users"
            element={
              <ProtectedRoute allowedRoles={['admin']}>
                <UserManagement />
              </ProtectedRoute>
            }
          />
          <Route
            path="approval-rules"
            element={
              <ProtectedRoute allowedRoles={['admin']}>
                <ApprovalRules />
              </ProtectedRoute>
            }
          />

          {/* Common Routes */}
          <Route path="profile" element={<Profile />} />
          <Route path="notifications" element={<Notifications />} />
          <Route path="help" element={<Help />} />
          <Route path="settings" element={<Profile />} />
        </Route>

        {/* Catch All */}
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </Router>
  );
};

const App: React.FC = () => {
  return (
    <AppProvider>
      <AppRoutes />
    </AppProvider>
  );
};

export default App;

