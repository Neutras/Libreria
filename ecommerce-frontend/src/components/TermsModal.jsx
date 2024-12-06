import React, { useEffect } from 'react';
import PropTypes from 'prop-types';

const TermsModal = ({ show, onHide }) => {
  // Manejo del evento para cerrar con la tecla "Escape"
  useEffect(() => {
    const handleEscape = (event) => {
      if (event.key === 'Escape' && show) {
        onHide();
      }
    };

    window.addEventListener('keydown', handleEscape);

    return () => {
      window.removeEventListener('keydown', handleEscape);
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
        style={{ display: 'block', zIndex: 1050 }}
      >
        <div className="modal-dialog" role="document">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">Términos y Condiciones</h5>
              <button
                type="button"
                className="btn-close"
                aria-label="Close"
                onClick={onHide}
              ></button>
            </div>
            <div className="modal-body">
              <p>Estos son los términos y condiciones del servicio...</p>
              <p>Los usuarios deben estar de acuerdo con estos términos para poder registrarse.</p>
            </div>
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