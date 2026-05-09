import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:8080/api',
});

api.interceptors.request.use((config) => {
  const user = JSON.parse(localStorage.getItem('rhms_user'));
  if (user && user.token) {
    config.headers.Authorization = `Bearer ${user.token}`;
  }
  return config;
});

export const patientService = {
  getAll: () => api.get('/patients'),
  getById: (id) => api.get(`/patients/${id}`),
  create: (data) => api.post('/patients', data),
  update: (id, data) => api.put(`/patients/${id}`, data),
  delete: (id) => api.delete(`/patients/${id}`),
  search: (query) => api.get(`/patients/search?query=${query}`),
};

export const analyticsService = {
  getSummary: () => api.get('/analytics/summary'),
  getVillages: () => api.get('/analytics/villages'),
  getDiseases: () => api.get('/analytics/diseases'),
};

export default api;
