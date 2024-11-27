import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:4000/api', // URL base del backend
});

// Interceptores para manejar tokens automáticamente
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token'); // Obtener token del almacenamiento local
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;