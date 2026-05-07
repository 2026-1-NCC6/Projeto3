import { Routes, Route, Navigate } from 'react-router-dom';
import AdminLayout from './components/layout/AdminLayout';

// Admin Pages
import DashboardAdmin from './pages/admin/DashboardAdmin';
import Monitoring from './pages/admin/Monitoring';
import IoTDevices from './pages/admin/IoTDevices';
import Alerts from './pages/admin/Alerts';
import Analytics from './pages/admin/Analytics';
import Reports from './pages/admin/Reports';
import Financial from './pages/admin/Financial';
import ESGPanel from './pages/admin/ESGPanel';
import UsersGestao from './pages/admin/UsersGestao';
import Companies from './pages/admin/Companies';
import Settings from './pages/admin/Settings';

// Legacy components for reference (can be removed later)
import ClientDashboard from './pages/ClientDashboard';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/admin/dashboard" />} />
      <Route path="/client-legacy" element={<ClientDashboard />} />
      
      <Route path="/admin" element={<AdminLayout />}>
        <Route index element={<Navigate to="dashboard" />} />
        <Route path="dashboard" element={<DashboardAdmin />} />
        <Route path="monitoring" element={<Monitoring />} />
        <Route path="iot" element={<IoTDevices />} />
        <Route path="alerts" element={<Alerts />} />
        <Route path="analytics" element={<Analytics />} />
        <Route path="reports" element={<Reports />} />
        <Route path="financial" element={<Financial />} />
        <Route path="esg" element={<ESGPanel />} />
        <Route path="users" element={<UsersGestao />} />
        <Route path="companies" element={<Companies />} />
        <Route path="settings" element={<Settings />} />
      </Route>
    </Routes>
  );
}

export default App;
