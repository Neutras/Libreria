import React, { useState, useEffect, useCallback } from "react";
import Button from "./Button";
import ToastNotification from "./ToastNotification";
import AuthSuggestionModal from "./AuthSuggestionModal";
import { useCart } from "../context/CartContext"; // Importar contexto del carrito
import "./ProductGrid.scss";

const ProductGrid = ({ products = [], fetchProducts }) => {
  const [currentProducts, setCurrentProducts] = useState(products);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortOption, setSortOption] = useState(""); // Opción de ordenamiento
  const [selectedProduct, setSelectedProduct] = useState(null); // Producto seleccionado para mostrar en el modal
  const [toastMessage, setToastMessage] = useState(""); // Mensaje de notificación
  const [showAuthModal, setShowAuthModal] = useState(false); // Modal de autenticación

  const { addToCart, isAuthenticated } = useCart(); // Obtener funciones del contexto del carrito

  // Función de búsqueda
  const handleSearch = useCallback(
    async (query) => {
      if (!query.trim()) {
        setCurrentProducts(products);
        return;
      }

      try {
        const filteredProducts = await fetchProducts(null, query);
        setCurrentProducts(filteredProducts);
      } catch (error) {
        console.error("Error al buscar productos:", error);
      }
    },
    [fetchProducts, products]
  );

  // Actualización de búsqueda en tiempo real
  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      handleSearch(searchTerm);
    }, 300);

    return () => clearTimeout(delayDebounce); // Cleanup del debounce
  }, [searchTerm, handleSearch]);

  // Ordenar productos
  const handleSort = (option) => {
    setSortOption(option);

    let sortedProducts = [...currentProducts];

    switch (option) {
      case "price-asc":
        sortedProducts.sort((a, b) => a.price - b.price);
        break;
      case "price-desc":
        sortedProducts.sort((a, b) => b.price - a.price);
        break;
      case "name-asc":
        sortedProducts.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case "name-desc":
        sortedProducts.sort((a, b) => b.name.localeCompare(a.name));
        break;
      default:
        sortedProducts = products;
        break;
    }

    setCurrentProducts(sortedProducts);
  };

  // Limpiar búsqueda
  const clearSearch = () => {
    setSearchTerm("");
    setCurrentProducts(products);
  };

  // Manejo de añadir al carrito
  const handleAddToCart = (product) => {
    console.log("Handling Add to Cart...");
    console.log("User Authenticated:", isAuthenticated);

    if (isAuthenticated) {
      console.log("Adding product to cart:", product);
      addToCart(product); // Agregar al carrito
      setToastMessage(`"${product.name}" se añadió al carrito.`); // Mostrar notificación
    } else {
      console.log("User is not authenticated, showing auth modal.");
      setSelectedProduct(product); // Establecer producto seleccionado
      setShowAuthModal(true); // Mostrar modal de autenticación
    }
  };

  return (
    <div className="product-grid">
      {/* Modal de autenticación */}
      {showAuthModal && (
        <AuthSuggestionModal
          show={showAuthModal}
          onClose={() => setShowAuthModal(false)}
          product={selectedProduct}
          onAddToCart={(product) => {
            addToCart(product);
            setShowAuthModal(false); // Cerrar el modal después de agregar
            setToastMessage(`"${product.name}" se añadió al carrito.`);
          }}
        />
      )}

      {/* Notificación de Toast */}
      {toastMessage && (
        <ToastNotification
          message={toastMessage}
          onClose={() => setToastMessage("")}
        />
      )}

      {/* Barra de búsqueda y ordenamiento */}
      <div className="search-sort-bar mb-3 d-flex justify-content-between align-items-center">
        {/* Búsqueda */}
        <div className="input-group">
          <span className="input-group-text">
            <i className="bi bi-search"></i>
          </span>
          <input
            type="text"
            className="form-control"
            placeholder="Buscar productos..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          {searchTerm && (
            <button className="btn btn-outline-secondary" onClick={clearSearch}>
              <i className="bi bi-x-circle"></i>
            </button>
          )}
        </div>

        {/* Ordenamiento */}
        <div className="dropdown">
          <button
            className="btn btn-outline-secondary dropdown-toggle"
            type="button"
            id="dropdownSort"
            data-bs-toggle="dropdown"
            aria-expanded="false"
          >
            Ordenar por
          </button>
          <ul className="dropdown-menu" aria-labelledby="dropdownSort">
            <li>
              <button
                className="dropdown-item"
                onClick={() => handleSort("price-asc")}
              >
                Precio: Menor a Mayor
              </button>
            </li>
            <li>
              <button
                className="dropdown-item"
                onClick={() => handleSort("price-desc")}
              >
                Precio: Mayor a Menor
              </button>
            </li>
            <li>
              <button
                className="dropdown-item"
                onClick={() => handleSort("name-asc")}
              >
                Nombre: A-Z
              </button>
            </li>
            <li>
              <button
                className="dropdown-item"
                onClick={() => handleSort("name-desc")}
              >
                Nombre: Z-A
              </button>
            </li>
          </ul>
        </div>
      </div>

      {/* Productos */}
      <div className="row row-cols-1 row-cols-md-3 g-4">
        {currentProducts.map((product) => (
          <div key={product.id} className="col">
            <div className="card shadow-sm h-100">
              <div className="position-relative">
                <img
                  src={`https://cataas.com/cat/says/${encodeURIComponent(
                    product.name
                  )}?fontSize=20&width=300&height=200`}
                  className="card-img-top"
                  alt={product.name}
                />
                {/* Mostrar oferta solo si hay descuento */}
                {product.discountPercentage > 0 && (
                  <span className="badge bg-danger position-absolute top-0 end-0 m-2">
                    ¡Oferta!
                  </span>
                )}
              </div>
              <div className="card-body d-flex flex-column">
                <h5 className="card-title text-primary">{product.name}</h5>
                <p className="card-category text-muted">
                  Categoría: {product.category}
                </p>
                {product.discountPercentage ? (
                  <p className="card-text">
                    <span className="text-muted text-decoration-line-through">
                      ${product.price}
                    </span>{" "}
                    <span className="text-success fw-bold">
                      ${product.priceWithDiscount}
                    </span>{" "}
                    <small className="text-danger">
                      (-{product.discountPercentage.toFixed(2)}%)
                    </small>
                  </p>
                ) : (
                  <p className="card-text text-muted">${product.price}</p>
                )}
                <small className="text-muted mb-2">
                  <i>Unidades disponibles: {product.stock}</i>
                </small>
                <Button
                  className="btn btn-secondary mt-auto d-flex align-items-center justify-content-center"
                  onClick={() => handleAddToCart(product)}
                >
                  <i className="bi bi-cart-plus me-2"></i> Añadir al carrito
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProductGrid;