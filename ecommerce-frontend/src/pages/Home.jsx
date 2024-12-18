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
import FloatingNav from "../components/FloatingNav";
import "./Home.scss";

const Home = () => {
  const [hotProducts, setHotProducts] = useState(null);
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
      } catch {
        setHotProducts([]);
      } finally {
        setIsLoading((prev) => ({ ...prev, hotProducts: false }));
      }
    };

    const loadRecommendations = async () => {
      if (isAuthenticated) {
        try {
          const data = await fetchRecommendations();
          setRecommendations(data || []);
        } catch {
          setRecommendations([]);
        } finally {
          setIsLoading((prev) => ({ ...prev, recommendations: false }));
        }
      }
    };

    const loadCategories = async () => {
      try {
        const data = await fetchCategories();
        setCategories(data);
      } catch {
        setCategories([]);
      } finally {
        setIsLoading((prev) => ({ ...prev, categories: false }));
      }
    };

    const loadProducts = async () => {
      try {
        const data = await fetchProducts();
        setProducts(data);
      } catch {
        setProducts([]);
      } finally {
        setIsLoading((prev) => ({ ...prev, products: false }));
      }
    };

    loadHotProducts();
    loadRecommendations();
    loadCategories();
    loadProducts();
  }, [isAuthenticated]);

  const filterByCategory = async (category) => {
    setSelectedCategory(category);
    setIsLoading((prev) => ({ ...prev, products: true }));
    try {
      const data = await fetchProducts(category);
      setProducts(data);
    } catch {
      setProducts([]);
    } finally {
      setIsLoading((prev) => ({ ...prev, products: false }));
    }
  };

  return (
    <div className="home-container">
      {/* Carruseles compactados */}
      <section className="carousel-wrapper">
        {/* Recomendaciones */}
        {isAuthenticated && !isLoading.recommendations && recommendations?.length > 0 && (
          <Carousel title="🌟 Recomendaciones para ti 🌟" products={recommendations} />
        )}
        {/* Productos destacados */}
        {!isLoading.hotProducts && hotProducts?.length > 0 && (
          <Carousel title="⚡ Productos Destacados ⚡" products={hotProducts} />
        )}
      </section>

      {/* Grilla de productos */}
      <section className="products-section">
        <h2 className="section-title">🛒 Explora Nuestros Productos</h2>
        {!isLoading.categories && categories?.length > 0 && (
          <Categories
            categories={categories}
            selectedCategory={selectedCategory}
            onCategorySelect={filterByCategory}
            onReset={() => filterByCategory("")}
          />
        )}

        {!isLoading.products && products?.length > 0 ? (
          <ProductGrid products={products} fetchProducts={fetchProducts} />
        ) : (
          <p className="text-muted text-center">No hay productos disponibles.</p>
        )}
      </section>

      <FloatingNav />
    </div>
  );
};

export default Home;
