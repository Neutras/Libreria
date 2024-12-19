import React, { useState, useEffect } from "react";
import { FaEdit, FaEye, FaSave, FaTimes } from "react-icons/fa";
import adminService from "../../services/adminService";
import "./OrderManagement.scss";

const OrderManagement = () => {
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editingOrder, setEditingOrder] = useState(null);
  const [expandedOrder, setExpandedOrder] = useState(null);
  const [updatedStatus, setUpdatedStatus] = useState("");
  const [searchId, setSearchId] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const ordersPerPage = 20;

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const data = await adminService.getOrderList();
        setOrders(data);
        setFilteredOrders(data);
        setLoading(false);
      } catch (err) {
        console.error("Error al cargar pedidos:", err.message);
        setError("No se pudieron cargar los pedidos.");
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  // Actualizar lista filtrada según ID y estado
  useEffect(() => {
    let filtered = orders;

    if (searchId) {
      filtered = filtered.filter((order) =>
        order.id.toString().includes(searchId)
      );
    }

    if (filterStatus) {
      filtered = filtered.filter((order) => order.status === filterStatus);
    }

    setFilteredOrders(filtered);
    setCurrentPage(1); // Reiniciar a la primera página al filtrar
  }, [searchId, filterStatus, orders]);

  const handleEditStatus = (order) => {
    setEditingOrder(order.id);
    setUpdatedStatus(order.status);
  };

  const handleSaveStatus = async (orderId) => {
    try {
      await adminService.updateOrderStatus(orderId, updatedStatus);
      setOrders((prevOrders) =>
        prevOrders.map((order) =>
          order.id === orderId ? { ...order, status: updatedStatus } : order
        )
      );
      setEditingOrder(null);
      alert("Estado del pedido actualizado exitosamente.");
    } catch (err) {
      console.error("Error al actualizar estado del pedido:", err.message);
      alert("No se pudo actualizar el estado del pedido.");
    }
  };

  const toggleOrderDetails = (order) => {
    if (expandedOrder?.id === order.id) {
      setExpandedOrder(null);
    } else {
      setExpandedOrder(order);
    }
  };

  const getStatusClass = (status) => {
    switch (status) {
      case "Pending":
        return "bg-warning";
      case "Preparing":
        return "bg-info";
      case "Ready":
        return "bg-primary";
      case "Completed":
        return "bg-success";
      case "Canceled":
        return "bg-danger";
      default:
        return "bg-secondary";
    }
  };

  // Manejo de paginación
  const indexOfLastOrder = currentPage * ordersPerPage;
  const indexOfFirstOrder = indexOfLastOrder - ordersPerPage;
  const currentOrders = filteredOrders.slice(indexOfFirstOrder, indexOfLastOrder);

  const totalPages = Math.ceil(filteredOrders.length / ordersPerPage);

  const changePage = (newPage) => {
    if (newPage > 0 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  if (loading) {
    return <p className="text-center">Cargando pedidos...</p>;
  }

  return (
    <div className="container order-management my-5">
      <h1 className="text-center mb-4 text-primary">Gestión de Pedidos</h1>

      {error && <div className="alert alert-danger">{error}</div>}

      <div className="filters mb-4 d-flex align-items-center gap-3">
        {/* Filtro por estado */}
        <select
          className="form-select"
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
        >
          <option value="">Todos los estados</option>
          <option value="Pending">Pending</option>
          <option value="Preparing">Preparing</option>
          <option value="Ready">Ready</option>
          <option value="Completed">Completed</option>
          <option value="Canceled">Canceled</option>
        </select>

        {/* Input de búsqueda por ID */}
        <div className="input-group">
          <input
            type="text"
            className="form-control"
            placeholder="Buscar por ID"
            value={searchId}
            onChange={(e) => setSearchId(e.target.value)}
          />
          {searchId && (
            <button
              className="btn btn-outline-secondary"
              onClick={() => setSearchId("")}
            >
              <FaTimes />
            </button>
          )}
        </div>
      </div>

      {currentOrders.length === 0 ? (
        <p className="text-center">No hay pedidos disponibles.</p>
      ) : (
        <>
          <table className="table table-striped table-hover">
            <thead>
              <tr>
                <th>ID</th>
                <th>Cliente</th>
                <th>Total</th>
                <th>Estado</th>
                <th>Creación</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {currentOrders.map((order) => (
                <React.Fragment key={order.id}>
                  <tr>
                    <td>ORD-{order.id}</td>
                    <td>{order.user?.name || "N/A"}</td>
                    <td>${order.total.toFixed(2)}</td>
                    <td>
                      {editingOrder === order.id ? (
                        <select
                          className="form-select"
                          value={updatedStatus}
                          onChange={(e) => setUpdatedStatus(e.target.value)}
                        >
                          <option value="Pending">Pending</option>
                          <option value="Preparing">Preparing</option>
                          <option value="Ready">Ready</option>
                          <option value="Completed">Completed</option>
                          <option value="Canceled">Canceled</option>
                        </select>
                      ) : (
                        <span
                          className={`badge ${getStatusClass(order.status)}`}
                        >
                          {order.status}
                        </span>
                      )}
                    </td>
                    <td>{new Date(order.createdAt).toLocaleString()}</td>
                    <td>
                      {editingOrder === order.id ? (
                        <button
                          className="btn btn-success btn-sm"
                          onClick={() => handleSaveStatus(order.id)}
                        >
                          <FaSave /> Guardar
                        </button>
                      ) : (
                        <button
                          className="btn btn-info btn-sm"
                          onClick={() => handleEditStatus(order)}
                        >
                          <FaEdit /> Actualizar Estado
                        </button>
                      )}
                      <button
                        className="btn btn-primary btn-sm"
                        onClick={() => toggleOrderDetails(order)}
                      >
                        <FaEye /> {expandedOrder?.id === order.id ? "Ocultar" : "Ver"} Detalles
                      </button>
                    </td>
                  </tr>
                  {expandedOrder?.id === order.id && (
                    <tr className="order-details-row">
                      <td colSpan="6">
                        <div className="order-details">
                          <h5>Detalles del Pedido</h5>
                          <ul>
                            {order.products.map((product) => (
                              <li key={product.id}>
                                {product.product?.name || "Producto no disponible"} - 
                                Cantidad: {product.quantity}
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

          {/* Paginación */}
          <div className="pagination d-flex justify-content-center mt-4">
            <button
              className="btn btn-outline-secondary me-2"
              disabled={currentPage === 1}
              onClick={() => changePage(currentPage - 1)}
            >
              Anterior
            </button>
            <span className="align-self-center">Página {currentPage} de {totalPages}</span>
            <button
              className="btn btn-outline-secondary ms-2"
              disabled={currentPage === totalPages}
              onClick={() => changePage(currentPage + 1)}
            >
              Siguiente
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default OrderManagement;