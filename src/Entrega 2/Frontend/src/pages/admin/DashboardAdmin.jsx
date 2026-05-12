import React, { useState, useEffect } from 'react';
import { Activity, AlertTriangle, Cpu } from 'lucide-react';
import { adminService } from '../../services/api';
import './Admin.css'; // Shared admin styles

const DashboardAdmin = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    adminService.getDashboard()
      .then(res => {
        setData(res.data);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  if (loading) return <div className="loading">Carregando...</div>;

  return (
    <div className="admin-page animate-fade-in">
      <div className="page-header">
        <h1>Dashboard Administrativo</h1>
        <p>Visão geral do sistema IoT</p>
      </div>

      <div className="admin-grid">
        <div className="glass-panel stat-card">
          <div className="stat-icon" style={{ background: 'rgba(59, 130, 246, 0.1)', color: 'var(--accent-color)' }}>
            <Activity size={24} />
          </div>
          <div>
            <h3>Ambientes</h3>
            <p className="stat-value">{data?.environments || 0}</p>
          </div>
        </div>

        <div className="glass-panel stat-card">
          <div className="stat-icon" style={{ background: 'rgba(16, 185, 129, 0.1)', color: 'var(--success)' }}>
            <Cpu size={24} />
          </div>
          <div>
            <h3>Dispositivos Ativos</h3>
            <p className="stat-value">{data?.devices || 0}</p>
          </div>
        </div>

        <div className="glass-panel stat-card">
          <div className="stat-icon" style={{ background: 'rgba(239, 68, 68, 0.1)', color: 'var(--danger)' }}>
            <AlertTriangle size={24} />
          </div>
          <div>
            <h3>Alertas Pendentes</h3>
            <p className="stat-value">{data?.active_alerts || 0}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardAdmin;
