import React, { useEffect } from "react";
import PropTypes from "prop-types";
import "./TermsModal.scss"; // Archivo para estilos específicos

const TermsModal = ({ show, onHide }) => {
  // Manejo del evento para cerrar con la tecla "Escape"
  useEffect(() => {
    const handleEscape = (event) => {
      if (event.key === "Escape" && show) {
        onHide();
      }
    };

    window.addEventListener("keydown", handleEscape);

    return () => {
      window.removeEventListener("keydown", handleEscape);
    };
  }, [show, onHide]);

  // Si no está visible, no se renderiza nada
  if (!show) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="modal-backdrop show"
        onClick={onHide} // Permite cerrar al hacer clic fuera del modal
      ></div>

      {/* Modal */}
      <div
        className="modal show"
        tabIndex="-1"
        role="dialog"
        style={{ display: "block", zIndex: 1050 }}
      >
        <div className="modal-dialog modal-lg" role="document">
          <div className="modal-content">
            {/* Encabezado */}
            <div className="modal-header">
              <h5 className="modal-title">Términos y Condiciones</h5>
              <button
                type="button"
                className="btn-close"
                aria-label="Close"
                onClick={onHide}
              ></button>
            </div>

            {/* Cuerpo del Modal */}
            <div className="modal-body terms-content">
              <h6>1. Aceptación de los términos</h6>
              <p>
                Al registrarse en nuestro servicio, usted acepta cumplir con
                todos los términos y condiciones establecidos en este acuerdo.
              </p>

              <h6>2. Uso adecuado del servicio</h6>
              <ul>
                <li>No realizar actividades ilegales o no autorizadas.</li>
                <li>No intentar vulnerar la seguridad del sistema.</li>
                <li>Respetar a otros usuarios y al equipo de soporte.</li>
              </ul>

              <h6>3. Privacidad</h6>
              <p>
                Nos comprometemos a proteger su información personal de acuerdo
                con nuestra <a href="/privacy-policy">Política de Privacidad</a>.
              </p>

              <h6>4. Cambios en los términos</h6>
              <p>
                Nos reservamos el derecho de modificar estos términos en
                cualquier momento. Le notificaremos de los cambios importantes
                por correo electrónico.
              </p>

              <h6>5. Contacto</h6>
              <p>
                Si tiene preguntas sobre estos términos, puede contactarnos a
                través de nuestro <a href="/contact">centro de soporte</a>.
              </p>
            </div>

            {/* Footer con botón "Cerrar" */}
            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-secondary"
                onClick={onHide}
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

TermsModal.propTypes = {
  show: PropTypes.bool.isRequired,
  onHide: PropTypes.func.isRequired,
};

export default TermsModal;