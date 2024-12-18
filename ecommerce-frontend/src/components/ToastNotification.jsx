import React, { useEffect, useState } from "react";
import "./ToastNotification.scss";

const ToastNotification = ({ message, type = "success", show, onClose }) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (show) {
      setIsVisible(true);
      const timer = setTimeout(() => {
        setIsVisible(false);
        onClose && onClose(); // Llamar al callback si existe
      }, 3000);

      return () => clearTimeout(timer); // Limpiar el timeout al desmontar
    }
  }, [show, onClose]);

  return (
    <div
      className={`toast-container position-fixed bottom-0 end-0 p-3 ${
        isVisible ? "d-block" : "d-none"
      }`}
    >
      <div
        className={`toast align-items-center text-bg-${type} border-0 ${
          isVisible ? "show" : ""
        }`}
        role="alert"
        aria-live="assertive"
        aria-atomic="true"
      >
        <div className="toast-header">
          <strong className="me-auto text-light">Notificación</strong>
          <button
            type="button"
            className="btn-close btn-close-white me-2 m-auto"
            aria-label="Cerrar"
            onClick={() => setIsVisible(false)}
          ></button>
        </div>
        <div className="toast-body">{message}</div>
      </div>
    </div>
  );
};

export default ToastNotification;