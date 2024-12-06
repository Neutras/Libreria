// CartContext.jsx
import React, { createContext, useContext, useState, useEffect } from "react";
import cartService from "../services/cartService";
import authService from "../services/authService"; // Asegurémonos de importar el servicio de autenticación

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState(cartService.getCart());  // Usamos el carrito inicial desde el servicio
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const userData = authService.isAuthenticated();
    setIsAuthenticated(!!userData);  // Si está autenticado, actualizamos el estado
  }, []);

  useEffect(() => {
    // Actualizamos el carrito cada vez que cambian los productos
    const updatedCart = cartService.getCart();
    setCart(updatedCart);  // Sincronizamos con el estado de React
  }, [cart]);

  // Lógica para añadir un producto al carrito
  const addToCart = (product) => {
    console.log("Handling Add to Cart...");
    console.log("User Authenticated:", isAuthenticated);

    // Verificar si el producto ya está en el carrito
    const existingProduct = cart.find((p) => p.id === product.id);

    if (existingProduct) {
      // Verificar que no se exceda el stock
      if (existingProduct.quantity < product.stock) {
        // Sumar la cantidad si el producto ya existe en el carrito
        existingProduct.quantity += 1;
        setCart([...cartService.getCart()]); // Actualizamos el carrito en el estado
      } else {
        console.log("No se puede añadir más productos, stock insuficiente.");
      }
    } else {
      // Si el producto no está en el carrito, lo añadimos
      if (product.stock > 0) {
        cartService.addToCart(product); // Agregar el producto al carrito
        setCart([...cartService.getCart()]); // Actualizamos el carrito en el estado
      } else {
        console.log("No hay stock disponible para este producto.");
      }
    }
  };

  // Remover producto del carrito
  const removeFromCart = (productId) => {
    cartService.removeFromCart(productId);  // Remover producto del carrito
    setCart(cartService.getCart());
  };

  // Actualizar la cantidad de un producto en el carrito
  const updateQuantity = (productId, quantity) => {
    const product = cart.find((p) => p.id === productId);

    if (product) {
      // Asegurarse de que la cantidad no sea menor a 1 ni mayor que el stock
      if (quantity > 0 && quantity <= product.stock) {
        cartService.updateQuantity(productId, quantity);  // Actualizar la cantidad
        setCart(cartService.getCart()); // Actualizar el carrito en el estado
      } else if (quantity <= 0) {
        console.log("No puedes establecer una cantidad negativa o cero.");
      } else {
        console.log("No hay suficiente stock.");
      }
    }
  };

  // Limpiar el carrito
  const clearCart = () => {
    cartService.clearCart();
    setCart([]);
  };

  // Calcular totales (precio y puntos)
  const calculateTotals = () => cartService.calculateTotals();

  // Enviar pedido al backend (finaliza la compra)
  const submitOrder = async () => {
    const result = await cartService.submitOrder();
    setCart([]);
    return result;
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