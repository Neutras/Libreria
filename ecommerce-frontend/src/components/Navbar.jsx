import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  FaShoppingCart,
  FaInfoCircle,
  FaSignInAlt,
  FaUserPlus,
  FaUserCircle,
  FaSignOutAlt,
  FaImage,
  FaList,
} from "react-icons/fa";
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

  const { cart, clearCart } = useCart();
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuthentication = () => {
      const isAuthenticated = authService.isAuthenticated();
      if (isAuthenticated) {
        setUserAuthenticated(true);
        setUserRole(authService.getUserRole());
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
    clearCart();
    navigate("/login");
  };

  const handleViewCart = () => {
    if (!userAuthenticated) {
      setShowAuthModal(true);
    } else if (cart.length === 0) {
      setShowCartModal(true);
    } else {
      navigate("/cart");
    }
  };

  const handleProfileOrAdmin = () => {
    if (userRole === "admin") {
      navigate("/admin");
    } else {
      navigate("/account");
    }
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-custom">
      <div className="container-fluid">
        {/* Logo */}
        <Link className="navbar-brand d-flex align-items-center" to="/">
          <img
            src="/libreriasanjavier.jpg"
            alt="Logo"
            className="navbar-logo"
          />
          <span className="ms-2 fw-bold">Librería San Javier</span>
        </Link>

        {/* Responsive Toggle Button */}
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        {/* Navbar Links */}
        <div className="navbar-collapse" id="navbarNav">
          <ul className="navbar-nav ms-auto">
            <li className="nav-item">
              <Link className="nav-link" to="/about">
                <FaInfoCircle className="me-1" /> Sobre Nosotros
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/image-upload">
                <FaImage className="me-1" /> ¡Analiza tu lista!
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/">
                <FaList className="me-1" /> Productos
              </Link>
            </li>
            <li className="nav-item">
              <Button
                className="btn btn-outline-secondary d-flex align-items-center"
                onClick={handleViewCart}
              >
                <FaShoppingCart className="me-1" />
                Carrito
                {cart.length > 0 && (
                  <span className="badge bg-danger ms-2">{cart.length}</span>
                )}
              </Button>
            </li>
          </ul>

          {/* User Authentication Section */}
          <div className="d-flex align-items-center">
            {!userAuthenticated ? (
              <>
                <Button
                  className="btn btn-outline-primary me-2"
                  as={Link}
                  to="/login"
                >
                  <FaSignInAlt className="me-1" />
                  Iniciar Sesión
                </Button>
                <Button
                  className="btn btn-outline-success"
                  as={Link}
                  to="/register"
                >
                  <FaUserPlus className="me-1" />
                  Registrarse
                </Button>
              </>
            ) : (
              <>
                <Button
                  className="btn btn-warning me-2"
                  onClick={handleProfileOrAdmin}
                >
                  <FaUserCircle className="me-1" />
                  {userRole === "admin" ? "Panel Admin" : "Mi Perfil"}
                </Button>
                <Button
                  className="btn btn-danger"
                  onClick={handleLogout}
                >
                  <FaSignOutAlt className="me-1" />
                  Cerrar Sesión
                </Button>
              </>
            )}
          </div>
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