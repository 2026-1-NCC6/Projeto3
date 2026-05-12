import React from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import { LayoutDashboard, Bell, Settings } from 'lucide-react';
import './PWALayout.css';

const Navbar = () => {
  return (
    <nav className="pwa-navbar">
      <NavLink to="/dashboard" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
        <LayoutDashboard size={24} />
        <span>Início</span>
      </NavLink>
      <NavLink to="/alerts" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
        <Bell size={24} />
        <span>Alertas</span>
      </NavLink>
      <NavLink to="/preferences" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
        <Settings size={24} />
        <span>Ajustes</span>
      </NavLink>
    </nav>
  );
};

const PWALayout = ({ children }) => {
  return (
    <div className="pwa-layout-container">
      {children || <Outlet />}
      <Navbar />
    </div>
  );
};

export default PWALayout;
