import axios from 'axios';

const API_URL = 'http://localhost:4000/api';

class AdminService {
  constructor() {
    this.apiClient = axios.create({
      baseURL: API_URL,
    });
  }

  // Obtener encabezados de autenticación
  getAuthHeaders() {
    const token = localStorage.getItem('token');
    return token ? { Authorization: `Bearer ${token}` } : {};
  }

  // Usuarios
  async getUserList() {
    try {
      const response = await this.apiClient.get('/users/all', {
        headers: this.getAuthHeaders(),
      });
      return response.data.users;
    } catch (error) {
      console.error('Error al obtener usuarios:', error.response?.data || error.message);
      throw error;
    }
  }

  async updateUser(userId, userData) {
    try {
      const response = await this.apiClient.patch(`/users/${userId}`, userData, {
        headers: this.getAuthHeaders(),
      });
      return response.data;
    } catch (error) {
      console.error('Error al actualizar usuario:', error.response?.data || error.message);
      throw error;
    }
  }

  async deleteUser(userId) {
    try {
      const response = await this.apiClient.delete(`/users/${userId}`, {
        headers: this.getAuthHeaders(),
      });
      return response.data;
    } catch (error) {
      console.error('Error al eliminar usuario:', error.response?.data || error.message);
      throw error;
    }
  }

  async getUserPoints(userId) {
    try {
      const response = await this.apiClient.get(`/users/${userId}/points`, {
        headers: this.getAuthHeaders(),
      });
      return response.data;
    } catch (error) {
      console.error('Error al obtener puntos del usuario:', error.response?.data || error.message);
      throw error;
    }
  }

  // Pedidos
  async getOrderList() {
    try {
      const response = await this.apiClient.get('/orders', {
        headers: this.getAuthHeaders(),
      });
      return response.data.orders;
    } catch (error) {
      console.error('Error al obtener pedidos:', error.response?.data || error.message);
      throw error;
    }
  }

  async updateOrderStatus(orderId, status) {
    try {
      const response = await this.apiClient.patch(
        `/orders/${orderId}`,
        { status },
        { headers: this.getAuthHeaders() }
      );
      return response.data;
    } catch (error) {
      console.error('Error al actualizar estado del pedido:', error.response?.data || error.message);
      throw error;
    }
  }

  // Productos
  async getProducts() {
    try {
      const response = await this.apiClient.get('/products', {
        headers: this.getAuthHeaders(),
      });
      return response.data.products;
    } catch (error) {
      console.error('Error al obtener productos:', error.response?.data || error.message);
      throw error;
    }
  }

  async createProduct(productData) {
    try {
      const response = await this.apiClient.post('/products', productData, {
        headers: this.getAuthHeaders(),
      });
      return response.data;
    } catch (error) {
      console.error('Error al crear producto:', error.response?.data || error.message);
      throw error;
    }
  }

  async updateProduct(productId, productData) {
    try {
      const response = await this.apiClient.patch(`/products/${productId}`, productData, {
        headers: this.getAuthHeaders(),
      });
      return response.data;
    } catch (error) {
      console.error('Error al actualizar producto:', error.response?.data || error.message);
      throw error;
    }
  }

  async deleteProduct(productId) {
    try {
      const response = await this.apiClient.delete(`/products/${productId}`, {
        headers: this.getAuthHeaders(),
      });
      return response.data;
    } catch (error) {
      console.error('Error al eliminar producto:', error.response?.data || error.message);
      throw error;
    }
  }

  // Promociones
  async getPromotions() {
    try {
      const response = await this.apiClient.get('/promotions', {
        headers: this.getAuthHeaders(),
      });
      return response.data.promotions;
    } catch (error) {
      console.error('Error al obtener promociones:', error.response?.data || error.message);
      throw error;
    }
  }

  async createPromotion(promotionData) {
    try {
      const response = await this.apiClient.post('/promotions', promotionData, {
        headers: this.getAuthHeaders(),
      });
      return response.data;
    } catch (error) {
      console.error('Error al crear promoción:', error.response?.data || error.message);
      throw error;
    }
  }

  async deletePromotion(promotionId) {
    try {
      const response = await this.apiClient.delete(`/promotions/${promotionId}`, {
        headers: this.getAuthHeaders(),
      });
      return response.data;
    } catch (error) {
      console.error('Error al eliminar promoción:', error.response?.data || error.message);
      throw error;
    }
  }

  // Métricas
  async getMetrics() {
    try {
      const response = await this.apiClient.get('/metrics', {
        headers: this.getAuthHeaders(),
      });
      return response.data;
    } catch (error) {
      console.error('Error al obtener métricas:', error.response?.data || error.message);
      throw error;
    }
  }

  // Alertas
  async getAlerts() {
    try {
      const response = await this.apiClient.get('/alerts', {
        headers: this.getAuthHeaders(),
      });
      return response.data.alerts;
    } catch (error) {
      console.error('Error al obtener alertas:', error.response?.data || error.message);
      throw error;
    }
  }

  async resolveAlert(alertId) {
    try {
      const response = await this.apiClient.patch(`/alerts/${alertId}/resolve`, {}, {
        headers: this.getAuthHeaders(),
      });
      return response.data;
    } catch (error) {
      console.error('Error al resolver alerta:', error.response?.data || error.message);
      throw error;
    }
  }
}

const adminService = new AdminService();
export default adminService;