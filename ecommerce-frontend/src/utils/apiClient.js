import axios from 'axios';

// Configurar Axios
const apiClient = axios.create({
  baseURL: 'http://localhost:4000/api', // URL base del backend
  timeout: 5000, // Tiempo de espera para las solicitudes
});

// Interceptores para manejar errores
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('[API Error]', error.response || error.message);
    return Promise.reject(error);
  }
);

export default apiClient;
