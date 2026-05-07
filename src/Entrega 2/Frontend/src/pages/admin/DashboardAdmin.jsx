import React, { useState, useEffect } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Activity, AlertTriangle, Cpu, DollarSign, Leaf, Zap } from 'lucide-react';
import Card from '../../components/ui/Card';
import Badge from '../../components/ui/Badge';
import './DashboardAdmin.css';

const DashboardAdmin = () => {
  const [data, setData] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('http://localhost:8000/api/admin/dashboard');
        const result = await response.json();
        setData(result);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      }
    };

    fetchData();
    const interval = setInterval(fetchData, 2000);
    return () => clearInterval(interval);
  }, []);

  if (!data) {
    return <div className="loading-state">Carregando dados do dashboard...</div>;
  }

  const formatTime = (isoString) => {
    const date = new Date(isoString);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
  };

  const chartData = data.history.map(item => ({
    time: formatTime(item.timestamp),
    consumo: item.consumption,
    voltagem: item.voltage,
  }));

  return (
    <div className="dashboard-admin">
      <div className="header-actions">
        <h1 className="page-title">Dashboard Executivo</h1>
        <div className="live-badge">
          <span className="pulse-dot"></span> Ao Vivo
        </div>
      </div>

      <div className="dashboard-grid">
        {/* KPIs */}
        <div className="col-span-12 kpi-grid">
          <Card className="kpi-card">
            <div className="kpi-icon-wrapper info">
              <Zap size={24} />
            </div>
            <div className="kpi-details">
              <span className="kpi-label">Consumo Total (kWh)</span>
              <span className="kpi-value">{data.kpis.current_consumption}</span>
            </div>
          </Card>
          
          <Card className="kpi-card">
            <div className="kpi-icon-wrapper success">
              <DollarSign size={24} />
            </div>
            <div className="kpi-details">
              <span className="kpi-label">Custo Estimado (R$)</span>
              <span className="kpi-value">R$ {data.kpis.estimated_cost}</span>
            </div>
          </Card>

          <Card className="kpi-card">
            <div className="kpi-icon-wrapper warning">
              <AlertTriangle size={24} />
            </div>
            <div className="kpi-details">
              <span className="kpi-label">Alertas Ativos</span>
              <span className="kpi-value">{data.kpis.active_alerts}</span>
            </div>
          </Card>

          <Card className="kpi-card">
            <div className="kpi-icon-wrapper primary">
              <Cpu size={24} />
            </div>
            <div className="kpi-details">
              <span className="kpi-label">Dispositivos IoT Online</span>
              <span className="kpi-value">{data.kpis.devices_online}</span>
            </div>
          </Card>
        </div>

        {/* Gráfico Principal */}
        <div className="col-span-8">
          <Card>
            <div className="card-header">
              <h2>Consumo em Tempo Real</h2>
            </div>
            <div className="chart-container">
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={chartData}>
                  <defs>
                    <linearGradient id="colorConsumo" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="var(--color-primary)" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="var(--color-primary)" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="time" minTickGap={30} />
                  <YAxis />
                  <Tooltip />
                  <Area type="monotone" dataKey="consumo" stroke="var(--color-primary)" fillOpacity={1} fill="url(#colorConsumo)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </div>

        {/* Status das Unidades */}
        <div className="col-span-4">
          <Card>
            <div className="card-header">
              <h2>Status dos Setores</h2>
            </div>
            <div className="rooms-list">
              {data.rooms_status.map((room, idx) => (
                <div key={idx} className="room-item">
                  <div className="room-info">
                    <strong>{room.name}</strong>
                    <span className="room-priority">Prioridade: {room.priority}</span>
                  </div>
                  <Badge variant={room.status === 'offline' ? 'danger' : 'success'}>
                    {room.status === 'offline' ? 'Offline' : 'Operacional'}
                  </Badge>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default DashboardAdmin;
