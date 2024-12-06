import React, { useState, useEffect } from "react";
import "./ToastNotification.scss";

const ToastNotification = ({ message, show, onClose }) => {
  const [isVisible, setIsVisible] = useState(show);

  useEffect(() => {
    if (show) {
      setIsVisible(true);
      setTimeout(() => {
        setIsVisible(false);
        onClose(); // Callback para notificar al componente padre que se cerró el toast
      }, 3000); // El toast desaparecerá después de 3 segundos
    }
  }, [show, onClose]);

  return (
    <>
      {isVisible && (
        <div className="toast-container position-fixed bottom-0 end-0 p-3">
          <div
            className="toast align-items-center text-bg-success border-0"
            role="alert"
            aria-live="assertive"
            aria-atomic="true"
          >
            <div className="d-flex">
              <div className="toast-body">{message}</div>
              <button
                type="button"
                className="btn-close btn-close-white me-2 m-auto"
                data-bs-dismiss="toast"
                aria-label="Cerrar"
                onClick={() => setIsVisible(false)} // Permite cerrar manualmente
              ></button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ToastNotification;