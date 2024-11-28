import React from 'react';

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white py-6">
      <div className="container mx-auto text-center">
        <p className="text-sm mb-4">
          © 2024 <span className="font-bold text-primary">Librería</span>. Todos los derechos reservados.
        </p>
        <div className="flex justify-center space-x-6">
          <a href="/privacidad" className="hover:text-secondary transition">Privacidad</a>
          <a href="/terminos" className="hover:text-secondary transition">Términos</a>
          <a href="/contacto" className="hover:text-secondary transition">Contacto</a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
