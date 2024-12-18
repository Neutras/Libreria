import React, { useEffect } from "react";
import { useCart } from "../context/CartContext";
import Button from "./Button";
import PropTypes from "prop-types";
import "./CartSummaryModal.scss";

const CartSummaryModal = ({ show, onClose }) => {
  const { cart } = useCart();

  // Manejar cierre con la tecla ESC
  useEffect(() => {
    const handleEscape = (event) => {
      if (event.key === "Escape" && show) {
        onClose();
      }
    };

    window.addEventListener("keydown", handleEscape);

    return () => {
      window.removeEventListener("keydown", handleEscape);
    };
  }, [show, onClose]);

  // Si no está visible, no se renderiza nada
  if (!show) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="modal-backdrop show"
        onClick={onClose} // Cerrar al hacer clic en el backdrop
        style={{ zIndex: 1040 }}
      ></div>

      {/* Modal */}
      <div
        className="modal show"
        tabIndex="-1"
        role="dialog"
        style={{ display: "block", zIndex: 1050 }}
      >
        <div className="modal-dialog modal-dialog-centered modal-md" role="document">
          <div className="modal-content">
            {/* Header */}
            <div className="modal-header">
              <h5 className="modal-title">Resumen de tu Carrito</h5>
              <button
                type="button"
                className="btn-close"
                aria-label="Cerrar"
                onClick={onClose}
              ></button>
            </div>

            {/* Body */}
            <div className="modal-body">
              {cart.length === 0 ? (
                <p className="text-center">Tu carrito está vacío.</p>
              ) : (
                <ul className="cart-items-list">
                  {cart.map((item, index) => (
                    <li key={index} className="cart-item d-flex justify-content-between">
                      <span>{item.name}</span>
                      <span>x {item.quantity}</span>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            {/* Footer */}
            <div className="modal-footer">
              <Button className="btn btn-secondary" onClick={onClose}>
                Cerrar
              </Button>
              <Button className="btn btn-primary" onClick={() => console.log("Ir a Checkout")}>
                Ir a Checkout
              </Button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

CartSummaryModal.propTypes = {
  show: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
};

export default CartSummaryModal;
