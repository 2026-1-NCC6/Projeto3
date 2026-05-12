import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Thermometer, Droplets, Clock } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { pwaService } from '../../services/api';

const EnvironmentDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [data, setData] = useState({ environment: null, devices: [], history: [] });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await pwaService.getEnvironmentDetail(id);
        setData(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

  const formatChartData = () => {
    // Reverse to chronological order and format time
    return [...data.history].reverse().map(r => ({
      time: new Date(r.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      temp: parseFloat(r.temperature),
      hum: parseFloat(r.humidity)
    }));
  };

  const getLatestReading = () => {
    if (data.history.length > 0) return data.history[0];
    return null;
  };

  const latest = getLatestReading();

  if (loading) return <div className="pwa-page"><div className="loading">Carregando...</div></div>;
  if (!data.environment) return <div className="pwa-page">Ambiente não encontrado.</div>;

  return (
    <div className="pwa-page animate-fade-in">
      <div className="page-header" style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
        <button onClick={() => navigate(-1)} className="btn-secondary" style={{ padding: '8px 12px' }}>
          <ArrowLeft size={20} />
        </button>
        <div>
          <h1 style={{ marginBottom: 0 }}>{data.environment.name}</h1>
          <p>{data.environment.location || 'Sem localização'}</p>
        </div>
      </div>

      <div className="glass-panel" style={{ padding: '20px', marginBottom: '24px' }}>
        <h3 style={{ fontSize: '1rem', color: 'var(--text-secondary)', marginBottom: '16px' }}>Última Leitura</h3>
        
        {latest ? (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{ background: 'rgba(239, 68, 68, 0.1)', padding: '12px', borderRadius: '12px', color: 'var(--danger)' }}>
                <Thermometer size={24} />
              </div>
              <div>
                <p className="stat-label">Temperatura</p>
                <p className="stat-value">{latest.temperature}°C</p>
              </div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{ background: 'rgba(59, 130, 246, 0.1)', padding: '12px', borderRadius: '12px', color: 'var(--accent-color)' }}>
                <Droplets size={24} />
              </div>
              <div>
                <p className="stat-label">Umidade</p>
                <p className="stat-value">{latest.humidity}%</p>
              </div>
            </div>
            <div style={{ gridColumn: 'span 2', display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-secondary)', fontSize: '0.8rem', marginTop: '8px' }}>
              <Clock size={14} />
              <span>{new Date(latest.timestamp).toLocaleString()}</span>
              <span style={{ marginLeft: 'auto' }}>Dispositivo: {latest.device_id}</span>
            </div>
          </div>
        ) : (
          <p className="text-secondary">Nenhuma leitura registrada ainda.</p>
        )}
      </div>

      <div className="glass-panel" style={{ padding: '20px', height: '300px' }}>
        <h3 style={{ fontSize: '1rem', color: 'var(--text-secondary)', marginBottom: '16px' }}>Histórico (24h)</h3>
        {data.history.length > 0 ? (
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={formatChartData()}>
              <defs>
                <linearGradient id="colorTemp" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="var(--danger)" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="var(--danger)" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--glass-border)" vertical={false} />
              <XAxis dataKey="time" stroke="var(--text-secondary)" fontSize={12} tickLine={false} axisLine={false} />
              <YAxis stroke="var(--text-secondary)" fontSize={12} tickLine={false} axisLine={false} />
              <Tooltip 
                contentStyle={{ background: 'var(--bg-card)', border: '1px solid var(--glass-border)', borderRadius: '8px', color: '#fff' }}
              />
              <Area type="monotone" dataKey="temp" stroke="var(--danger)" fillOpacity={1} fill="url(#colorTemp)" />
            </AreaChart>
          </ResponsiveContainer>
        ) : (
          <p className="text-secondary text-center">Dados insuficientes</p>
        )}
      </div>
    </div>
  );
};

export default EnvironmentDetail;
