import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import apiClient from '../utils/apiClient';

const Home = () => {
  const [hotProducts, setHotProducts] = useState([]);

  useEffect(() => {
    // Fetch productos destacados (HOT)
    const fetchHotProducts = async () => {
      try {
        const response = await apiClient.get('/products/hot'); // Endpoint del backend
        setHotProducts(response.data.products);
      } catch (error) {
        console.error('Error al obtener productos destacados:', error);
      }
    };

    fetchHotProducts();
  }, []);

  return (
    <div>
      <Navbar />
      <main className="bg-background min-h-screen">
        <div className="container mx-auto py-10">
          {/* Hero Section */}
          <section className="text-center py-16 bg-gradient-to-br from-primary to-secondary rounded-lg shadow-lg text-white">
            <h1 className="text-5xl font-bold font-poppins">¡Bienvenidos a nuestra Librería!</h1>
            <p className="mt-4 text-lg">Descubre productos de calidad para la escuela y la oficina.</p>
            <a
              href="/productos"
              className="mt-6 inline-block bg-white text-primary font-bold py-3 px-6 rounded-lg shadow-md hover:bg-gray-100 transition"
            >
              Ver Productos
            </a>
          </section>

          {/* Productos Destacados */}
          <section className="py-10">
            <h2 className="text-3xl font-bold text-text-primary text-center mb-6">Productos Destacados</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {hotProducts.length > 0 ? (
                hotProducts.map((product) => (
                  <div key={product.id} className="p-4 bg-white rounded-lg shadow-md hover:shadow-lg transition">
                    <img
                      src={product.image || `https://via.placeholder.com/150?text=${product.name}`}
                      alt={product.name}
                      className="w-full rounded-md mb-4"
                    />
                    <h3 className="font-bold text-lg text-text-primary">{product.name}</h3>
                    <p className="text-text-secondary">{product.description}</p>
                    <button className="mt-4 bg-primary text-white py-2 px-4 rounded-lg hover:bg-secondary transition">
                      Ver más
                    </button>
                  </div>
                ))
              ) : (
                <p className="text-center text-text-secondary">No hay productos destacados en este momento.</p>
              )}
            </div>
          </section>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Home;