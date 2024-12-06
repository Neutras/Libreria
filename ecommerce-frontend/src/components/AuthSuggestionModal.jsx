import React, { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import Button from "./Button";
import "./AuthSuggestionModal.scss";

const AuthSuggestionModal = ({ show, onClose }) => {
  const modalRef = useRef(null); // Usamos useRef para referenciar el modal
  const navigate = useNavigate();

  // Abrir el modal cuando 'show' cambie a true
  useEffect(() => {
    if (show) {
      const modalElement = modalRef.current;
      const modalInstance = new bootstrap.Modal(modalElement); // Crear nueva instancia de Bootstrap Modal
      modalInstance.show(); // Mostrar el modal
    }
  }, [show]); // Cuando 'show' cambie, ejecutamos este efecto

  const handleLogin = () => {
    closeModal();
    navigate("/login");
  };

  const handleRegister = () => {
    closeModal();
    navigate("/register");
  };

  const closeModal = () => {
    if (onClose) onClose(); // Llamar a onClose para cerrar el modal desde el padre
    const modalElement = modalRef.current;
    const modalInstance = bootstrap.Modal.getInstance(modalElement);
    modalInstance.hide(); // Cerrar el modal
  };

  return (
    <div
      ref={modalRef}
      className="modal fade"
      id="authSuggestionModal"
      tabIndex="-1"
      aria-labelledby="authSuggestionModalLabel"
      aria-hidden="true"
    >
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title" id="authSuggestionModalLabel">
              Acceso Requerido
            </h5>
            <button
              type="button"
              className="btn-close"
              onClick={closeModal}
              aria-label="Cerrar"
            ></button>
          </div>
          <div className="modal-body">
            <p>Inicia sesión o regístrate para acceder a esta funcionalidad.</p>
            <div className="d-flex justify-content-around">
              <Button className="btn-primary" onClick={handleLogin}>
                Iniciar Sesión
              </Button>
              <Button className="btn-secondary" onClick={handleRegister}>
                Registrarse
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthSuggestionModal;