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
  addToCart(product) {
    const existingProduct = this.cart.find((p) => p.id === product.id);
    if (existingProduct) {
      // Si ya existe, incrementar la cantidad, asegurándonos que no sobrepase el stock
      if (existingProduct.quantity < product.stock) {
        existingProduct.quantity += 1;
      } else {
        console.log("No puedes añadir más de lo que hay en stock.");
      }
    } else {
      // Si el producto no existe en el carrito, agregarlo
      this.cart.push({ ...product, quantity: 1 });
    }

    this.saveCart();  // Guardamos el carrito actualizado
  }

  // Remover producto del carrito
  removeFromCart(productId) {
    this.cart = this.cart.filter((p) => p.id !== productId);
    this.saveCart();  // Guardamos el carrito actualizado
  }

  // Actualizar cantidad de un producto
  updateQuantity(productId, quantity) {
    const product = this.cart.find((p) => p.id === productId);
    if (product && quantity <= product.stock) {
      product.quantity = quantity;
    } else {
      console.log("Cantidad no válida.");
    }
    this.saveCart();  // Guardamos el carrito actualizado
  }

  // Limpiar carrito
  clearCart() {
    this.cart = [];
    this.saveCart();  // Limpiamos el carrito
  }

  // Obtener carrito actual
  getCart() {
    return this.cart;
  }

  // Calcular totales
  calculateTotals() {
    const total = this.cart.reduce((sum, p) => sum + p.price * p.quantity, 0);
    const points = Math.floor(total / 100);  // Calcular puntos
    return { total, points };
  }

  // Enviar pedido al backend
  async submitOrder() {
    try {
      const payload = this.cart.map(({ id, quantity }) => ({
        productId: id,
        quantity,
      }));
      const response = await axios.post(API_URL, { products: payload });
      this.clearCart(); // Limpiar carrito después del pedido
      return response.data;
    } catch (error) {
      console.error("Error al enviar el pedido:", error.response?.data || error.message);
      throw error;
    }
  }
}

const cartService = new CartService();
export default cartService;