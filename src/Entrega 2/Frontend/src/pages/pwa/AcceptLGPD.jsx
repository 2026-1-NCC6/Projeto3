import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authService } from '../../services/api';
import './Login.css'; // Podemos reaproveitar estilos básicos do login

const AcceptLGPD = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleAccept = async () => {
    setLoading(true);
    try {
      await authService.acceptLgpd();
      
      // Update local storage user
      const user = JSON.parse(localStorage.getItem('user'));
      user.lgpd_accepted = true;
      localStorage.setItem('user', JSON.stringify(user));
      
      // Redirect based on role
      if (user.role === 'admin' || user.role === 'tecnico') {
        navigate('/admin');
      } else {
        navigate('/dashboard');
      }
    } catch (err) {
      setError('Erro ao confirmar consentimento. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  const handleDecline = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  return (
    <div className="login-container">
      <div className="login-glass animate-fade-in" style={{maxWidth: '500px'}}>
        <div className="login-header">
          <h2>Termos de Privacidade e LGPD</h2>
          <p>Sua privacidade é importante para nós</p>
        </div>

        {error && <div className="alert-error">{error}</div>}

        <div style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '24px', lineHeight: '1.6' }}>
          <p>Para continuar utilizando o Energy Monitor, você precisa consentir com a coleta e o processamento dos seus dados básicos (Nome e E-mail), bem como com os dados de consumo de energia atrelados ao seu dispositivo de monitoramento IoT.</p>
          <br/>
          <p>Garantimos que seus dados serão usados exclusivamente para a prestação do serviço e não serão compartilhados com terceiros.</p>
        </div>

        <div style={{ display: 'flex', gap: '12px', marginTop: '20px' }}>
          <button onClick={handleDecline} className="btn-secondary" style={{ flex: 1 }} disabled={loading}>
            Recusar
          </button>
          <button onClick={handleAccept} className="btn-primary" style={{ flex: 1 }} disabled={loading}>
            {loading ? 'Aguarde...' : 'Concordar e Continuar'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AcceptLGPD;
