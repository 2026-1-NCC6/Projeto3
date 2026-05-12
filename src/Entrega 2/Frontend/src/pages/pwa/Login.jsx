import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authService } from '../../services/api';
import './Login.css';

const Login = () => {
  const [isRegister, setIsRegister] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (isRegister) {
        const res = await authService.register({ email, password, name });
        localStorage.setItem('token', res.data.access_token);
        localStorage.setItem('user', JSON.stringify(res.data.user));
        
        // Pós registro: precisa de LGPD
        navigate('/lgpd');
      } else {
        const res = await authService.login(email, password);
        localStorage.setItem('token', res.data.access_token);
        localStorage.setItem('user', JSON.stringify(res.data.user));
        
        if (!res.data.user.lgpd_accepted) {
          navigate('/lgpd');
        } else {
          // Check role
          if (res.data.user.role === 'admin' || res.data.user.role === 'tecnico') {
             navigate('/admin');
          } else {
             navigate('/dashboard');
          }
        }
      }
    } catch (err) {
      setError(err.response?.data?.detail || 'Ocorreu um erro');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-glass animate-fade-in">
        <div className="login-header">
          <h2>Energy Monitor</h2>
          <p>{isRegister ? 'Crie sua conta' : 'Acesse a plataforma'}</p>
        </div>
        
        {error && <div className="alert-error">{error}</div>}

        <form onSubmit={handleSubmit} className="login-form">
          {isRegister && (
            <div className="form-group">
              <label>Nome Completo</label>
              <input 
                type="text" 
                className="input-base" 
                value={name} 
                onChange={e => setName(e.target.value)} 
                required 
              />
            </div>
          )}
          <div className="form-group">
            <label>Email</label>
            <input 
              type="email" 
              className="input-base" 
              value={email} 
              onChange={e => setEmail(e.target.value)} 
              required 
            />
          </div>
          <div className="form-group">
            <label>Senha</label>
            <input 
              type="password" 
              className="input-base" 
              value={password} 
              onChange={e => setPassword(e.target.value)} 
              required 
            />
          </div>

          <button type="submit" className="btn-primary w-full" disabled={loading}>
            {loading ? 'Carregando...' : (isRegister ? 'Cadastrar' : 'Entrar')}
          </button>
        </form>

        <div className="login-footer">
          <button className="text-btn" onClick={() => setIsRegister(!isRegister)}>
            {isRegister ? 'Já tenho conta, quero entrar' : 'Não tenho conta, quero me cadastrar'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Login;
