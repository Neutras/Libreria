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
      const modalInstance = new bootstrap.Modal(modalElement, {
        backdrop: 'false', // Esto desactiva el fondo opaco
        keyboard: true, // Esto permite cerrar el modal con la tecla ESC
      });
      modalInstance.show(); // Mostrar el modal

      // Evento para cerrar modal al presionar ESC
      const handleKeyDown = (e) => {
        if (e.key === "Escape") {
          closeModal();
        }
      };
      window.addEventListener("keydown", handleKeyDown);

      // Cleanup del event listener
      return () => {
        window.removeEventListener("keydown", handleKeyDown);
      };
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
      className="modal"
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