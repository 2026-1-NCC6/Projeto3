import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Activity, 
  Cpu, 
  Users, 
  AlertTriangle, 
  BarChart3, 
  FileText, 
  Building2, 
  DollarSign, 
  Leaf, 
  Settings 
} from 'lucide-react';
import './Sidebar.css';

const navItems = [
  { path: '/admin/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { path: '/admin/monitoring', icon: Activity, label: 'Monitoramento' },
  { path: '/admin/iot', icon: Cpu, label: 'Dispositivos IoT' },
  { path: '/admin/alerts', icon: AlertTriangle, label: 'Alertas e Incidentes' },
  { path: '/admin/analytics', icon: BarChart3, label: 'Analítico & IA' },
  { path: '/admin/reports', icon: FileText, label: 'Relatórios' },
  { path: '/admin/financial', icon: DollarSign, label: 'Financeiro' },
  { path: '/admin/esg', icon: Leaf, label: 'ESG & Sustentabilidade' },
  { path: '/admin/users', icon: Users, label: 'Gestão de Usuários' },
  { path: '/admin/companies', icon: Building2, label: 'Multiempresa' },
  { path: '/admin/settings', icon: Settings, label: 'Configurações' },
];

const Sidebar = () => {
  return (
    <aside className="sidebar-container">
      <div className="sidebar-header">
        <div className="logo-icon">
          <Activity size={24} color="var(--color-primary)" />
        </div>
        <span className="logo-text">EnergyMonitor</span>
      </div>
      
      <nav className="sidebar-nav">
        <ul>
          {navItems.map((item) => (
            <li key={item.path}>
              <NavLink 
                to={item.path} 
                className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}
              >
                <item.icon size={20} className="nav-icon" />
                <span className="nav-label">{item.label}</span>
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>
      
      <div className="sidebar-footer">
        <div className="system-status">
          <span className="status-dot online"></span>
          <span className="status-text">Sistema Online</span>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
