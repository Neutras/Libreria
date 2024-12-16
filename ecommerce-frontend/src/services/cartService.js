import axios from "axios";

const API_URL = "http://localhost:4000/api/orders";

class CartService {
  constructor() {
    this.cart = JSON.parse(localStorage.getItem("cart")) || [];
  }

  // Guardar el carrito en el almacenamiento local
  saveCart() {
    localStorage.setItem("cart", JSON.stringify(this.cart));
  }

  // Agregar producto al carrito
  addToCart(product, quantity = 1) {
    const existingProduct = this.cart.find((p) => p.id === product.id);

    if (existingProduct) {
      const newQuantity = existingProduct.quantity + quantity;

      // Validación de stock al agregar cantidades adicionales
      if (newQuantity <= product.stock) {
        existingProduct.quantity = newQuantity;
      } else {
        throw new Error(
          `Stock insuficiente: Solo hay ${product.stock} unidades disponibles.`
        );
      }
    } else {
      // Validación de stock al añadir un producto nuevo
      if (quantity <= product.stock) {
        this.cart.push({ ...product, quantity });
      } else {
        throw new Error(
          `Stock insuficiente: Solo hay ${product.stock} unidades disponibles.`
        );
      }
    }

    this.saveCart();
  }

  // Remover producto del carrito
  removeFromCart(productId) {
    this.cart = this.cart.filter((p) => p.id !== productId);
    this.saveCart();
  }

  // Actualizar cantidad de un producto
  updateQuantity(productId, quantity) {
    const product = this.cart.find((p) => p.id === productId);

    if (!product) {
      throw new Error("Producto no encontrado en el carrito.");
    }

    if (quantity > 0 && quantity <= product.stock) {
      product.quantity = quantity;
    } else {
      throw new Error(
        quantity <= 0
          ? "La cantidad debe ser mayor que 0."
          : `Stock insuficiente: Solo hay ${product.stock} unidades disponibles.`
      );
    }

    this.saveCart();
  }

  // Limpiar carrito
  clearCart() {
    this.cart = [];
    this.saveCart();
  }

  // Obtener carrito actual
  getCart() {
    return this.cart;
  }

  // Calcular totales
  calculateTotals() {
    const total = this.cart.reduce((sum, p) => {
      const price = p.priceWithDiscount || p.price;
      return sum + price * p.quantity;
    }, 0);

    const points = Math.floor(total / 100);
    return { total, points };
  }

  // Sincronizar carrito con el backend
  async syncCart() {
    try {
      const token = localStorage.getItem("token");
      if (token) {
        const response = await axios.get(`${API_URL}/cart`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        this.cart = response.data.cart || [];
        this.saveCart();
      }
    } catch (error) {
      console.error("Error al sincronizar el carrito:", error);
      throw new Error("No se pudo sincronizar el carrito con el servidor.");
    }
  }

  // Enviar pedido al backend
  async submitOrder() {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("No autorizado. Por favor, inicia sesión.");
      }

      const payload = this.cart.map(({ id, quantity }) => ({
        productId: id,
        quantity,
      }));

      const response = await axios.post(
        API_URL,
        { products: payload },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      this.clearCart();
      return response.data;
    } catch (error) {
      console.error("Error al enviar el pedido:", error.response?.data || error.message);
      const message =
        error.response?.status === 401
          ? "No autorizado. Por favor, verifica tu sesión."
          : "Hubo un problema al enviar tu pedido. Inténtalo nuevamente.";
      throw new Error(message);
    }
  }

  // Obtener detalles del carrito sincronizado con el backend
  async fetchCartDetails() {
    try {
      const token = localStorage.getItem("token");
      if (token) {
        const response = await axios.get(`${API_URL}/cart/details`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        return response.data;
      }
      return null;
    } catch (error) {
      console.error("Error al obtener detalles del carrito:", error);
      throw new Error("Hubo un problema al cargar los detalles del carrito.");
    }
  }
}

const cartService = new CartService();
export default cartService;