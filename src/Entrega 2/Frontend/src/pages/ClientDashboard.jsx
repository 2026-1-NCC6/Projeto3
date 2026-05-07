import { useEffect, useState } from 'react';
import { fetchClientData } from '../services/api';
import KPICard from '../components/KPICard';
import AlertBanner from '../components/AlertBanner';
import RoomStatusList from '../components/RoomStatusList';
import { Activity, Zap, TrendingDown } from 'lucide-react';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer,
  BarChart, Bar, Cell
} from 'recharts';

export default function ClientDashboard() {
  const [data, setData] = useState(null);
  const [history, setHistory] = useState([]);

  useEffect(() => {
    const poll = async () => {
      try {
        const res = await fetchClientData();
        setData(res);
        setHistory(prev => {
          const newPoint = {
            time: new Date().toLocaleTimeString('pt-BR', {hour: '2-digit', minute:'2-digit', second:'2-digit'}),
            total: res.current_total
          };
          const next = [...prev, newPoint];
          return next.length > 20 ? next.slice(next.length - 20) : next;
        });
      } catch(e) {
        console.error("API error", e);
      }
    };
    
    poll();
    const iv = setInterval(poll, 2000); // tempo real a cada 2s
    return () => clearInterval(iv);
  }, []);

  if (!data) return <div className="flex-center" style={{height:'100%'}}>Carregando sistema...</div>;

  const { current_total, insights, actions_log, rooms_status, measurements, financials } = data;
  
  // Custom tooltip for dark mode Recharts
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div style={{ background: 'var(--bg-panel)', border: '1px solid var(--border)', padding: '12px', borderRadius: '8px' }}>
          <p style={{ margin: 0, fontWeight: 'bold' }}>{label}</p>
          <p style={{ margin: 0, color: 'var(--primary)' }}>{`Consumo: ${payload[0].value.toFixed(2)} kWh`}</p>
        </div>
      );
    }
    return null;
  };

  return (
    <>
      <header>
        <h2>Meu Consumo</h2>
        <p style={{color: 'var(--text-muted)'}}>Monitoramento em tempo real dos seus ambientes.</p>
      </header>

      {/* Insights */}
      {insights.map(i => (
        <AlertBanner key={i.id} type={i.type} title={i.type === 'success' ? 'Ótimo' : 'Atenção'} message={i.message} />
      ))}
      
      {/* Alert Actions Log */}
      {actions_log.filter(a => a.action === 'cut').slice(0,1).map((a, i) => (
        <AlertBanner key={i} type="danger" title="Corte Inteligente Ativado" message={a.message} />
      ))}

      {/* KPIs */}
      <div className="grid-kpi">
        <KPICard title="Consumo Atual" value={current_total.toFixed(2)} unit="kWh" icon={Zap} />
        <KPICard title="Est. Próxima Conta" value={financials?.estimated_bill.toFixed(2) || "0.00"} unit="R$" icon={Activity} />
        <KPICard title="Projeção Anual" value={financials?.annual_forecast.toFixed(2) || "0.00"} unit="R$" icon={TrendingDown} />
        <KPICard title="Economia (Período)" value={financials?.savings_period.toFixed(2) || "0.00"} unit="R$" icon={Activity} />
      </div>

      <div className="grid-main">
        {/* Left Column */}
        <div style={{display:'flex', flexDirection:'column', gap:'24px'}}>
          {/* Main Chart */}
          <div className="card">
            <div className="card-title" style={{marginBottom: '24px'}}>Consumo ao Longo do Tempo (Tempo Real)</div>
            <div style={{width: '100%', height: 300}}>
              <ResponsiveContainer>
                <LineChart data={history}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
                  <XAxis dataKey="time" stroke="var(--text-muted)" fontSize={12} tickLine={false} />
                  <YAxis stroke="var(--text-muted)" fontSize={12} tickLine={false} axisLine={false} />
                  <RechartsTooltip content={<CustomTooltip />} />
                  <Line 
                    type="monotone" 
                    dataKey="total" 
                    stroke="var(--primary)" 
                    strokeWidth={3} 
                    dot={false}
                    isAnimationActive={false} // Prevent jank on real-time
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
          
          {/* Bar Chart by Room */}
          <div className="card">
            <div className="card-title" style={{marginBottom: '24px'}}>Consumo por Cômodo</div>
            <div style={{width: '100%', height: 260}}>
              <ResponsiveContainer>
                <BarChart data={measurements} layout="vertical" margin={{ left: -20 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" horizontal={false} />
                  <XAxis type="number" stroke="var(--text-muted)" fontSize={12} />
                  <YAxis dataKey="room" type="category" stroke="var(--text-muted)" fontSize={12} axisLine={false} tickLine={false} />
                  <RechartsTooltip content={<CustomTooltip />} cursor={{fill: 'rgba(255,255,255,0.05)'}} />
                  <Bar dataKey="consumption" radius={[0, 4, 4, 0]}>
                    {
                      measurements.map((entry, index) => {
                        const roomCfg = rooms_status.find(r => r.name === entry.room);
                        const isOffline = roomCfg?.status === 'offline';
                        return <Cell key={`cell-${index}`} fill={isOffline ? 'var(--danger)' : 'var(--primary)'} />;
                      })
                    }
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Right Column */}
        <div style={{display:'flex', flexDirection:'column', gap:'24px'}}>
          <div className="card" style={{flex: 1}}>
            <div className="card-title" style={{marginBottom: '24px'}}>Status dos Dispositivos</div>
            <RoomStatusList rooms={rooms_status} />
          </div>
        </div>
      </div>
    </>
  );
}
