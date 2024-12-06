import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaShoppingCart, FaInfoCircle } from "react-icons/fa";
import Button from "./Button";
import AuthSuggestionModal from "./AuthSuggestionModal";
import CartSummaryModal from "./CartSummaryModal";
import { useCart } from "../context/CartContext";
import "./Navbar.scss";
import authService from "../services/authService";

const Navbar = () => {
  const [userAuthenticated, setUserAuthenticated] = useState(false);
  const [userRole, setUserRole] = useState("");
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showCartModal, setShowCartModal] = useState(false);

  const { cart, clearCart } = useCart();  // Acceso al carrito desde el contexto
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuthentication = () => {
      const userData = authService.isAuthenticated();
      if (userData) {
        setUserAuthenticated(true);
        setUserRole(userData.role);
      } else {
        setUserAuthenticated(false);
        setUserRole("");
      }
    };

    checkAuthentication();
  }, []);

  const handleLogout = () => {
    authService.logout();
    setUserAuthenticated(false);
    setUserRole("");
    clearCart(); // Limpiar carrito al cerrar sesión
  };

  const handleViewCart = () => {
    if (!userAuthenticated) {
      setShowAuthModal(true);  // Mostrar modal de sugerencia de autenticación
    } else if (cart.length === 0) {
      setShowCartModal(true);  // Mostrar modal de carrito vacío
    } else {
      navigate("/cart");  // Redirigir a la página del carrito
    }
  };

  return (
    <nav className="navbar navbar-custom">
      <div className="container-fluid">
        {/* Logo con imagen */}
        <Link className="navbar-brand d-flex align-items-center" to="/home">
          <img
            src='../../public/libreriasanjavier.jpg' // Asegúrate de tener la imagen en public/
            alt="Logo"
            className="navbar-logo"
          />
          <span className="ms-2">Librería San Javier</span>
        </Link>

        {/* Navegación */}
        <div className="d-flex align-items-center ms-auto">
          {/* Sección "Sobre Nosotros" */}
          <Link className="btn btn-outline-info me-2" to="/about">
            Sobre Nosotros
          </Link>

          {/* Botón del carrito */}
          <Button
            className="btn btn-outline-secondary d-flex align-items-center me-2"
            onClick={handleViewCart}
          >
            <FaShoppingCart className="me-1" />
            Carrito
            {cart.length > 0 && (
              <span className="badge bg-danger ms-2">{cart.length}</span>
            )}
          </Button>

          {/* Opciones de usuario */}
          {!userAuthenticated ? (
            <>
              <Button className="btn btn-primary me-2" as={Link} to="/login">
                Iniciar Sesión
              </Button>
              <Button className="btn btn-outline-secondary" as={Link} to="/register">
                Registrarse
              </Button>
            </>
          ) : (
            <>
              {userRole === "admin" && (
                <Button
                  className="btn btn-warning me-2"
                  as={Link}
                  to="/admin-dashboard"
                >
                  Panel Admin
                </Button>
              )}
              <Button className="btn btn-info me-2" as={Link} to="/account">
                Mi Perfil
              </Button>
              <Button className="btn btn-danger" onClick={handleLogout}>
                Cerrar Sesión
              </Button>
            </>
          )}
        </div>
      </div>

      {/* Modal de sugerencia de autenticación */}
      <AuthSuggestionModal
        show={showAuthModal}
        onClose={() => setShowAuthModal(false)}
      />

      {/* Modal de resumen del carrito */}
      <CartSummaryModal
        show={showCartModal}
        onClose={() => setShowCartModal(false)}
      />
    </nav>
  );
};

export default Navbar;