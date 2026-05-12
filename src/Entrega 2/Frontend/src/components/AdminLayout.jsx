import React from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { LayoutDashboard, Server, Cpu, FileText, Shield, LogOut } from 'lucide-react';
import './AdminLayout.css';

const Sidebar = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  return (
    <aside className="admin-sidebar">
      <div className="sidebar-header">
        <h2 style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--accent-color)' }}>Energy Admin</h2>
      </div>
      
      <nav className="sidebar-nav">
        <NavLink to="/admin" end className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}>
          <LayoutDashboard size={20} /> Dashboard
        </NavLink>
        <NavLink to="/admin/environments" className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}>
          <Server size={20} /> Ambientes
        </NavLink>
        <NavLink to="/admin/devices" className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}>
          <Cpu size={20} /> Dispositivos
        </NavLink>
        <NavLink to="/admin/reports" className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}>
          <FileText size={20} /> Relatórios
        </NavLink>
        <NavLink to="/admin/audit" className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}>
          <Shield size={20} /> Auditoria (Logs)
        </NavLink>
      </nav>

      <div className="sidebar-footer">
        <button onClick={handleLogout} className="logout-btn">
          <LogOut size={20} /> Sair
        </button>
      </div>
    </aside>
  );
};

const AdminLayout = ({ children }) => {
  return (
    <div className="admin-layout-container">
      <Sidebar />
      <main className="admin-main">
        {children || <Outlet />}
      </main>
    </div>
  );
};

export default AdminLayout;
