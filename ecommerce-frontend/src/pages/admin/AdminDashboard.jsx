import React from "react";
import { Link } from "react-router-dom";
import { FaUsers, FaBox, FaTags, FaChartBar, FaClipboardList } from "react-icons/fa";
import "./AdminDashboard.scss";

const AdminDashboard = () => {
  return (
    <div className="container admin-dashboard my-5">
      <h1 className="text-center mb-4 text-primary">Panel de Administración</h1>
      <p className="text-center text-muted mb-5">
        Bienvenido al panel de administración. Aquí puedes gestionar usuarios, pedidos, productos, promociones y ver métricas importantes.
      </p>

      <div className="row g-4">
        {/* Gestión de Usuarios */}
        <div className="col-md-4">
          <div className="card shadow-sm admin-card">
            <div className="card-body text-center">
              <FaUsers className="icon mb-3 text-primary" />
              <h5 className="card-title">Usuarios</h5>
              <p className="card-text">
                Gestiona los usuarios registrados en la plataforma.
              </p>
              <Link to="/admin/users" className="btn btn-primary">
                Ver Gestión de Usuarios
              </Link>
            </div>
          </div>
        </div>

        {/* Gestión de Pedidos */}
        <div className="col-md-4">
          <div className="card shadow-sm admin-card">
            <div className="card-body text-center">
              <FaClipboardList className="icon mb-3 text-success" />
              <h5 className="card-title">Pedidos</h5>
              <p className="card-text">
                Administra el estado de los pedidos y revisa detalles.
              </p>
              <Link to="/admin/orders" className="btn btn-success">
                Ver Gestión de Pedidos
              </Link>
            </div>
          </div>
        </div>

        {/* Gestión de Productos */}
        <div className="col-md-4">
          <div className="card shadow-sm admin-card">
            <div className="card-body text-center">
              <FaBox className="icon mb-3 text-warning" />
              <h5 className="card-title">Productos</h5>
              <p className="card-text">
                Gestiona inventarios, agrega o edita productos.
              </p>
              <Link to="/admin/products" className="btn btn-warning">
                Ver Gestión de Productos
              </Link>
            </div>
          </div>
        </div>

        {/* Gestión de Promociones */}
        <div className="col-md-6">
          <div className="card shadow-sm admin-card">
            <div className="card-body text-center">
              <FaTags className="icon mb-3 text-danger" />
              <h5 className="card-title">Promociones</h5>
              <p className="card-text">
                Administra promociones y descuentos en los productos.
              </p>
              <Link to="/admin/promotions" className="btn btn-danger">
                Ver Gestión de Promociones
              </Link>
            </div>
          </div>
        </div>

        {/* Métricas */}
        <div className="col-md-6">
          <div className="card shadow-sm admin-card">
            <div className="card-body text-center">
              <FaChartBar className="icon mb-3 text-info" />
              <h5 className="card-title">Métricas</h5>
              <p className="card-text">
                Consulta las estadísticas y el rendimiento de la plataforma.
              </p>
              <Link to="/admin/metrics" className="btn btn-info">
                Ver Métricas
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
