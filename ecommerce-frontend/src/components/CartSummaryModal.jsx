import React, { useEffect, useRef } from "react";
import { useCart } from "../context/CartContext"; // Accedemos directamente al carrito desde el contexto
import Button from "./Button";
import "bootstrap/dist/css/bootstrap.min.css";
import "./CartSummaryModal.scss";

const CartSummaryModal = ({ show, onClose }) => {
  const { cart } = useCart(); // Accedemos directamente al carrito desde el contexto
  const modalRef = useRef(null); // Usamos useRef para referenciar el modal

  // Abrir el modal cuando 'show' cambie a true
  useEffect(() => {
    if (show) {
      const modalElement = modalRef.current;
      const modalInstance = new bootstrap.Modal(modalElement); // Crear nueva instancia de Bootstrap Modal
      modalInstance.show(); // Mostrar el modal
    }
  }, [show]);

  const closeModal = () => {
    if (onClose) onClose(); // Llamar a onClose para cerrar el modal
    const modalElement = modalRef.current;
    const modalInstance = bootstrap.Modal.getInstance(modalElement);
    modalInstance.hide(); // Cerrar el modal
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
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title" id="cartSummaryModalLabel">
              Tu Carrito
            </h5>
            <button
              type="button"
              className="btn-close"
              onClick={closeModal}
              aria-label="Cerrar"
            ></button>
          </div>
          <div className="modal-body">
            {cart.length === 0 ? (
              <p>Tu carrito está vacío.</p>
            ) : (
              <ul>
                {cart.map((item, index) => (
                  <li key={index}>
                    Producto ID: {item.productId} x {item.quantity}
                  </li>
                ))}
              </ul>
            )}
          </div>
          <div className="modal-footer">
            <Button className="btn-secondary" onClick={closeModal}>
              Cerrar
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartSummaryModal;