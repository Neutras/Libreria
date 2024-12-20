import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import orderService from "../services/orderService";
import Button from "../components/Button";
import "./OrderConfirmation.scss";

const OrderConfirmation = () => {
  const { id } = useParams(); // Obtener el ID del pedido desde la URL
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const orderDetail = await orderService.getOrderDetail(id);
        setOrder(orderDetail);
      } catch (err) {
        console.error("Error al obtener el pedido:", err.message);
        setError("No se pudo cargar el pedido. Intenta nuevamente más tarde.");
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [id]);

  if (loading) {
    return <p className="text-center">Cargando detalles del pedido...</p>;
  }

  if (error) {
    return <div className="alert alert-danger text-center">{error}</div>;
  }

  return (
    <div className="container order-confirmation my-5">
      <h1 className="text-center mb-4 text-primary">Confirmación de Pedido</h1>

      {order && (
        <div className="order-details">
          <h2 className="text-center">Pedido #{order.id}</h2>
          <p className="text-center text-muted">
            Creado el: {new Date(order.createdAt).toLocaleString()}
          </p>

          <div className="order-summary">
            <h3>Resumen</h3>
            <div className="summary-row">
              <span>Total:</span>
              <strong>${order.total.toFixed(2)}</strong>
            </div>
            <div className="summary-row">
              <span>Puntos Acumulados:</span>
              <strong>{order.points}</strong>
            </div>
          </div>

          <div className="order-products">
            <h3>Detalle de Productos</h3>
            {order.products.map((item) => (
              <div key={item.id} className="product-item">
                <p>
                  <strong>{item.product.name}</strong> (x{item.quantity})
                </p>
                <p className="text-muted">
                  ${item.product.price.toFixed(2)} por unidad
                </p>
              </div>
            ))}
          </div>

          <div className="order-actions text-center mt-4">
            <Button
              className="btn btn-primary me-3"
              onClick={() => navigate("/")}
            >
              Volver al Inicio
            </Button>
            <Button
              className="btn btn-secondary"
              onClick={() => navigate("/account")}
            >
              Ir a tu Perfil
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrderConfirmation;