import { useEffect, useState } from 'react';
import { fetchCompanyData } from '../services/api';
import KPICard from '../components/KPICard';
import { Users, Server, AlertTriangle } from 'lucide-react';

export default function CompanyDashboard() {
  const [data, setData] = useState(null);

  useEffect(() => {
    const poll = async () => {
      try {
        const res = await fetchCompanyData();
        setData(res);
      } catch(e) {
        console.error("API error", e);
      }
    };
    poll();
    const iv = setInterval(poll, 3000);
    return () => clearInterval(iv);
  }, []);

  if (!data) return <div className="flex-center" style={{height:'100%'}}>Carregando sistema admin...</div>;

  const { clients, aggregate_consumption } = data;
  const criticalClients = clients.filter(c => c.status === 'danger').length;

  return (
    <>
      <header>
        <h2>Visão da Empresa</h2>
        <p style={{color: 'var(--text-muted)'}}>Monitoramento agregado e gestão de cargas da rede.</p>
      </header>

      <div className="grid-kpi">
        <KPICard title="Clientes Ativos" value={clients.length + 102} unit="Total" icon={Users} />
        <KPICard title="Carga Agregada" value={aggregate_consumption.toFixed(2)} unit="MWh" icon={Server} trend={2.4} />
        <KPICard title="Alertas de Pico" value={criticalClients} unit="Clientes" icon={AlertTriangle} />
      </div>

      <div className="card" style={{marginTop: '24px'}}>
        <div className="card-header">
          <div className="card-title">Clientes Monitorados</div>
        </div>
        <div className="table-wrapper">
          <table className="data-table">
            <thead>
              <tr>
                <th>Nome / Identificador</th>
                <th>Consumo (kW)</th>
                <th>Ações Preventivas</th>
                <th>Status na Rede</th>
              </tr>
            </thead>
            <tbody>
              {clients.map(client => (
                <tr key={client.id}>
                  <td style={{fontWeight: 500}}>{client.name}</td>
                  <td>{client.total_consumption.toFixed(2)} kW</td>
                  <td>
                    {client.priority_alerts > 0 ? (
                      <span style={{color: 'var(--warning)', fontWeight: 600}}>
                        {client.priority_alerts} Desligamentos
                      </span>
                    ) : (
                      <span style={{color: 'var(--text-muted)'}}>Nenhuma</span>
                    )}
                  </td>
                  <td>
                    {client.status === 'danger' ? (
                      <span className="badge badge-danger">Sobrecarga</span>
                    ) : (
                      <span className="badge badge-success">Estável</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}
