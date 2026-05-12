import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

const api = axios.create({
  baseURL: API_URL,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error("Erro na API:", error.response?.data || error.message);
    if (error.response && error.response.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export const authService = {
  login: (username, password) => {
    const formData = new URLSearchParams();
    formData.append('username', username);
    formData.append('password', password);
    return api.post('/auth/login', formData, {
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
    });
  },
  register: (data) => api.post('/auth/register', data),
  acceptLgpd: () => api.post('/auth/lgpd', { accepted: true }),
};

export const adminService = {
  getDashboard: () => api.get('/admin/dashboard'),
  getEnvironments: () => api.get('/admin/environments'),
  createEnvironment: (data) => api.post('/admin/environments', data),
  getDevices: () => api.get('/admin/devices'),
  createDevice: (data) => api.post('/admin/devices', data),
  getReportsSummary: () => api.get('/admin/reports/summary'),
  getAuditLogs: () => api.get('/admin/audit'),
  getExportUrl: () => `${API_URL}/admin/reports/export`,
};

export const pwaService = {
  getDashboard: () => api.get('/pwa/dashboard'),
  getEnvironmentDetail: (id) => api.get(`/pwa/environment/${id}`),
  getAlerts: () => api.get('/pwa/alerts'),
  getPreferences: () => api.get('/pwa/preferences'),
  updatePreferences: (data) => api.post('/pwa/preferences', data),
};

export default api;
