import React from 'react';
import '../styles/Navbar.css'; // Archivo de estilos específicos

const Navbar = () => {
  const isAuthenticated = false; // Cambiar esto dinámicamente más adelante

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <h1 className="navbar-title">📚 Librería</h1>
        <ul className="navbar-links">
          <li className="navbar-item">
            <a href="/" className="navbar-link">Inicio</a>
          </li>
          <li className="navbar-item">
            <a href="/productos" className="navbar-link">Productos</a>
          </li>
          <li className="navbar-item">
            {isAuthenticated ? (
              <a href="/perfil" className="navbar-link">Mi Perfil</a>
            ) : (
              <a href="/login" className="navbar-link">Iniciar Sesión</a>
            )}
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
