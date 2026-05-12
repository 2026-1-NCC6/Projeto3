import React, { useState, useEffect } from 'react';
import { Shield } from 'lucide-react';
import { adminService } from '../../services/api';

const AuditLogs = () => {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    adminService.getAuditLogs().then(res => {
      setLogs(res.data || []);
      setLoading(false);
    });
  }, []);

  return (
    <div className="admin-page animate-fade-in">
      <div className="page-header">
        <h1>Auditoria e Logs</h1>
        <p>Histórico de eventos de segurança e alterações do sistema</p>
      </div>

      <div className="glass-panel" style={{ padding: '24px' }}>
        <h3 style={{ marginBottom: '20px', display: 'flex', gap: '8px', alignItems: 'center' }}>
          <Shield size={20} color="var(--success)" />
          Logs Recentes
        </h3>

        {loading ? <div className="loading">Carregando logs...</div> : (
          <div className="table-container">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Data/Hora</th>
                  <th>Ação</th>
                  <th>Usuário</th>
                  <th>Detalhes</th>
                </tr>
              </thead>
              <tbody>
                {logs.length === 0 ? (
                  <tr>
                    <td colSpan="4" style={{ textAlign: 'center' }}>Nenhum log registrado.</td>
                  </tr>
                ) : logs.map(log => (
                  <tr key={log.id}>
                    <td>{new Date(log.timestamp).toLocaleString()}</td>
                    <td><span className="badge badge-neutral">{log.action}</span></td>
                    <td>{log.users ? log.users.email : 'Sistema'}</td>
                    <td>{log.details || '-'}</td>
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

export default AuditLogs;
