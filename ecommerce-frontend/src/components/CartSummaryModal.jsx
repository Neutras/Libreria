import React, { useEffect, useRef } from "react";
import { useCart } from "../context/CartContext";
import Button from "./Button";
import "bootstrap/dist/css/bootstrap.min.css";
import "./CartSummaryModal.scss";

const CartSummaryModal = ({ show, onClose }) => {
  const { cart } = useCart();
  const modalRef = useRef(null);
  let modalInstance = null;

  useEffect(() => {
    const modalElement = modalRef.current;

    // Verificar que no haya instancias anteriores
    if (show && modalElement) {
      modalInstance = bootstrap.Modal.getOrCreateInstance(modalElement, {
        backdrop: "static", // Evita cierre accidental al clicar el fondo
        keyboard: true,    // Desactiva cierre con la tecla ESC
      });
      modalInstance.show();
    }

    // Cleanup: Es importante destruir la instancia al desmontar
    return () => {
      if (modalInstance) {
        modalInstance.hide();
        modalInstance.dispose();
      }
    };
  }, [show]);

  const closeModal = () => {
    if (onClose) onClose();
    if (modalInstance) modalInstance.hide();
  };

  return (
    <div
      ref={modalRef}
      className="modal fade"
      id="cartSummaryModal"
      tabIndex="-1"
      aria-labelledby="cartSummaryModalLabel"
      aria-hidden="true"
    >
      <div className="modal-dialog modal-dialog-centered modal-md">
        <div className="modal-content">
          {/* Header */}
          <div className="modal-header">
            <h5 className="modal-title" id="cartSummaryModalLabel">
              Resumen de tu Carrito
            </h5>
            <button
              type="button"
              className="btn-close"
              onClick={closeModal}
              aria-label="Cerrar"
            ></button>
          </div>

          {/* Body */}
          <div className="modal-body">
            {cart.length === 0 ? (
              <p className="text-center">Tu carrito está vacío.</p>
            ) : (
              <ul className="cart-items-list">
                {cart.map((item, index) => (
                  <li key={index} className="cart-item">
                    <span>{item.name}</span>
                    <span>x {item.quantity}</span>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* Footer */}
          <div className="modal-footer">
            <Button className="btn-secondary" onClick={closeModal}>
              Cerrar
            </Button>
            <Button className="btn-primary">Ir a Checkout</Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartSummaryModal;