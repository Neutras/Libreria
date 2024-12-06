import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import Button from "../components/Button";
import AuthService from "../services/authService";
import OrderService from "../services/orderService";
import { FaEdit, FaEye, FaTag } from "react-icons/fa"; // Iconos de editar, ojo y etiqueta de puntos
import './Profile.scss';

const Profile = () => {
  const [userData, setUserData] = useState(null);
  const [orders, setOrders] = useState([]);  // Orders will be an array
  const [loading, setLoading] = useState(true);
  const [userPoints, setUserPoints] = useState(0);
  const [error, setError] = useState(null);
  const [orderDetails, setOrderDetails] = useState(null);  // Detalles de un pedido específico
  const navigate = useNavigate();

  // Fetch user data and orders on component mount
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const points = await AuthService.getUserPoints(); // Obtener puntos
        const user = AuthService.getUserData();  // Obtener los datos del usuario desde el token
        setUserData(user);
        setUserPoints(points.points);  // Set points data
        setLoading(false);

        const orderList = await OrderService.getUserOrders();  // Obtener los pedidos
        setOrders(orderList);  // Set the list of orders
      } catch (error) {
        console.error("Error al cargar los datos del usuario:", error.message);
        setError("Hubo un problema al cargar tus datos. Intenta nuevamente.");
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  const handleChangePassword = () => {
    navigate("/change-password");  // Navegar a la página para cambiar la contraseña
  };

  const handleOrderDetail = async (orderId) => {
    try {
      const orderDetail = await OrderService.getOrderDetail(orderId);
      setOrderDetails(orderDetail);  // Set the detailed order data
    } catch (error) {
      console.error("Error al obtener el detalle del pedido:", error.message);
    }
  };

  const handleRedeemPoints = () => {
    alert('Canjeando puntos...');
    // Aquí puedes integrar la lógica para canjear los puntos (requiere una API o lógica adicional)
  };

  if (loading) {
    return <div className="loading-text">Cargando...</div>;
  }

  return (
    <div className="profile-container">
      <h2>Perfil de Usuario</h2>
      
      {/* Error handling */}
      {error && <div className="alert alert-danger">{error}</div>}

      {/* Información del Usuario */}
      {userData && (
        <div className="user-info">
          <div className="user-info-header">
            <p><strong>Correo Electrónico:</strong> {userData.email}</p>
            <p><strong>Nombre:</strong> {userData.name}</p>
            <p><strong>Puntos:</strong> {userPoints}</p>
            <Button className="btn-info" onClick={handleRedeemPoints}>
              <FaTag /> Canjear Puntos
            </Button>
          </div>

          <Button className="btn-info" onClick={handleChangePassword}>
            <FaEdit /> Cambiar Contraseña
          </Button>
        </div>
      )}

      {/* Listado de Pedidos - Tabla */}
      <div className="orders-section">
        <h3>Mis Pedidos</h3>
        {orders.length === 0 ? (
          <p>No has realizado ningún pedido aún.</p>
        ) : (
          <table className="table table-striped">
            <thead>
              <tr>
                <th scope="col">N° de Pedido</th>
                <th scope="col">Nombre del Comprador</th>
                <th scope="col">Total Productos</th>
                <th scope="col">Fecha Creación</th>
                <th scope="col">Última Actualización</th>
                <th scope="col">Precio Total</th>
                <th scope="col">Estado</th>
                <th scope="col">Detalles</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order.id}>
                  <td>{order.id}</td>
                  <td>{userData.name}</td>
                  <td>{order.products.length}</td>
                  <td>{new Date(order.createdAt).toLocaleString()}</td>
                  <td>{new Date(order.updatedAt).toLocaleString()}</td>
                  <td>${order.total.toFixed(2)}</td>
                  <td>
                    <div className="progress" style={{ height: "10px" }}>
                      <div
                        className={`progress-bar ${
                          order.status === "Pending"
                            ? "bg-warning"
                            : order.status === "Preparing"
                            ? "bg-info"
                            : order.status === "Ready"
                            ? "bg-primary"
                            : order.status === "Completed"
                            ? "bg-success"
                            : "bg-danger"
                        }`}
                        role="progressbar"
                        style={{ width: `${(order.status === "Completed" ? 100 : order.status === "Preparing" ? 60 : 30)}%` }}
                        aria-valuenow={order.status === "Completed" ? 100 : order.status === "Preparing" ? 60 : 30}
                        aria-valuemin="0"
                        aria-valuemax="100"
                      ></div>
                    </div>
                    <span className="status-text">{order.status}</span>
                  </td>
                  <td>
                    <Button className="btn-secondary" onClick={() => handleOrderDetail(order.id)}>
                      <FaEye /> Ver Detalles
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Modal de detalles del pedido */}
      {orderDetails && (
        <div className="order-detail">
          <h4>Detalle del Pedido #{orderDetails.id}</h4>
          <p><strong>Estado:</strong> {orderDetails.status}</p>
          <p><strong>Total:</strong> ${orderDetails.total.toFixed(2)}</p>
          <p><strong>Puntos:</strong> {orderDetails.points}</p>
          <p><strong>Fecha de Creación:</strong> {new Date(orderDetails.createdAt).toLocaleString()}</p>
          
          <h5>Productos:</h5>
          <ul>
            {orderDetails.products.map((product, index) => (
              <li key={index}>
                Producto: {product.productId} - Cantidad: {product.quantity}
              </li>
            ))}
          </ul>

          <Button className="btn-secondary" onClick={() => setOrderDetails(null)}>
            Cerrar Detalles
          </Button>
        </div>
      )}
    </div>
  );
};

export default Profile;
