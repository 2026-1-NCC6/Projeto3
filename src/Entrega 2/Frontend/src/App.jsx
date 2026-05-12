import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

// Auth Pages
import Login from './pages/pwa/Login';
import AcceptLGPD from './pages/pwa/AcceptLGPD';

// PWA Pages
import PWALayout from './components/PWALayout';
import PWADashboard from './pages/pwa/Dashboard';
import PWAAlerts from './pages/pwa/Alerts';
import PWAPreferences from './pages/pwa/Preferences';
import EnvironmentDetail from './pages/pwa/EnvironmentDetail';

// Admin Pages
import AdminLayout from './components/AdminLayout';
import DashboardAdmin from './pages/admin/DashboardAdmin';
import EnvironmentManagement from './pages/admin/EnvironmentManagement';
import DeviceManagement from './pages/admin/DeviceManagement';
import Reports from './pages/admin/Reports';
import AuditLogs from './pages/admin/AuditLogs';

// Protected Route Component
const PrivateRoute = ({ children, requireAdmin = false }) => {
  const token = localStorage.getItem('token');
  const userStr = localStorage.getItem('user');
  
  if (!token || !userStr) return <Navigate to="/login" />;
  
  try {
    const user = JSON.parse(userStr);
    
    // Check LGPD
    if (!user.lgpd_accepted && window.location.pathname !== '/lgpd') {
      return <Navigate to="/lgpd" />;
    }
    
    // Check Admin
    if (requireAdmin && user.role !== 'admin' && user.role !== 'tecnico') {
      return <Navigate to="/dashboard" />;
    }
    
    return children;
  } catch (e) {
    return <Navigate to="/login" />;
  }
};

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Redirect root to login */}
        <Route path="/" element={<Navigate to="/login" replace />} />
        
        {/* Public Routes */}
        <Route path="/login" element={<Login />} />
        
        {/* LGPD Route (Needs Auth, but handles LGPD pending) */}
        <Route path="/lgpd" element={<AcceptLGPD />} />
        
        {/* PWA Routes (Client) */}
        <Route path="/" element={<PrivateRoute><PWALayout /></PrivateRoute>}>
          <Route path="dashboard" element={<PWADashboard />} />
          <Route path="alerts" element={<PWAAlerts />} />
          <Route path="preferences" element={<PWAPreferences />} />
        </Route>
        
        {/* Detail page without bottom navigation for more space */}
        <Route path="/environment/:id" element={<PrivateRoute><EnvironmentDetail /></PrivateRoute>} />
        
        {/* Admin Routes */}
        <Route path="/admin" element={<PrivateRoute requireAdmin={true}><AdminLayout /></PrivateRoute>}>
          <Route index element={<DashboardAdmin />} />
          <Route path="environments" element={<EnvironmentManagement />} />
          <Route path="devices" element={<DeviceManagement />} />
          <Route path="reports" element={<Reports />} />
          <Route path="audit" element={<AuditLogs />} />
        </Route>
        
        {/* Fallback */}
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
