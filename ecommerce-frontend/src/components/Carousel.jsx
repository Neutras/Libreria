import React, { useState } from "react";
import Button from "./Button";
import "./Carousel.scss";

const Carousel = ({ title, products = [], onAddToCart }) => {
  const [toastMessage, setToastMessage] = useState("");

  const handleAddToCart = (product) => {
    setToastMessage(`"${product.name}" añadido al carrito.`);
    const toastEl = document.getElementById("carousel-toast");
    if (toastEl) {
      const toast = bootstrap.Toast.getOrCreateInstance(toastEl);
      toast.show();
    }
    onAddToCart && onAddToCart(product);
  };

  if (!products.length) {
    return <p className="text-center text-muted">No hay productos disponibles.</p>;
  }

  return (
    <div className="carousel-container position-relative">
      {/* Título del carrusel */}
      {title && <h3 className="carousel-title">{title}</h3>}

      {/* Toast */}
      <div className="toast-container position-fixed bottom-0 end-0 p-3">
        <div
          id="carousel-toast"
          className="toast align-items-center text-bg-primary border-0"
          role="alert"
          aria-live="assertive"
          aria-atomic="true"
          data-bs-delay="3000"
        >
          <div className="toast-header">
            <strong className="me-auto text-light">Notificación</strong>
            <button
              type="button"
              className="btn-close btn-close-white me-2 m-auto"
              data-bs-dismiss="toast"
              aria-label="Cerrar"
            ></button>
          </div>
          <div className="toast-body">{toastMessage}</div>
        </div>
      </div>

      {/* Carousel */}
      <div id={`carousel-${title.replace(/\s+/g, "-").toLowerCase()}`} className="carousel slide" data-bs-ride="carousel">
        <div className="carousel-inner">
          {products.map((product, index) => (
            <div key={product.id} className={`carousel-item ${index === 0 ? "active" : ""}`}>
              <img
                src={`https://cataas.com/cat/says/${encodeURIComponent(product.name)}?fontSize=20&width=600&height=400`}
                className="d-block w-100"
                alt={product.name}
              />
              <div className="carousel-caption d-md-block">
                <h5 className="text-light">{product.name}</h5>
                {product.discountPercentage ? (
                  <p>
                    <span className="text-decoration-line-through text-muted">
                      ${product.price}
                    </span>{" "}
                    <span className="text-warning fw-bold">${product.priceWithDiscount}</span>{" "}
                    <small className="text-danger">
                      (-{product.discountPercentage.toFixed(2)}%)
                    </small>
                  </p>
                ) : (
                  <p className="text-warning">${product.price}</p>
                )}
                <Button
                  className="btn btn-secondary mt-2"
                  onClick={() => handleAddToCart(product)}
                >
                  <i className="bi bi-cart-plus me-2"></i>Añadir al carrito
                </Button>
              </div>
            </div>
          ))}
        </div>
        <button
          className="carousel-control-prev"
          type="button"
          data-bs-target={`#carousel-${title.replace(/\s+/g, "-").toLowerCase()}`}
          data-bs-slide="prev"
        >
          <span className="carousel-control-prev-icon" aria-hidden="true"></span>
          <span className="visually-hidden">Anterior</span>
        </button>
        <button
          className="carousel-control-next"
          type="button"
          data-bs-target={`#carousel-${title.replace(/\s+/g, "-").toLowerCase()}`}
          data-bs-slide="next"
        >
          <span className="carousel-control-next-icon" aria-hidden="true"></span>
          <span className="visually-hidden">Siguiente</span>
        </button>
      </div>
    </div>
  );
};

export default Carousel;
