import { Link, useLocation } from 'react-router-dom';
import { Zap, LayoutDashboard, Building2 } from 'lucide-react';

export default function Sidebar() {
  const location = useLocation();

  return (
    <aside className="sidebar">
      <div className="sidebar-logo">
        <Zap size={28} />
        <span>Energy<span style={{color: '#fff'}}>Sense</span></span>
      </div>
      <nav className="sidebar-nav">
        <Link to="/" className={`nav-item ${location.pathname === '/' ? 'active' : ''}`}>
          <LayoutDashboard size={20} />
          Meu Consumo
        </Link>
        <Link to="/admin" className={`nav-item ${location.pathname === '/admin' ? 'active' : ''}`}>
          <Building2 size={20} />
          Área Empresa
        </Link>
      </nav>
    </aside>
  );
}
