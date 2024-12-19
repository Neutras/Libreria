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

  // Añadir producto al carrito
  const addToCart = (product, quantity = 1) => {
    try {
      const existingProduct = cart.find((p) => p.id === product.id);

      // Validar stock disponible
      const totalQuantity = existingProduct
        ? existingProduct.quantity + quantity
        : quantity;

      if (totalQuantity > product.stock) {
        toast.error(
          `No se puede añadir más de ${product.stock} unidades de "${product.name}".`
        );
        return;
      }

      // Añadir producto al carrito
      cartService.addToCart(product, quantity);
      setCart([...cartService.getCart()]);
      toast.success(
        `"${product.name}" añadido al carrito (${quantity} unidad${
          quantity > 1 ? "es" : ""
        }).`
      );
    } catch (error) {
      console.error("Error al añadir producto al carrito:", error.message);
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
      console.error("Error al eliminar producto:", error.message);
      toast.error("Hubo un problema al eliminar el producto.");
    }
  };

  // Actualizar cantidad de un producto
  const updateQuantity = (productId, quantity) => {
    try {
      const product = cart.find((p) => p.id === productId);

      if (!product) {
        toast.error("Producto no encontrado en el carrito.");
        return;
      }

      // Validar cantidad y stock
      if (quantity <= 0) {
        toast.error("La cantidad debe ser mayor que 0.");
        return;
      }
      if (quantity > product.stock) {
        toast.error(`No hay suficiente stock de "${product.name}".`);
        return;
      }

      cartService.updateQuantity(productId, quantity);
      setCart(cartService.getCart());
      toast.success(
        `Cantidad de "${product.name}" actualizada a ${quantity} unidad${
          quantity > 1 ? "es" : ""
        }.`
      );
    } catch (error) {
      console.error("Error al actualizar cantidad:", error.message);
      toast.error(error.message || "No se pudo actualizar la cantidad.");
    }
  };

  // Limpiar carrito
  const clearCart = () => {
    try {
      cartService.clearCart();
      setCart([]);
      toast.info("Carrito limpiado.");
    } catch (error) {
      console.error("Error al limpiar carrito:", error.message);
      toast.error("Hubo un problema al limpiar el carrito.");
    }
  };

  // Calcular totales
  const calculateTotals = () => {
    try {
      return cartService.calculateTotals();
    } catch (error) {
      console.error("Error al calcular totales:", error.message);
      return { total: 0, points: 0 };
    }
  };

  // Enviar pedido
  const submitOrder = async () => {
    try {
      const result = await cartService.submitOrder();
      setCart([]);
      toast.success("Pedido enviado con éxito.");
      return result;
    } catch (error) {
      console.error("Error al enviar pedido:", error.message);
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