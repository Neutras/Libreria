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

  if (!show) return null; // No renderizar si el modal está cerrado

  return (
    <div className={`modal fade ${show ? "show d-block" : ""}`} tabIndex="-1" aria-labelledby="authModalLabel" aria-hidden={!show}>
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content shadow-sm">
          <div className="modal-header">
            <h5 className="modal-title" id="authModalLabel">
              Acceso Requerido
            </h5>
            <button
              type="button"
              className="btn-close"
              onClick={onClose}
              aria-label="Cerrar"
            ></button>
          </div>
          <div className="modal-body text-center">
            <p>Inicia sesión o regístrate para acceder a esta funcionalidad.</p>
            <div className="d-flex justify-content-center gap-3">
              <Button className="btn-primary w-50" onClick={handleLogin}>
                Iniciar Sesión
              </Button>
              <Button className="btn-secondary w-50" onClick={handleRegister}>
                Registrarse
              </Button>
            </div>
          </div>
        </div>
      </div>
      {/* Fondo opaco personalizado */}
      <div className="modal-backdrop fade show"></div>
    </div>
  );
};

AuthSuggestionModal.propTypes = {
  show: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
};

export default AuthSuggestionModal;