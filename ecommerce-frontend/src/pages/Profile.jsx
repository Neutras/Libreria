import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaEdit, FaEye, FaTag, FaTimes } from "react-icons/fa";
import Button from "../components/Button";
import AuthService from "../services/authService";
import OrderService from "../services/orderService";
import "./Profile.scss";

const Profile = () => {
  const [userData, setUserData] = useState(null);
  const [orders, setOrders] = useState([]);
  const [expandedOrder, setExpandedOrder] = useState(null); // Controla qué pedido está expandido
  const [loading, setLoading] = useState(true);
  const [userPoints, setUserPoints] = useState(0);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const user = await AuthService.getUserData();
        const points = await AuthService.getUserPoints();
        const orderList = await OrderService.getUserOrders();

        setUserData(user);
        setUserPoints(points.points);
        setOrders(orderList);
        setLoading(false);
      } catch (error) {
        console.error("Error al cargar los datos del usuario:", error.message);
        setError("Hubo un problema al cargar tus datos. Intenta nuevamente.");
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  const handleChangePassword = () => {
    navigate("/change-password");
  };

  const handleRedeemPoints = () => {
    alert("Canjeando puntos...");
    // Lógica adicional para canjear puntos
  };

  const toggleOrderDetails = async (orderId) => {
    if (expandedOrder?.id === orderId) {
      setExpandedOrder(null); // Colapsar el pedido si ya está expandido
    } else {
      try {
        const orderDetail = await OrderService.getOrderDetail(orderId);
        setExpandedOrder(orderDetail);
      } catch (error) {
        console.error("Error al obtener el detalle del pedido:", error.message);
      }
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "Pending":
        return "bg-warning";
      case "Preparing":
        return "bg-info";
      case "Ready":
        return "bg-primary";
      case "Completed":
        return "bg-success";
      default:
        return "bg-danger";
    }
  };

  if (loading) {
    return <div className="loading-text">Cargando...</div>;
  }

  return (
    <div className="profile-container">
      <h2 className="text-center mb-4">Perfil de Usuario</h2>

      {/* Manejo de Errores */}
      {error && <div className="alert alert-danger">{error}</div>}

      {/* Información del Usuario */}
      {userData && (
        <div className="user-info">
          <div className="user-info-header mb-3">
            <p>
              <strong>Correo Electrónico:</strong> {userData.email || "Información no disponible por el momento..."}
            </p>
            <p>
              <strong>Nombre:</strong> {userData.name || "Información no disponible por el momento..."}
            </p>
            <p>
              <strong>Puntos:</strong> {userPoints || 0}
            </p>
            <Button className="btn-info mt-2" onClick={handleRedeemPoints}>
              <FaTag /> Canjear Puntos
            </Button>
          </div>

          <Button className="btn-secondary mt-3" onClick={handleChangePassword}>
            <FaEdit /> Cambiar Contraseña
          </Button>
        </div>
      )}

      {/* Listado de Pedidos */}
      <div className="orders-section mt-5">
        <h3>Mis Pedidos</h3>
        {orders.length === 0 ? (
          <p>No has realizado ningún pedido aún.</p>
        ) : (
          <table className="table table-striped table-hover">
            <thead>
              <tr>
                <th>Código</th>
                <th>Comprador</th>
                <th>Cantidad de Productos</th>
                <th>Creación</th>
                <th>Actualización</th>
                <th>Total</th>
                <th>Estado</th>
                <th>Detalles</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <React.Fragment key={order.id}>
                  <tr>
                    <td>{order.code || `ORD-${order.id}`}</td>
                    <td>{userData.userId || "No Disponible"}</td>
                    <td>
                      {order.products.reduce((acc, product) => acc + product.quantity, 0)}
                    </td>
                    <td>{new Date(order.createdAt).toLocaleString()}</td>
                    <td>{new Date(order.updatedAt).toLocaleString()}</td>
                    <td>${order.total.toFixed(2)}</td>
                    <td>
                      <div className="progress" style={{ height: "10px" }}>
                        <div
                          className={`progress-bar ${getStatusColor(order.status)}`}
                          role="progressbar"
                          style={{
                            width: `${
                              order.status === "Completed"
                                ? 100
                                : order.status === "Preparing"
                                ? 60
                                : 30
                            }%`,
                          }}
                          aria-valuenow={
                            order.status === "Completed"
                              ? 100
                              : order.status === "Preparing"
                              ? 60
                              : 30
                          }
                          aria-valuemin="0"
                          aria-valuemax="100"
                        ></div>
                      </div>
                      <span className="status-text">{order.status}</span>
                    </td>
                    <td>
                      <Button
                        className="btn-secondary"
                        onClick={() => toggleOrderDetails(order.id)}
                      >
                        <FaEye /> {expandedOrder?.id === order.id ? "Ocultar" : "Ver"} Detalles
                      </Button>
                    </td>
                  </tr>
                  {expandedOrder?.id === order.id && (
                    <tr className="order-details-row">
                      <td colSpan="8">
                        <div className="order-details">
                          <h5>Detalle del Pedido</h5>
                          <p>
                            <strong>Estado:</strong> {expandedOrder.status}
                          </p>
                          <p>
                            <strong>Total:</strong> ${expandedOrder.total.toFixed(2)}
                          </p>
                          <p>
                            <strong>Puntos:</strong> {expandedOrder.points}
                          </p>
                          <p>
                            <strong>Fecha de Creación:</strong>{" "}
                            {new Date(expandedOrder.createdAt).toLocaleString()}
                          </p>
                          <h6>Productos:</h6>
                          <ul>
                            {expandedOrder.products.map((product, index) => (
                              <li key={index}>
                                {product.name} - Cantidad: {product.quantity}
                              </li>
                            ))}
                          </ul>
                        </div>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default Profile;