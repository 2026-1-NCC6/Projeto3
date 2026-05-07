import React from 'react';
import { Bell, Search, User } from 'lucide-react';
import ThemeToggle from '../ui/ThemeToggle';
import './Topbar.css';

const Topbar = () => {
  return (
    <header className="topbar-container">
      <div className="topbar-search">
        <Search size={20} className="search-icon" />
        <input type="text" placeholder="Buscar módulos, unidades ou dispositivos..." />
      </div>
      
      <div className="topbar-actions">
        <ThemeToggle />
        
        <button className="icon-btn relative">
          <Bell size={20} />
          <span className="notification-dot"></span>
        </button>
        
        <div className="user-profile">
          <div className="avatar">
            <User size={20} />
          </div>
          <div className="user-info">
            <span className="user-name">Adminstrador</span>
            <span className="user-role">Super Admin</span>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Topbar;
