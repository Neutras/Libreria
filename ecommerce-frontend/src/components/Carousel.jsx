import React, { useState } from "react";
import { FaCartPlus, FaCheck, FaPlus, FaMinus } from "react-icons/fa";
import ToastNotification from "./ToastNotification";
import AuthSuggestionModal from "./AuthSuggestionModal";
import authService from "../services/authService";
import { useCart } from "../context/CartContext"; // Importar el contexto del carrito
import "./Carousel.scss";

const Carousel = ({ title, products = [] }) => {
  const [toastMessage, setToastMessage] = useState("");
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [addedToCart, setAddedToCart] = useState([]); // Productos añadidos al carrito temporalmente
  const [quantities, setQuantities] = useState({}); // Manejo de cantidades por producto

  const { addToCart } = useCart(); // Método del contexto del carrito

  // Actualizar cantidad de un producto
  const updateQuantity = (id, delta, stock) => {
    setQuantities((prev) => {
      const newQuantity = Math.min(
        Math.max((prev[id] || 1) + delta, 1), // No bajar de 1
        stock // No superar el stock
      );
      return { ...prev, [id]: newQuantity };
    });
  };

  const handleAddToCart = (product) => {
    if (!authService.isAuthenticated()) {
      setSelectedProduct(product);
      setShowAuthModal(true);
      return;
    }

    const quantity = quantities[product.id] || 1; // Cantidad seleccionada o 1 por defecto

    // Añadir al carrito usando el contexto
    addToCart(product, quantity);

    // Añadir al estado de productos añadidos
    setAddedToCart((prev) => [...prev, product.id]);

    // Mostrar Toast
    setToastMessage(`"${product.name}" (${quantity} unidades) añadido al carrito.`);

    // Quitar del estado después de 3 segundos
    setTimeout(() => {
      setAddedToCart((prev) => prev.filter((id) => id !== product.id));
    }, 3000);
  };

  return (
    <div className="carousel-container">
      {/* Título */}
      {title && <h3 className="carousel-title mb-4">{title}</h3>}

      {/* ToastNotification */}
      {toastMessage && (
        <ToastNotification
          message={toastMessage}
          show={!!toastMessage}
          onClose={() => setToastMessage("")}
        />
      )}

      {/* Modal de autenticación */}
      {showAuthModal && (
        <AuthSuggestionModal
          show={showAuthModal}
          onClose={() => setShowAuthModal(false)}
        />
      )}

      {/* Carrusel */}
      <div
        id={`carousel-${title.replace(/\s+/g, "-").toLowerCase()}`}
        className="carousel slide"
        data-bs-ride="carousel"
      >
        <div className="carousel-inner">
          {products.map((product, index) => (
            <div
              key={product.id}
              className={`carousel-item ${index === 0 ? "active" : ""}`}
            >
              <div className="product-card mx-auto">
                <div className="position-relative">
                  {/* Imagen */}
                  <img
                    src={`https://cataas.com/cat/says/${encodeURIComponent(
                      product.name
                    )}?fontSize=20&width=300&height=200`}
                    className="d-block w-100 rounded"
                    alt={product.name}
                  />
                  {/* Badge de descuento */}
                  {product.discountPercentage > 0 && (
                    <span className="badge bg-danger position-absolute top-0 end-0 m-2">
                      ¡Oferta! ({product.discountPercentage.toFixed(0)}%)
                    </span>
                  )}
                </div>

                {/* Detalles del producto */}
                <div className="card-body text-center p-2">
                  <h6 className="card-title mb-1 fw-bold">{product.name}</h6>
                  <p className="card-text mb-1">
                    <small className="text-muted">
                      Marca: {product.author}
                    </small>
                  </p>
                  <p className="card-text">
                    {product.priceWithDiscount ? (
                      <>
                        <span className="text-decoration-line-through text-muted me-2">
                          ${product.price}
                        </span>
                        <span className="text-success fw-bold">
                          ${product.priceWithDiscount}
                        </span>
                      </>
                    ) : (
                      <span className="fw-bold">${product.price}</span>
                    )}
                  </p>

                  {/* Controles de cantidad */}
                  <div className="d-flex align-items-center justify-content-center mb-2">
                    <button
                      className="btn btn-outline-secondary btn-sm me-2"
                      onClick={() =>
                        updateQuantity(product.id, -1, product.stock)
                      }
                    >
                      <FaMinus />
                    </button>
                    <span>{quantities[product.id] || 1}</span>
                    <button
                      className="btn btn-outline-secondary btn-sm ms-2"
                      onClick={() =>
                        updateQuantity(product.id, 1, product.stock)
                      }
                    >
                      <FaPlus />
                    </button>
                  </div>

                  {/* Botón de añadir al carrito */}
                  <button
                    className={`btn btn-sm w-100 d-flex align-items-center justify-content-center ${
                      addedToCart.includes(product.id)
                        ? "btn-success"
                        : "btn-primary"
                    }`}
                    onClick={() => handleAddToCart(product)}
                    disabled={addedToCart.includes(product.id)}
                  >
                    {addedToCart.includes(product.id) ? (
                      <>
                        <FaCheck className="me-2" /> Añadido
                      </>
                    ) : (
                      <>
                        <FaCartPlus className="me-2" /> Añadir al carrito
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Controles del carrusel */}
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