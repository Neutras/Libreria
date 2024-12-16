import React, { createContext, useContext, useState, useEffect } from "react";
import cartService from "../services/cartService";
import authService from "../services/authService";
import { toast } from "react-toastify";

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState(cartService.getCart());
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Sincronizar autenticación y carrito
  useEffect(() => {
    const syncCartWithServer = async () => {
      const userData = authService.isAuthenticated();
      setIsAuthenticated(!!userData);

      if (userData) {
        try {
          await cartService.syncCart();
          setCart(cartService.getCart());
        } catch (error) {
          console.error("Error al sincronizar el carrito:", error);
          toast.error("Hubo un problema al sincronizar tu carrito.");
        }
      }
    };

    syncCartWithServer();
  }, []);

  // Lógica para añadir un producto al carrito
  const addToCart = (product, quantity = 1) => {
    try {
      // Validación: evitar añadir más de lo permitido por el stock
      const existingProduct = cart.find((p) => p.id === product.id);
      const totalQuantity = existingProduct
        ? existingProduct.quantity + quantity
        : quantity;

      if (totalQuantity > product.stock) {
        toast.error(`Solo hay ${product.stock} unidades disponibles de "${product.name}".`);
        return;
      }

      cartService.addToCart(product, quantity);
      setCart([...cartService.getCart()]);
      toast.success(`"${product.name}" añadido al carrito (${quantity} unidades).`);
    } catch (error) {
      console.error(error.message);
      toast.error(error.message || "No se pudo añadir el producto.");
    }
  };

  // Remover producto del carrito
  const removeFromCart = (productId) => {
    try {
      cartService.removeFromCart(productId);
      setCart(cartService.getCart());
      toast.info("Producto eliminado del carrito.");
    } catch (error) {
      console.error("Error al eliminar el producto:", error.message);
      toast.error("Hubo un problema al eliminar el producto.");
    }
  };

  // Actualizar la cantidad de un producto en el carrito
  const updateQuantity = (productId, quantity) => {
    try {
      const product = cart.find((p) => p.id === productId);

      if (!product) {
        toast.error("Producto no encontrado en el carrito.");
        return;
      }

      if (quantity > 0 && quantity <= product.stock) {
        cartService.updateQuantity(productId, quantity);
        setCart(cartService.getCart());
        toast.success(`Cantidad de "${product.name}" actualizada a ${quantity}.`);
      } else if (quantity <= 0) {
        toast.error("La cantidad debe ser mayor que 0.");
      } else {
        toast.error(`Solo hay ${product.stock} unidades disponibles de "${product.name}".`);
      }
    } catch (error) {
      console.error(error.message);
      toast.error(error.message || "No se pudo actualizar la cantidad.");
    }
  };

  // Limpiar el carrito
  const clearCart = () => {
    try {
      cartService.clearCart();
      setCart([]);
      toast.info("Carrito limpiado.");
    } catch (error) {
      console.error("Error al limpiar el carrito:", error.message);
      toast.error("Hubo un problema al limpiar el carrito.");
    }
  };

  // Calcular totales (precio y puntos)
  const calculateTotals = () => {
    try {
      return cartService.calculateTotals();
    } catch (error) {
      console.error("Error al calcular los totales:", error.message);
      return { total: 0, points: 0 };
    }
  };

  // Enviar pedido al backend (finaliza la compra)
  const submitOrder = async () => {
    try {
      const result = await cartService.submitOrder();
      setCart([]);
      toast.success("Pedido enviado con éxito.");
      return result;
    } catch (error) {
      console.error("Error al enviar el pedido:", error.message);
      toast.error("Hubo un problema al enviar tu pedido.");
      throw error;
    }
  };

  return (
    <CartContext.Provider
      value={{
        cart,
        isAuthenticated,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        calculateTotals,
        submitOrder,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);