import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext"; // Importar contexto del carrito
import Button from "../components/Button";
import { FaTrashAlt, FaPlusCircle, FaMinusCircle, FaShoppingCart } from "react-icons/fa";
import "./Cart.scss"; // Asegúrate de tener los estilos necesarios para este componente

const Cart = () => {
  const { cart, removeFromCart, updateQuantity, calculateTotals, submitOrder } = useCart();
  const navigate = useNavigate();
  const [cartTotal, setCartTotal] = useState({ total: 0, points: 0 });
  const [localCart, setLocalCart] = useState(cart); // Usamos un estado local para el carrito

  // Calcular totales del carrito
  useEffect(() => {
    const totals = calculateTotals();
    setCartTotal(totals); // Calcular totales del carrito (total y puntos)
  }, [localCart, calculateTotals]); // Se re-calculan los totales solo cuando `localCart` cambia

  // Manejar actualización de cantidades
  const handleUpdateQuantity = (productId, increment) => {
    const updatedCart = [...localCart];
    const product = updatedCart.find((p) => p.id === productId);
    if (product) {
      let newQuantity = product.quantity + increment;
      // Asegurarse de que no haya una cantidad negativa y que no exceda el stock
      if (newQuantity > 0 && newQuantity <= product.stock) {
        product.quantity = newQuantity; // Modificar la cantidad directamente
        setLocalCart(updatedCart); // Actualizar el estado local del carrito
        updateQuantity(productId, newQuantity); // Actualizamos el carrito en el contexto
      } else if (newQuantity <= 0) {
        console.log("La cantidad no puede ser cero o negativa.");
      } else {
        console.log("No hay suficiente stock disponible.");
      }
    }
  };

  // Manejar eliminación de productos
  const handleRemoveProduct = (productId) => {
    removeFromCart(productId); // Eliminar producto del carrito
    const updatedCart = localCart.filter((product) => product.id !== productId);
    setLocalCart(updatedCart); // Actualizamos el estado local después de eliminar
  };

  // Manejar el checkout (finalización de compra)
  const handleCheckout = async () => {
    if (localCart.length === 0) {
      alert("Tu carrito está vacío. Agrega productos para continuar.");
      return;
    }

    try {
      const order = await submitOrder(); // Enviar el pedido al backend
      console.log("Pedido realizado con éxito:", order);
      navigate("/order-confirmation"); // Redirigir a la página de confirmación del pedido
    } catch (error) {
      console.error("Error al realizar el pedido:", error);
      alert("Hubo un problema al realizar el pedido. Intenta nuevamente.");
    }
  };

  return (
    <div className="cart-container">
      <h2 className="cart-title">
        <FaShoppingCart className="cart-icon" />
        Tu Carrito
      </h2>

      {/* Verificar si el carrito está vacío */}
      {localCart.length === 0 ? (
        <div className="empty-cart-message">
          <p>Tu carrito está vacío. Agrega productos para continuar.</p>
          <Button className="btn-primary" onClick={() => navigate("/")}>
            Ver Productos
          </Button>
        </div>
      ) : (
        <>
          <div className="cart-items">
            {localCart.map((product) => {
              const productPrice = product.discountPercentage
                ? product.priceWithDiscount
                : product.price;

              const price = product.discountPercentage ? (
                <div className="price-with-discount">
                  <span className="old-price">${product.price}</span>
                  <span className="new-price">${productPrice}</span>
                  <span className="discount-percentage">({product.discountPercentage.toFixed(2)}% OFF)</span>
                </div>
              ) : (
                <p className="cart-item-price">${productPrice}</p>
              );

              return (
                <div key={product.id} className="cart-item">
                  <div className="cart-item-info">
                    <img
                      src={`https://cataas.com/cat/says/${encodeURIComponent(
                        product.name
                      )}?fontSize=20&width=300&height=200`}
                      alt={product.name}
                      className="cart-item-image"
                    />
                    <div className="cart-item-details">
                      <h5 className="cart-item-title">{product.name}</h5>
                      <p className="cart-item-category">{product.category}</p>
                      {price}
                      <p className="cart-item-stock">Stock: {product.stock}</p>
                    </div>
                  </div>

                  <div className="cart-item-actions">
                    <div className="quantity-controls">
                      <button
                        className="quantity-btn"
                        onClick={() => handleUpdateQuantity(product.id, -1)} // Disminuir cantidad
                      >
                        <FaMinusCircle />
                      </button>
                      <span className="quantity-display">{product.quantity}</span>
                      <button
                        className="quantity-btn"
                        onClick={() => handleUpdateQuantity(product.id, 1)} // Aumentar cantidad
                      >
                        <FaPlusCircle />
                      </button>
                    </div>
                    <Button
                      className="btn-danger cart-item-remove"
                      onClick={() => handleRemoveProduct(product.id)} // Eliminar producto
                    >
                      <FaTrashAlt />
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Totales */}
          <div className="cart-totals">
            <h4 className="totals-title">Resumen</h4>
            <div className="totals-row">
              <span>Total:</span>
              <strong>${cartTotal.total.toFixed(2)}</strong>
            </div>
            <div className="totals-row">
              <span>Puntos:</span>
              <strong>{cartTotal.points}</strong>
            </div>
          </div>

          {/* Botón de Checkout */}
          <Button className="btn-primary checkout-btn" onClick={handleCheckout}>
            Finalizar Compra
          </Button>
        </>
      )}
    </div>
  );
};

export default Cart;