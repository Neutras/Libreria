import React from "react";
import { FaArrowUp, FaUser, FaShoppingCart, FaEnvelope } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import authService from "../services/authService"; // Servicio para verificar autenticación
import "./FloatingNav.scss";

const FloatingNav = () => {
  const navigate = useNavigate();

  // Función para ir al inicio de la página
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Función para ir al footer (usando el ID del footer)
  const scrollToFooter = () => {
    const footer = document.getElementById("footer");
    if (footer) {
      footer.scrollIntoView({ behavior: "smooth" });
    }
  };

  // Navegación dinámica basada en el rol
  const goToDashboard = () => {
    const role = authService.getUserRole();
    if (role === "admin") {
      navigate("/admin-dashboard");
    } else {
      navigate("/account");
    }
  };

  // Ir al carrito de compras
  const goToCart = () => {
    navigate("/cart");
  };

  // Verificar si el usuario está autenticado
  const isAuthenticated = authService.isAuthenticated();
  const userRole = authService.getUserRole();

  return (
    <div className="floating-nav">
      {/* Botón para ir arriba */}
      <button className="nav-button" onClick={scrollToTop} title="Ir arriba">
        <FaArrowUp />
        <span>Arriba</span>
      </button>

      {/* Botón para el perfil o panel admin */}
      {isAuthenticated && (
        <button
          className="nav-button"
          onClick={goToDashboard}
          title={userRole === "admin" ? "Panel Admin" : "Mi Perfil"}
        >
          <FaUser />
          <span>{userRole === "admin" ? "Admin" : "Perfil"}</span>
        </button>
      )}

      {/* Botón para el carrito - Solo si está autenticado */}
      {isAuthenticated && (
        <button className="nav-button" onClick={goToCart} title="Ir al carrito">
          <FaShoppingCart />
          <span>Carrito</span>
        </button>
      )}

      {/* Botón para ir al footer/contacto */}
      <button
        className="nav-button"
        onClick={scrollToFooter}
        title="Ir a contacto"
      >
        <FaEnvelope />
        <span>Contacto</span>
      </button>
    </div>
  );
};

export default FloatingNav;