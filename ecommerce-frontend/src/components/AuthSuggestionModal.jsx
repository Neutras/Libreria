import React from "react";
import { useNavigate } from "react-router-dom";
import Button from "./Button";
import PropTypes from "prop-types";
import "./AuthSuggestionModal.scss";

const AuthSuggestionModal = ({ show, onClose }) => {
  const navigate = useNavigate();

  const handleLogin = () => {
    onClose();
    navigate("/login");
  };

  const handleRegister = () => {
    onClose();
    navigate("/register");
  };

  // Si no está visible, no se renderiza nada
  if (!show) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="modal-backdrop show"
        onClick={onClose} // Permite cerrar al hacer clic fuera del modal
        style={{ zIndex: 1040 }} // Se asegura que esté detrás del modal
      ></div>

      {/* Modal */}
      <div
        className="modal show"
        tabIndex="-1"
        role="dialog"
        style={{ display: "block", zIndex: 1050 }} // Z-index más alto que el backdrop
      >
        <div className="modal-dialog modal-dialog-centered" role="document">
          <div className="modal-content shadow-sm">
            {/* Encabezado */}
            <div className="modal-header">
              <h5 className="modal-title">Acceso Requerido</h5>
              <button
                type="button"
                className="btn-close"
                aria-label="Cerrar"
                onClick={onClose}
              ></button>
            </div>

            {/* Cuerpo */}
            <div className="modal-body text-center">
              <p>Inicia sesión o regístrate para acceder a esta funcionalidad.</p>
              <div className="d-flex justify-content-center gap-3">
                <Button className="btn btn-primary w-50" onClick={handleLogin}>
                  Iniciar Sesión
                </Button>
                <Button className="btn btn-secondary w-50" onClick={handleRegister}>
                  Registrarse
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

AuthSuggestionModal.propTypes = {
  show: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
};

export default AuthSuggestionModal;