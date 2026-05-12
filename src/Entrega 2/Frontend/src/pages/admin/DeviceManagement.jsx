import React, { useState, useEffect } from 'react';
import { Plus, Edit, Trash, Wifi } from 'lucide-react';
import { adminService } from '../../services/api';

const DeviceManagement = () => {
  const [devices, setDevices] = useState([]);
  const [environments, setEnvironments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({ device_id: '', name: '', environment_id: '', type: 'sensor' });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [devRes, envRes] = await Promise.all([
        adminService.getDevices(),
        adminService.getEnvironments()
      ]);
      setDevices(devRes.data || []);
      setEnvironments(envRes.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      await adminService.createDevice({
        ...formData,
        environment_id: formData.environment_id ? parseInt(formData.environment_id) : null
      });
      setShowModal(false);
      setFormData({ device_id: '', name: '', environment_id: '', type: 'sensor' });
      fetchData();
    } catch (err) {
      alert('Erro ao criar dispositivo');
    }
  };

  return (
    <div className="admin-page animate-fade-in">
      <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1>Gestão de Dispositivos (IoT)</h1>
          <p>Configuração de sensores e integração MQTT</p>
        </div>
        <button className="btn-primary" onClick={() => setShowModal(true)} style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
          <Plus size={18} /> Novo Dispositivo
        </button>
      </div>

      <div className="glass-panel" style={{ padding: '24px' }}>
        {loading ? <div className="loading">Carregando...</div> : (
          <div className="table-container">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Device ID (MQTT)</th>
                  <th>Nome</th>
                  <th>Ambiente</th>
                  <th>Status</th>
                  <th>Última Conexão</th>
                </tr>
              </thead>
              <tbody>
                {devices.map(dev => (
                  <tr key={dev.id}>
                    <td style={{ fontFamily: 'monospace', color: 'var(--accent-color)' }}>{dev.device_id}</td>
                    <td style={{ fontWeight: 500 }}>{dev.name}</td>
                    <td>{dev.environments?.name || '-'}</td>
                    <td>
                      <span className={`badge ${dev.status === 'online' ? 'badge-success' : 'badge-danger'}`}>
                        {dev.status}
                      </span>
                    </td>
                    <td>{dev.last_seen ? new Date(dev.last_seen).toLocaleString() : 'Nunca'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {showModal && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
          <div className="glass-panel" style={{ padding: '30px', width: '100%', maxWidth: '400px' }}>
            <h2 style={{ marginBottom: '20px', display: 'flex', gap: '8px', alignItems: 'center' }}><Wifi size={20} /> Novo Dispositivo</h2>
            <form onSubmit={handleCreate} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div className="form-group">
                <label>Device ID (Tópico MQTT)</label>
                <input required className="input-base" placeholder="Ex: esp32_sensor_01" value={formData.device_id} onChange={e => setFormData({...formData, device_id: e.target.value})} />
              </div>
              <div className="form-group">
                <label>Nome Amigável</label>
                <input required className="input-base" placeholder="Ex: Sensor Sala de Reuniões" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
              </div>
              <div className="form-group">
                <label>Ambiente Vinculado</label>
                <select className="input-base" style={{ background: 'var(--bg-primary)' }} value={formData.environment_id} onChange={e => setFormData({...formData, environment_id: e.target.value})}>
                  <option value="">Selecione um ambiente...</option>
                  {environments.map(env => (
                    <option key={env.id} value={env.id}>{env.name}</option>
                  ))}
                </select>
              </div>
              <div style={{ display: 'flex', gap: '12px', marginTop: '10px' }}>
                <button type="button" className="btn-secondary" style={{ flex: 1 }} onClick={() => setShowModal(false)}>Cancelar</button>
                <button type="submit" className="btn-primary" style={{ flex: 1 }}>Salvar</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default DeviceManagement;
