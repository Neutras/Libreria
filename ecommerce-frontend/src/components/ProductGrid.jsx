import React, { useState, useEffect, useCallback } from "react";
import { FaSearch, FaTimes, FaCartPlus, FaMinus, FaPlus } from "react-icons/fa";
import ToastNotification from "./ToastNotification";
import AuthSuggestionModal from "./AuthSuggestionModal";
import { useCart } from "../context/CartContext";
import "./ProductGrid.scss";

const ProductGrid = ({ products = [], fetchProducts }) => {
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortOption, setSortOption] = useState("");
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [toastMessage, setToastMessage] = useState("");
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [page, setPage] = useState(1);
  const [perPage] = useState(6);
  const [addedToCart, setAddedToCart] = useState([]);
  const [showOnlyOffers, setShowOnlyOffers] = useState(false);
  const { addToCart, isAuthenticated } = useCart();

  const [quantities, setQuantities] = useState({});

  // Actualizar lista filtrada y paginada
  useEffect(() => {
    let filtered = products;
    if (searchTerm.length >= 3) {
      const normalize = (str) => str.normalize("NFD").replace(/\p{Diacritic}/gu, "");
      filtered = products.filter((product) =>
        normalize(product.name.toLowerCase()).includes(normalize(searchTerm.toLowerCase()))
      );
    }
    if (showOnlyOffers) {
      filtered = filtered.filter((product) => product.priceWithDiscount);
    }
    setFilteredProducts(filtered);
    setPage(1); // Reiniciar a la primera página después de filtrar
  }, [products, searchTerm, showOnlyOffers]);

  // Función de paginación
  const paginatedProducts = useCallback(() => {
    const start = (page - 1) * perPage;
    return filteredProducts.slice(start, start + perPage);
  }, [filteredProducts, page, perPage]);

  // Ordenar productos
  const handleSort = (option) => {
    setSortOption(option);
    let sortedProducts = [...filteredProducts];
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
        break;
    }
    setFilteredProducts(sortedProducts);
  };

  // Añadir al carrito
  const handleAddToCart = (product) => {
    const quantity = quantities[product.id] || 1;

    if (isAuthenticated) {
      try {
        if (quantity > product.stock) {
          setToastMessage(`Stock insuficiente para \"${product.name}\". Máximo disponible: ${product.stock}.`);
          return;
        }
        addToCart({ ...product, quantity });
        setToastMessage(`\"${product.name}\" se añadió al carrito (${quantity} unidades).`);
        setAddedToCart((prev) => [...prev, product.id]);
        setTimeout(() => setAddedToCart((prev) => prev.filter((id) => id !== product.id)), 2000);
      } catch (error) {
        setToastMessage(error.message);
      }
    } else {
      setSelectedProduct(product);
      setShowAuthModal(true);
    }
  };

  // Manejo de cantidades
  const updateQuantity = (id, delta, stock) => {
    setQuantities((prev) => ({
      ...prev,
      [id]: Math.min(Math.max((prev[id] || 1) + delta, 1), stock), // Respetar el stock
    }));
  };

  return (
    <div className="product-grid">
      {toastMessage && <ToastNotification message={toastMessage} onClose={() => setToastMessage("")} />}
      {showAuthModal && (
        <AuthSuggestionModal
          show={showAuthModal}
          onClose={() => setShowAuthModal(false)}
          product={selectedProduct}
          onAddToCart={(product) => {
            addToCart(product);
            setShowAuthModal(false);
            setToastMessage(`\"${product.name}\" se añadió al carrito.`);
          }}
        />
      )}

      {/* Filtros y Ordenamiento */}
      <div className="filters-bar mb-3 d-flex justify-content-between align-items-center">
        <div className="input-group w-50">
          <span className="input-group-text">
            <FaSearch />
          </span>
          <input
            type="text"
            placeholder="Buscar productos..."
            className="form-control"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          {searchTerm && (
            <button
              className="btn btn-outline-secondary"
              onClick={() => setSearchTerm("")}
            >
              <FaTimes />
            </button>
          )}
        </div>
        <div className="d-flex align-items-center">
          <label className="me-2">
            <input
              type="checkbox"
              checked={showOnlyOffers}
              onChange={(e) => setShowOnlyOffers(e.target.checked)}
            />
            Mostrar ofertas
          </label>
          <select
            className="form-select ms-3"
            value={sortOption}
            onChange={(e) => handleSort(e.target.value)}
          >
            <option value="">Ordenar</option>
            <option value="price-asc">Precio: Menor a Mayor</option>
            <option value="price-desc">Precio: Mayor a Menor</option>
            <option value="name-asc">Nombre: A-Z</option>
            <option value="name-desc">Nombre: Z-A</option>
          </select>
        </div>
      </div>

      {/* Lista de productos */}
      <div className="row row-cols-1 row-cols-md-3 g-4">
        {paginatedProducts().map((product) => (
          <div key={product.id} className="col">
            <div className="card product-card">
              <div className="position-relative">
                <img
                  src={`https://cataas.com/cat/says/${encodeURIComponent(product.name)}?fontSize=20&width=300&height=200`}
                  className="card-img-top"
                  alt={product.name}
                  title={product.description}
                />
                {product.discountPercentage > 0 && (
                  <span className="badge bg-danger position-absolute top-0 end-0 m-2">
                    ¡Oferta! ({product.discountPercentage.toFixed(2)}%)
                  </span>
                )}
              </div>
              <div className="card-body">
                <h5 className="card-title">{product.name}</h5>
                <p className="card-text text-muted mb-1"><b>Marca</b>: {product.author}</p>
                <p className="card-text text-muted mb-1"><b>Stock</b>: {product.stock} unidades</p>
                <p className="card-text">
                  {product.priceWithDiscount ? (
                    <>
                      <span className="text-muted text-decoration-line-through">
                        ${product.price}
                      </span>
                      <span className="text-success fw-bold ms-2">
                        ${product.priceWithDiscount}
                      </span>
                    </>
                  ) : (
                    <span className="text-dark fw-bold">${product.price}</span>
                  )}
                </p>
                <div className="d-flex align-items-center">
                  <button
                    className="btn btn-outline-secondary btn-sm me-2"
                    onClick={() => updateQuantity(product.id, -1, product.stock)}
                  >
                    <FaMinus />
                  </button>
                  <span>{quantities[product.id] || 1}</span>
                  <button
                    className="btn btn-outline-secondary btn-sm ms-2"
                    onClick={() => updateQuantity(product.id, 1, product.stock)}
                  >
                    <FaPlus />
                  </button>
                </div>
                <button
                  className={`btn w-100 mt-3 ${addedToCart.includes(product.id) ? "btn-success" : "btn-primary"}`}
                  onClick={() => handleAddToCart(product)}
                  disabled={addedToCart.includes(product.id)}
                >
                  {addedToCart.includes(product.id) ? (
                    <span>
                      <FaCartPlus /> Añadido
                    </span>
                  ) : (
                    <span>
                      <FaCartPlus /> Añadir al carrito
                    </span>
                  )}
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Paginación */}
      <div className="pagination d-flex justify-content-center mt-4">
        <button
          className="btn btn-outline-secondary me-2"
          disabled={page === 1}
          onClick={() => setPage((prev) => prev - 1)}
        >
          Anterior
        </button>
        <span className="align-self-center">Página {page}</span>
        <button
          className="btn btn-outline-secondary ms-2"
          disabled={page * perPage >= filteredProducts.length}
          onClick={() => setPage((prev) => prev + 1)}
        >
          Siguiente
        </button>
      </div>
    </div>
  );
};

export default ProductGrid;