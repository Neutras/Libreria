import React, { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import apiClient from "../utils/apiClient";

const Home = () => {
  const [hotProducts, setHotProducts] = useState([]);

  useEffect(() => {
    // Fetch productos destacados desde el backend
    const fetchHotProducts = async () => {
      try {
        const response = await apiClient.get("/products?isHot=true"); // Solicitar solo productos destacados
        const products = response.data.products || [];
        setHotProducts(products);
      } catch (error) {
        console.error("Error al obtener productos destacados:", error);
      }
    };

    fetchHotProducts();
  }, []);

  return (
    <div className="home">
      <Navbar />
      <main className="home-main">
        {/* Hero Section */}
        <section className="hero">
          <h1 className="hero-title">¡Bienvenidos a nuestra Librería!</h1>
          <p className="hero-description">
            Descubre productos de calidad para la escuela y la oficina.
          </p>
          <a href="/productos" className="hero-button">
            Ver Productos
          </a>
        </section>

        {/* Productos Destacados */}
        <section className="featured-products">
          <h2 className="featured-products-title">Productos Destacados</h2>
          <div className="featured-products-grid">
            {hotProducts.length > 0 ? (
              hotProducts.map((product) => (
                <div key={product.id} className="product-card">
                  <img
                    src={
                      product.image ||
                      `https://cataas.com/cat/says/${product.name}?size=18&width=150&height=150&fontColor=red`
                    }
                    alt={product.name}
                    className="product-image"
                  />
                  <h3 className="product-name">{product.name}</h3>
                  <p className="product-description">{product.description}</p>
                  <p className="product-price">
                    {product.priceWithDiscount ? (
                      <span className="product-price-discount">
                        ${product.priceWithDiscount} (Oferta)
                      </span>
                    ) : (
                      `$${product.price}`
                    )}
                  </p>
                  <button className="product-button">Ver más</button>
                </div>
              ))
            ) : (
              <p className="no-products-message">
                No hay productos destacados en este momento.
              </p>
            )}
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default Home;
