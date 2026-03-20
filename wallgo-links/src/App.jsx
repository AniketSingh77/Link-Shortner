import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

import { ThemeProvider } from './context/ThemeContext';
import LandingPage from './pages/LandingPage';
import Dashboard from './pages/Dashboard';
import ManageLinks from './pages/ManageLinks';
import Withdraw from './pages/Withdraw';
import Profile from './pages/Profile';
import TrafficSource from './pages/TrafficSource';
import Refer from './pages/Refer';
import StaticPage from './pages/StaticPage';
import PayoutRates from './pages/PayoutRates';
import RedirectPage from './pages/RedirectPage';
import ContactUs from './pages/ContactUs';

import Login from './pages/Auth/Login';
import Register from './pages/Auth/Register';

import AdminDashboard from './pages/Admin/AdminDashboard';

import {
  ApiDocumentation,
  QuickLink,
  BulkShortener,
  FullPageScript
} from './pages/DeveloperTools';

const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem('token');
  if (!token) return <Navigate to="/login" replace />;
  return children;
};

const AdminRoute = ({ children }) => {
  const token = localStorage.getItem('token');
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  if (!token || user.role !== 'Admin') return <Navigate to="/dashboard" replace />;
  return children;
};

function App() {
  return (
    <ThemeProvider>
      <BrowserRouter>
        <Routes>
          {/* Public */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/v" element={<RedirectPage />} />
          <Route path="/v/:alias" element={<RedirectPage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/payout-rates" element={<PayoutRates />} />
          <Route path="/pages/:slug" element={<StaticPage />} />
          <Route path="/contact" element={<ContactUs />} />
  
          {/* User Dashboard */}
          <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
          <Route path="/dashboard/links" element={<ProtectedRoute><ManageLinks /></ProtectedRoute>} />
          <Route path="/dashboard/links/hidden" element={<ProtectedRoute><ManageLinks hideOnly={true} /></ProtectedRoute>} />
          <Route path="/dashboard/withdraw" element={<ProtectedRoute><Withdraw /></ProtectedRoute>} />
          <Route path="/dashboard/billing" element={<ProtectedRoute><Withdraw /></ProtectedRoute>} />
          <Route path="/dashboard/traffic" element={<ProtectedRoute><TrafficSource /></ProtectedRoute>} />
          <Route path="/dashboard/refer" element={<ProtectedRoute><Refer /></ProtectedRoute>} />
  
          {/* Settings */}
          <Route path="/dashboard/settings" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
          <Route path="/dashboard/settings/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
  
          {/* Developer Tools */}
          <Route path="/dashboard/tools/quick" element={<ProtectedRoute><QuickLink /></ProtectedRoute>} />
          <Route path="/dashboard/tools/bulk" element={<ProtectedRoute><BulkShortener /></ProtectedRoute>} />
          <Route path="/dashboard/tools/script" element={<ProtectedRoute><FullPageScript /></ProtectedRoute>} />
          <Route path="/dashboard/tools/api" element={<ProtectedRoute><ApiDocumentation /></ProtectedRoute>} />
  
          {/* Admin */}
          <Route path="/admin" element={<AdminRoute><AdminDashboard /></AdminRoute>} />
          <Route path="/admin/*" element={<AdminRoute><AdminDashboard /></AdminRoute>} />
  
          {/* Fallback */}
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;
