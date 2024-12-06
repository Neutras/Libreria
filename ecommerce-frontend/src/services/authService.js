import axios from 'axios';

const API_URL = 'http://localhost:4000/api/users';

class AuthService {
  // Login
  async login(credentials) {
    try {
      const response = await axios.post(`${API_URL}/login`, credentials);
      this.setToken(response.data.token);
      return true;
    } catch (error) {
      console.error('Error en login:', error.response?.data || error.message);
      return false;
    }
  }

  // Registro
  async register(userData) {
    try {
      const response = await axios.post(`${API_URL}/register`, userData);
      this.setToken(response.data.token);
      return true;
    } catch (error) {
      console.error('Error en register:', error.response?.data || error.message);
      return false;
    }
  }

  // Obtener puntos del usuario autenticado
  async getUserPoints() {
    try {
      const token = this.getToken();
      const response = await axios.get("http://localhost:4000/api/users/points", {
        headers: { Authorization: `Bearer ${token}` },
      });
      return response.data;  // { points: number }
    } catch (error) {
      console.error("Error al obtener los puntos del usuario", error);
      throw error;
    }
  }

  // Obtener datos del usuario desde el token
  getUserData() {
    const token = this.getToken();
    const decoded = this.parseJwt(token);
    return decoded ? { email: decoded.email, name: decoded.name } : null;
  }

  setToken(token) {
    localStorage.setItem('token', token);
  }

  getToken() {
    return localStorage.getItem('token');
  }

  parseJwt(token) {
    try {
      const base64Url = token.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(
        atob(base64)
          .split('')
          .map((c) => `%${('00' + c.charCodeAt(0).toString(16)).slice(-2)}`)
          .join('')
      );
      return JSON.parse(jsonPayload);
    } catch (error) {
      console.error('Error al decodificar el token:', error);
      return null;
    }
  }

  isAuthenticated() {
    const token = this.getToken();
    if (!token) return false;

    const decoded = this.parseJwt(token);
    if (!decoded || decoded.exp * 1000 < Date.now()) {
      this.logout();
      return false;
    }
    return true;
  }

  getUserRole() {
    const token = this.getToken();
    const decoded = this.parseJwt(token);
    return decoded ? decoded.role : null;
  }

  logout() {
    localStorage.removeItem('token');
  }
}

const authService = new AuthService();

export default authService;