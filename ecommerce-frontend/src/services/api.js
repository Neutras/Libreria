import axios from "axios";

// Configurar Axios con base URL
const apiClient = axios.create({
  baseURL: "http://localhost:4000/api", // Base URL de la API
});

// Configurar token de autenticación
const getAuthHeaders = () => {
  const token = localStorage.getItem("token"); // Token almacenado
  return token ? { Authorization: `Bearer ${token}` } : {};
};

// Obtener productos destacados
export const fetchHotProducts = async () => {
  const response = await apiClient.get("/products?isHot=true");
  return response.data.products;
};

// Obtener categorías únicas
export const fetchCategories = async () => {
  const response = await apiClient.get("/products/categories");
  return response.data;
};

// Obtener todos los productos o filtrar por categoría
export const fetchProducts = async (category = null, name = null) => {
  let url = "/products";
  const params = new URLSearchParams();

  if (category) params.append("category", category);
  if (name) params.append("name", name);

  if (params.toString()) url += `?${params.toString()}`;

  const response = await apiClient.get(url);
  return response.data.products;
};


// Obtener productos recomendados (requiere autenticación)
export const fetchRecommendations = async () => {
  try {
    const response = await apiClient.get("/products/recommendations", {
      headers: getAuthHeaders(),
    });
    return response.data;
  } catch (error) {
    console.error("Error al obtener recomendaciones:", error.response?.data || error.message);
    return []; // Devolver un array vacío en caso de error.
  }
};