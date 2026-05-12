import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Activity, AlertTriangle, CloudOff, ChevronRight } from 'lucide-react';
import { pwaService } from '../../services/api';
import './Dashboard.css';

const Dashboard = () => {
  const [environments, setEnvironments] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchData();
    
    // WebSockets para atualizações em tempo real
    const wsUrl = (import.meta.env.VITE_API_URL || 'http://localhost:8000').replace('http', 'ws') + '/ws';
    const ws = new WebSocket(wsUrl);
    
    ws.onmessage = (event) => {
      const message = JSON.parse(event.data);
      if (message.type === 'new_reading') {
        fetchData(); // Simplest way is to refresh, or we can update state directly
      }
    };
    
    return () => ws.close();
  }, []);

  const fetchData = async () => {
    try {
      const res = await pwaService.getDashboard();
      setEnvironments(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const getStatusIcon = (devices) => {
    if (!devices || devices.length === 0) return <CloudOff size={24} color="var(--text-secondary)" />;
    
    // Check if any device is offline or in alert
    const offline = devices.some(d => d.status === 'offline');
    if (offline) return <CloudOff size={24} color="var(--danger)" />;
    
    // Simplification for prototype
    return <Activity size={24} color="var(--success)" />;
  };

  const getAverageTemp = (devices) => {
    let sum = 0;
    let count = 0;
    devices?.forEach(d => {
      if (d.readings && d.readings.length > 0) {
        sum += d.readings[d.readings.length - 1].temperature;
        count++;
      }
    });
    return count > 0 ? (sum / count).toFixed(1) + '°C' : '--';
  };

  return (
    <div className="pwa-page animate-fade-in">
      <div className="page-header">
        <h1>Meus Ambientes</h1>
        <p>Visão geral do sistema de monitoramento</p>
      </div>

      {loading ? (
        <div className="loading">Carregando...</div>
      ) : environments.length === 0 ? (
        <div className="glass-panel p-6 text-center">
          <p className="text-secondary">Nenhum ambiente configurado.</p>
        </div>
      ) : (
        <div className="env-grid">
          {environments.map(env => (
            <Link to={`/environment/${env.id}`} key={env.id} className="glass-panel env-card">
              <div className="env-card-header">
                <div>
                  <h3 style={{ fontSize: '1.2rem', fontWeight: 600 }}>{env.name}</h3>
                  <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                    {env.iot_devices?.length || 0} dispositivos
                  </p>
                </div>
                {getStatusIcon(env.iot_devices)}
              </div>
              
              <div className="env-card-footer">
                <div className="env-stat">
                  <span className="stat-label">Média Temp</span>
                  <span className="stat-value">{getAverageTemp(env.iot_devices)}</span>
                </div>
                <ChevronRight size={20} color="var(--text-secondary)" />
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export default Dashboard;
