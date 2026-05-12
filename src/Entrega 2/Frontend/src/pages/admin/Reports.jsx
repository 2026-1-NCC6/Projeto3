import React, { useState, useEffect } from 'react';
import { Download, FileText } from 'lucide-react';
import { adminService } from '../../services/api';

const Reports = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    adminService.getReportsSummary().then(res => {
      setData(res.data.latest_readings || []);
      setLoading(false);
    });
  }, []);

  const handleExport = () => {
    window.open(adminService.getExportUrl(), '_blank');
  };

  return (
    <div className="admin-page animate-fade-in">
      <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1>Relatórios e Dados</h1>
          <p>Exportação e análise de dados brutos</p>
        </div>
        <button onClick={handleExport} className="btn-primary" style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
          <Download size={18} />
          Exportar CSV
        </button>
      </div>

      <div className="glass-panel" style={{ padding: '24px' }}>
        <h3 style={{ marginBottom: '20px', display: 'flex', gap: '8px', alignItems: 'center' }}>
          <FileText size={20} color="var(--accent-color)" />
          Últimas Leituras (Amostra)
        </h3>

        {loading ? <div className="loading">Carregando amostra...</div> : (
          <div className="table-container">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Dispositivo</th>
                  <th>Temp. (°C)</th>
                  <th>Umid. (%)</th>
                  <th>Data/Hora</th>
                </tr>
              </thead>
              <tbody>
                {data.slice(0, 15).map(row => (
                  <tr key={row.id}>
                    <td>{row.id}</td>
                    <td>{row.device_id}</td>
                    <td>{row.temperature}</td>
                    <td>{row.humidity}</td>
                    <td>{new Date(row.timestamp).toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default Reports;
