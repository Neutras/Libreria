import React from "react";
import { FaArrowUp, FaUser } from "react-icons/fa"; // Importar iconos
import { useNavigate } from "react-router-dom";
import "./FloatingNav.scss"; // Archivo de estilos

const FloatingNav = () => {
  const navigate = useNavigate();

  // Ir al inicio de la página
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Ir a la página de perfil
  const goToProfile = () => {
    navigate("/profile");
  };

  return (
    <div className="floating-nav">
      <button className="nav-button" onClick={scrollToTop} title="Ir arriba">
        <FaArrowUp />
        <span>Arriba</span>
      </button>
      <button className="nav-button" onClick={goToProfile} title="Ir al perfil">
        <FaUser />
        <span>Perfil</span>
      </button>
    </div>
  );
};

export default FloatingNav;