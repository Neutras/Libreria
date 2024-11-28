import React from 'react';

const Navbar = () => {
  const isAuthenticated = false; // Cambiar esto dinámicamente más adelante

  return (
    <nav className="bg-gradient-to-r from-primary to-secondary shadow-lg">
      <div className="container mx-auto flex justify-between items-center p-4">
        <h1 className="text-2xl font-bold text-white">📚 Librería</h1>
        <ul className="flex space-x-6">
          <li>
            <a href="/" className="text-white hover:text-gray-200 transition">Inicio</a>
          </li>
          <li>
            <a href="/productos" className="text-white hover:text-gray-200 transition">Productos</a>
          </li>
          <li>
            {isAuthenticated ? (
              <a href="/perfil" className="text-white hover:text-gray-200 transition">Mi Perfil</a>
            ) : (
              <a href="/login" className="text-white hover:text-gray-200 transition">Iniciar Sesión</a>
            )}
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
