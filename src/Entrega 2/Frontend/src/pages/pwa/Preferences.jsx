import React, { useState, useEffect } from 'react';
import { Save, Settings, User } from 'lucide-react';
import { pwaService } from '../../services/api';
import { useNavigate } from 'react-router-dom';

const Preferences = () => {
  const [units, setUnits] = useState('celsius');
  const [interval, setInterval] = useState(5);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    pwaService.getPreferences().then(res => {
      if (res.data) {
        setUnits(res.data.units || 'celsius');
        setInterval(res.data.update_interval || 5);
      }
    });
  }, []);

  const handleSave = async () => {
    setLoading(true);
    try {
      await pwaService.updatePreferences({ units, update_interval: interval });
      alert('Preferências salvas!');
    } catch (err) {
      alert('Erro ao salvar');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  const user = JSON.parse(localStorage.getItem('user') || '{}');

  return (
    <div className="pwa-page animate-fade-in">
      <div className="page-header">
        <h1>Configurações</h1>
        <p>Ajuste suas preferências</p>
      </div>

      <div className="glass-panel" style={{ padding: '20px', marginBottom: '24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '20px' }}>
          <div style={{ background: 'rgba(255,255,255,0.1)', padding: '16px', borderRadius: '50%' }}>
            <User size={32} />
          </div>
          <div>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 600 }}>{user.name}</h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>{user.email}</p>
          </div>
        </div>
        <button onClick={handleLogout} className="btn-secondary w-full" style={{ borderColor: 'var(--danger)', color: 'var(--danger)' }}>
          Sair da Conta
        </button>
      </div>

      <div className="glass-panel" style={{ padding: '20px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px' }}>
          <Settings size={20} color="var(--accent-color)" />
          <h3 style={{ fontSize: '1.1rem', fontWeight: 600 }}>Preferências de Exibição</h3>
        </div>

        <div className="form-group" style={{ marginBottom: '20px' }}>
          <label>Unidade de Temperatura</label>
          <select 
            className="input-base" 
            value={units} 
            onChange={(e) => setUnits(e.target.value)}
            style={{ backgroundColor: 'var(--bg-primary)' }}
          >
            <option value="celsius">Celsius (°C)</option>
            <option value="fahrenheit">Fahrenheit (°F)</option>
          </select>
        </div>

        <div className="form-group" style={{ marginBottom: '24px' }}>
          <label>Intervalo de Atualização (minutos)</label>
          <input 
            type="number" 
            className="input-base" 
            value={interval} 
            onChange={(e) => setInterval(parseInt(e.target.value))}
            min="1"
            max="60"
          />
        </div>

        <button onClick={handleSave} className="btn-primary w-full" disabled={loading} style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px' }}>
          <Save size={18} />
          {loading ? 'Salvando...' : 'Salvar Preferências'}
        </button>
      </div>
    </div>
  );
};

export default Preferences;
