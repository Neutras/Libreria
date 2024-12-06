import React, { useState } from "react";
import Button from "./Button";
import "./Categories.scss";

const Categories = ({ categories = [], onCategorySelect, onReset }) => {
  const [selectedCategory, setSelectedCategory] = useState(null);

  const handleCategorySelect = (category) => {
    const newCategory = category === selectedCategory ? null : category;
    setSelectedCategory(newCategory);
    onCategorySelect(newCategory);
  };

  const handleResetFilters = () => {
    setSelectedCategory(null);
    onCategorySelect(null); // Informar que no hay categoría seleccionada
    onReset(); // Llamar a la función de reinicio de filtros
  };

  return (
    <div className="categories-container">
      {/* Botones de categorías */}
      <div className="d-flex flex-wrap gap-2 justify-content-center mb-3">
        {categories.map((category) => (
          <Button
            key={category}
            className={`btn btn-outline-primary ${
              selectedCategory === category ? "active" : ""
            }`}
            onClick={() => handleCategorySelect(category)}
          >
            {category}
          </Button>
        ))}
      </div>

      {/* Botón para reiniciar filtros */}
      <div className="text-center">
        <Button
          className="btn btn-outline-danger"
          onClick={handleResetFilters}
        >
          <i className="bi bi-x-circle"></i> Reiniciar filtros
        </Button>
      </div>
    </div>
  );
};

export default Categories;