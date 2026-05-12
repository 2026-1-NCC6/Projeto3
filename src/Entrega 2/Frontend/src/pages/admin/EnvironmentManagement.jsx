import React, { useState, useEffect } from 'react';
import { Plus, Edit, Trash, Check, X } from 'lucide-react';
import { adminService } from '../../services/api';

const EnvironmentManagement = () => {
  const [environments, setEnvironments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({ name: '', location: '', active: true });

  useEffect(() => {
    fetchEnvironments();
  }, []);

  const fetchEnvironments = async () => {
    setLoading(true);
    try {
      const res = await adminService.getEnvironments();
      setEnvironments(res.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      await adminService.createEnvironment(formData);
      setShowModal(false);
      setFormData({ name: '', location: '', active: true });
      fetchEnvironments();
    } catch (err) {
      alert('Erro ao criar ambiente');
    }
  };

  return (
    <div className="admin-page animate-fade-in">
      <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1>Gestão de Ambientes</h1>
          <p>Cadastre e gerencie locais monitorados</p>
        </div>
        <button className="btn-primary" onClick={() => setShowModal(true)} style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
          <Plus size={18} /> Novo Ambiente
        </button>
      </div>

      <div className="glass-panel" style={{ padding: '24px' }}>
        {loading ? <div className="loading">Carregando...</div> : (
          <div className="table-container">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Nome</th>
                  <th>Localização</th>
                  <th>Status</th>
                  <th>Ações</th>
                </tr>
              </thead>
              <tbody>
                {environments.map(env => (
                  <tr key={env.id}>
                    <td>{env.id}</td>
                    <td style={{ fontWeight: 500 }}>{env.name}</td>
                    <td>{env.location || '-'}</td>
                    <td>
                      <span className={`badge ${env.active ? 'badge-success' : 'badge-neutral'}`}>
                        {env.active ? 'Ativo' : 'Inativo'}
                      </span>
                    </td>
                    <td>
                      <div style={{ display: 'flex', gap: '8px' }}>
                        <button className="btn-secondary" style={{ padding: '6px', borderRadius: '4px' }}><Edit size={16} /></button>
                        <button className="btn-secondary" style={{ padding: '6px', borderRadius: '4px', color: 'var(--danger)', borderColor: 'var(--danger)' }}><Trash size={16} /></button>
                      </div>
                    </td>
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
            <h2 style={{ marginBottom: '20px' }}>Novo Ambiente</h2>
            <form onSubmit={handleCreate} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div className="form-group">
                <label>Nome do Ambiente</label>
                <input required className="input-base" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
              </div>
              <div className="form-group">
                <label>Localização (Opcional)</label>
                <input className="input-base" value={formData.location} onChange={e => setFormData({...formData, location: e.target.value})} />
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

export default EnvironmentManagement;
