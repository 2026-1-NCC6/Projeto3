import React, { useState, useEffect } from 'react';
import { Bell, AlertTriangle, CheckCircle, Info } from 'lucide-react';
import { pwaService } from '../../services/api';

const Alerts = () => {
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAlerts = async () => {
      try {
        const res = await pwaService.getAlerts();
        setAlerts(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchAlerts();
  }, []);

  const getIcon = (type) => {
    switch(type) {
      case 'high_temperature': return <AlertTriangle color="var(--danger)" />;
      case 'offline': return <AlertTriangle color="var(--warning)" />;
      default: return <Info color="var(--accent-color)" />;
    }
  };

  return (
    <div className="pwa-page animate-fade-in">
      <div className="page-header">
        <h1>Central de Alertas</h1>
        <p>Avisos e notificações do sistema</p>
      </div>

      {loading ? (
        <div className="loading">Carregando...</div>
      ) : alerts.length === 0 ? (
        <div className="glass-panel" style={{ padding: '30px', textAlign: 'center', color: 'var(--text-secondary)' }}>
          <CheckCircle size={48} style={{ margin: '0 auto 16px', opacity: 0.5 }} />
          <p>Tudo tranquilo por aqui!</p>
          <p style={{ fontSize: '0.85rem' }}>Nenhum alerta recente.</p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {alerts.map(alert => (
            <div key={alert.id} className="glass-panel" style={{ padding: '16px', display: 'flex', gap: '16px', alignItems: 'flex-start' }}>
              <div style={{ background: 'rgba(255,255,255,0.05)', padding: '10px', borderRadius: '12px' }}>
                {getIcon(alert.type)}
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                  <h4 style={{ fontWeight: 600 }}>{alert.iot_devices?.name || alert.device_id}</h4>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                    {new Date(alert.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
                <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>{alert.message}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Alerts;
