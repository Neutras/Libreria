import { useState, useEffect } from "react";
import {
  fetchHotProducts,
  fetchCategories,
  fetchProducts,
  fetchRecommendations,
} from "../services/api";
import Carousel from "../components/Carousel";
import Categories from "../components/Categories";
import ProductGrid from "../components/ProductGrid";
import authService from "../services/authService";
import "./Home.scss";

const Home = () => {
  const [hotProducts, setHotProducts] = useState(null); // Inicializar como null
  const [categories, setCategories] = useState(null);
  const [products, setProducts] = useState(null);
  const [recommendations, setRecommendations] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [isLoading, setIsLoading] = useState({
    hotProducts: true,
    categories: true,
    products: true,
    recommendations: true,
  });

  const isAuthenticated = authService.isAuthenticated();

  useEffect(() => {
    const loadHotProducts = async () => {
      try {
        const data = await fetchHotProducts();
        setHotProducts(data);
      } catch (error) {
        console.error("Error al cargar productos destacados:", error);
        setHotProducts([]);
      } finally {
        setIsLoading((prev) => ({ ...prev, hotProducts: false }));
      }
    };

    const loadCategories = async () => {
      try {
        const data = await fetchCategories();
        setCategories(data);
      } catch (error) {
        console.error("Error al cargar categorías:", error);
        setCategories([]);
      } finally {
        setIsLoading((prev) => ({ ...prev, categories: false }));
      }
    };

    const loadProducts = async () => {
      try {
        const data = await fetchProducts();
        setProducts(data);
      } catch (error) {
        console.error("Error al cargar productos:", error);
        setProducts([]);
      } finally {
        setIsLoading((prev) => ({ ...prev, products: false }));
      }
    };

    const loadRecommendations = async () => {
      try {
        if (isAuthenticated) {
          const data = await fetchRecommendations();
          if (data.length > 0) {
            setRecommendations(data);
          } else {
            setRecommendations([]); // Respuesta vacía pero no un error.
          }
        }
      } catch (error) {
        console.error("Error al cargar recomendaciones:", error);
        setRecommendations([]); // Manejar errores estableciendo un estado vacío.
      } finally {
        setIsLoading((prev) => ({ ...prev, recommendations: false }));
      }
    };
    

    loadHotProducts();
    loadCategories();
    loadProducts();
    loadRecommendations();
  }, [isAuthenticated]);

  const filterByCategory = async (category) => {
    setSelectedCategory(category);
    setIsLoading((prev) => ({ ...prev, products: true }));
    try {
      const data = await fetchProducts(category);
      setProducts(data);
    } catch (error) {
      console.error("Error al filtrar por categoría:", error);
      setProducts([]);
    } finally {
      setIsLoading((prev) => ({ ...prev, products: false }));
    }
  };

  return (
    <div className="home-container">
      {/* Recomendaciones */}
      {isAuthenticated && (
        <section className="recommendations-section">
          {isLoading.recommendations ? (
            <p className="loading-message">Cargando recomendaciones...</p>
          ) : recommendations?.length ? (
            <Carousel
              title="🌟 Recomendaciones para ti"
              products={recommendations}
            />
          ) : (
            <p className="empty-message">No hay recomendaciones disponibles.</p>
          )}
        </section>
      )}
  
      {/* Productos destacados */}
      <section className="hot-products-section">
        {isLoading.hotProducts ? (
          <p className="loading-message">Cargando productos destacados...</p>
        ) : hotProducts?.length ? (
          <Carousel
            title="⚡ Productos Destacados"
            products={hotProducts}
          />
        ) : (
          <p className="empty-message">No hay productos destacados disponibles.</p>
        )}
      </section>
  
      {/* Grilla de productos */}
      <section className="products-section">
        <h2 className="section-title">🛒 Explora Nuestros Productos</h2>
        {isLoading.categories ? (
          <p className="loading-message">Cargando categorías...</p>
        ) : categories?.length ? (
          <Categories
            categories={categories}
            selectedCategory={selectedCategory}
            onCategorySelect={filterByCategory}
            onReset={() => filterByCategory("")}
          />
        ) : (
          <p className="empty-message">No hay categorías disponibles.</p>
        )}
        {isLoading.products ? (
          <p className="loading-message">Cargando productos...</p>
        ) : products?.length ? (
          <ProductGrid
            products={products}
            fetchProducts={fetchProducts}
          />
        ) : (
          <p className="empty-message">No hay productos disponibles.</p>
        )}
      </section>
    </div>
  );
};

export default Home;