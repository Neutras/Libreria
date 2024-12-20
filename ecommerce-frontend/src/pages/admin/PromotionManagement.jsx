import React, { useState, useEffect } from "react";
import { FaPlus, FaTrashAlt, FaSearch } from "react-icons/fa";
import adminService from "../../services/adminService";
import "./PromotionManagement.scss";

const PromotionManagement = () => {
  const [promotions, setPromotions] = useState([]);
  const [newPromotion, setNewPromotion] = useState({
    name: "",
    description: "",
    discount: "",
    duration: "",
    productId: "",
  });
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredPromotions, setFilteredPromotions] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPromotions = async () => {
      try {
        const data = await adminService.getPromotions();
        if (Array.isArray(data)) {
          const formattedData = data.map((promotion) => ({
            ...promotion,
            productName: promotion.product?.name || "Producto no disponible",
          }));
          setPromotions(formattedData);
          setFilteredPromotions(formattedData);
        } else {
          console.error("Formato inesperado en la respuesta de promociones:", data);
          setPromotions([]);
          setFilteredPromotions([]);
        }
      } catch (err) {
        console.error("Error al cargar promociones:", err.message);
        setError("No se pudieron cargar las promociones.");
        setPromotions([]);
        setFilteredPromotions([]);
      } finally {
        setLoading(false);
      }
    };
    fetchPromotions();
  }, []);

  const handleSearch = (e) => {
    const term = e.target.value;
    setSearchTerm(term);
    if (term) {
      const filtered = promotions.filter(
        (promotion) =>
          promotion.name.toLowerCase().includes(term.toLowerCase()) ||
          promotion.description.toLowerCase().includes(term.toLowerCase())
      );
      setFilteredPromotions(filtered);
    } else {
      setFilteredPromotions(promotions);
    }
  };

  const handleAddPromotion = async () => {
    try {
      const data = {
        ...newPromotion,
        discount: parseFloat(newPromotion.discount),
        duration: parseInt(newPromotion.duration, 10),
        productId: parseInt(newPromotion.productId, 10),
      };
      const createdPromotion = await adminService.createPromotion(data);
      const formattedPromotion = {
        ...createdPromotion,
        productName: createdPromotion.product?.name || "Producto no disponible",
      };
      setPromotions((prev) => [...prev, formattedPromotion]);
      setFilteredPromotions((prev) => [...prev, formattedPromotion]);
      setNewPromotion({
        name: "",
        description: "",
        discount: "",
        duration: "",
        productId: "",
      });
      alert("Promoción creada exitosamente.");
    } catch (err) {
      console.error("Error al crear promoción:", err.message);
      alert("No se pudo crear la promoción.");
    }
  };

  const handleDeletePromotion = async (promotionId) => {
    if (window.confirm("¿Estás seguro de que deseas eliminar esta promoción?")) {
      try {
        await adminService.deletePromotion(promotionId);
        setPromotions((prev) => prev.filter((promotion) => promotion.id !== promotionId));
        setFilteredPromotions((prev) => prev.filter((promotion) => promotion.id !== promotionId));
        alert("Promoción eliminada exitosamente.");
      } catch (err) {
        console.error("Error al eliminar promoción:", err.message);
        alert("No se pudo eliminar la promoción.");
      }
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewPromotion((prev) => ({ ...prev, [name]: value }));
  };

  const currentPromotions = filteredPromotions?.length
    ? filteredPromotions.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
      )
    : [];

  const totalPages = Math.ceil(filteredPromotions.length / itemsPerPage);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  if (loading) {
    return <p className="text-center">Cargando promociones...</p>;
  }

  return (
    <div className="container promotion-management my-5">
      <h1 className="text-center mb-4 text-primary">Gestión de Promociones</h1>

      {error && <div className="alert alert-danger">{error}</div>}

      <div className="search-bar mb-4">
        <input
          type="text"
          className="form-control"
          placeholder="Buscar promociones..."
          value={searchTerm}
          onChange={handleSearch}
        />
      </div>

      <div className="add-promotion mb-4">
        <h4>Añadir Nueva Promoción</h4>
        <div className="row">
          <input
            type="text"
            name="name"
            value={newPromotion.name}
            placeholder="Nombre"
            onChange={handleChange}
            className="form-control mb-2"
          />
          <input
            type="text"
            name="description"
            value={newPromotion.description}
            placeholder="Descripción"
            onChange={handleChange}
            className="form-control mb-2"
          />
          <input
            type="number"
            name="discount"
            value={newPromotion.discount}
            placeholder="Descuento (%)"
            onChange={handleChange}
            className="form-control mb-2"
          />
          <input
            type="number"
            name="duration"
            value={newPromotion.duration}
            placeholder="Duración (horas)"
            onChange={handleChange}
            className="form-control mb-2"
          />
          <input
            type="number"
            name="productId"
            value={newPromotion.productId}
            placeholder="ID del Producto"
            onChange={handleChange}
            className="form-control mb-2"
          />
          <button className="btn btn-success" onClick={handleAddPromotion}>
            <FaPlus /> Añadir Promoción
          </button>
        </div>
      </div>

      {filteredPromotions.length === 0 ? (
        <p className="text-center">No se encontraron promociones.</p>
      ) : (
        <>
          <table className="table table-striped table-hover">
            <thead>
              <tr>
                <th>ID</th>
                <th>Nombre</th>
                <th>Descripción</th>
                <th>Producto</th>
                <th>Descuento</th>
                <th>Duración</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {currentPromotions.map((promotion) => (
                <tr key={promotion.id}>
                  <td>{promotion.id}</td>
                  <td>{promotion.name}</td>
                  <td>{promotion.description}</td>
                  <td>{promotion.productName}</td>
                  <td>{promotion.discount}%</td>
                  <td>{promotion.duration} horas</td>
                  <td>
                    <button
                      className="btn btn-danger btn-sm"
                      onClick={() => handleDeletePromotion(promotion.id)}
                    >
                      <FaTrashAlt /> Eliminar
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="pagination">
            {[...Array(totalPages)].map((_, index) => (
              <button
                key={index}
                className={`btn ${currentPage === index + 1 ? "btn-primary" : "btn-light"}`}
                onClick={() => handlePageChange(index + 1)}
              >
                {index + 1}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default PromotionManagement;