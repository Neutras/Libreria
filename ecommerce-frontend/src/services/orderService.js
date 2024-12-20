import axios from 'axios';

const API_URL = 'https://libreria-1-6ifo.onrender.com/api/orders';

class OrderService {
  // Obtener los pedidos del usuario autenticado
  async getUserOrders() {
    try {
      const token = localStorage.getItem('token');
      if (!token) throw new Error("No token found");

      const response = await axios.get(API_URL, {
        headers: { Authorization: `Bearer ${token}` },
      });

      return response.data.orders;  // Suponemos que la respuesta contiene un array de orders
    } catch (error) {
      console.error('Error al obtener los pedidos:', error.response?.data || error.message);
      throw new Error("Error al obtener los pedidos.");
    }
  }

  // Obtener el detalle de un pedido específico
  async getOrderDetail(orderId) {
    try {
      const token = localStorage.getItem('token');
      if (!token) throw new Error("No token found");

      const response = await axios.get(`${API_URL}/${orderId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      return response.data.order;  // Devuelve el detalle del pedido
    } catch (error) {
      console.error('Error al obtener los detalles del pedido:', error.response?.data || error.message);
      throw new Error("Error al obtener los detalles del pedido.");
    }
  }
}

const orderService = new OrderService();
export default orderService;
