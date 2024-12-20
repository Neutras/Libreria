import React, { useState, useEffect } from "react";
import { FaEdit, FaTrashAlt, FaPlus, FaSave } from "react-icons/fa";
import adminService from "../../services/adminService";
import "./ProductManagement.scss";

const ProductManagement = () => {
  const [products, setProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editingProduct, setEditingProduct] = useState(null);
  const [updatedProduct, setUpdatedProduct] = useState({});
  const [newProduct, setNewProduct] = useState({
    name: "",
    description: "",
    price: "",
    stock: "",
    category: "",
    author: "",
  });
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 25;

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const data = await adminService.getProducts();
        setProducts(data);
        setLoading(false);
      } catch (err) {
        console.error("Error al cargar productos:", err.message);
        setError("No se pudieron cargar los productos.");
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const filteredProducts = products.filter((product) =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleEdit = (product) => {
    setEditingProduct(product.id);
    setUpdatedProduct(product);
  };

  const handleSaveEdit = async (productId) => {
    try {
        // Convertir los campos necesarios a números antes de enviarlos
        const updatedData = {
            ...updatedProduct,
            stock: parseInt(updatedProduct.stock, 10), // Convertir a entero
            price: parseFloat(updatedProduct.price),  // Convertir a flotante
        };

        await adminService.updateProduct(productId, updatedData);
        setProducts((prev) =>
            prev.map((product) =>
                product.id === productId ? { ...product, ...updatedData } : product
            )
        );
        setEditingProduct(null);
        alert("Producto actualizado exitosamente.");
    } catch (err) {
        console.error("Error al actualizar producto:", err.message);
        alert("No se pudo actualizar el producto.");
    }
};

  const handleDelete = async (productId) => {
    if (window.confirm("¿Estás seguro de que deseas eliminar este producto?")) {
      try {
        await adminService.deleteProduct(productId);
        setProducts((prev) => prev.filter((product) => product.id !== productId));
        alert("Producto eliminado exitosamente.");
      } catch (err) {
        console.error("Error al eliminar producto:", err.message);
        alert("No se pudo eliminar el producto.");
      }
    }
  };

  const handleAddProduct = async () => {
    try {
        // Convertir stock y price a números antes de enviar al backend
        const productData = {
            ...newProduct,
            stock: parseInt(newProduct.stock, 10), // Convertir a entero
            price: parseFloat(newProduct.price),  // Convertir a flotante
        };

        const createdProduct = await adminService.createProduct(productData);
        setProducts((prev) => [...prev, createdProduct]);
        setNewProduct({
            name: "",
            description: "",
            price: "",
            stock: "",
            category: "",
            author: "",
        });
        alert("Producto creado exitosamente.");
    } catch (err) {
        console.error("Error al crear producto:", err.message);
        alert("No se pudo crear el producto.");
    }
};


  const handleChangeNewProduct = (e) => {
    const { name, value } = e.target;

    // Convertir dinámicamente a números si el campo es stock o price
    const parsedValue = name === "stock" || name === "price" ? value.replace(/[^0-9.]/g, '') : value;

    setNewProduct((prev) => ({
        ...prev,
        [name]: parsedValue,
    }));
};

const handleChangeEditProduct = (e) => {
    const { name, value } = e.target;

    // Convertir los campos `stock` y `price` a números si corresponde
    const parsedValue =
        name === "stock" || name === "price"
            ? value.replace(/[^0-9.]/g, '') // Solo permitir números y puntos
            : value;

    setUpdatedProduct((prev) => ({
        ...prev,
        [name]: parsedValue,
    }));
};



  const currentProducts = filteredProducts.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  if (loading) {
    return <p className="text-center">Cargando productos...</p>;
  }

  return (
    <div className="container product-management my-5">
      <h1 className="text-center mb-4 text-primary">Gestión de Productos</h1>

      {error && <div className="alert alert-danger">{error}</div>}

      <div className="search-bar mb-4">
        <input
          type="text"
          className="form-control"
          placeholder="Buscar productos..."
          value={searchTerm}
          onChange={handleSearch}
        />
      </div>

      <div className="add-product mb-4">
        <h4>Añadir Nuevo Producto</h4>
        <div className="row">
          <input
            type="text"
            name="name"
            value={newProduct.name}
            placeholder="Nombre"
            onChange={handleChangeNewProduct}
            className="form-control mb-2"
          />
          <input
            type="text"
            name="description"
            value={newProduct.description}
            placeholder="Descripción"
            onChange={handleChangeNewProduct}
            className="form-control mb-2"
          />
          <input
            type="number"
            name="price"
            value={newProduct.price}
            placeholder="Precio"
            onChange={handleChangeNewProduct}
            className="form-control mb-2"
          />
          <input
            type="number"
            name="stock"
            value={newProduct.stock}
            placeholder="Stock Inicial"
            onChange={handleChangeNewProduct}
            className="form-control mb-2"
          />
          <input
            type="text"
            name="category"
            value={newProduct.category}
            placeholder="Categoría"
            onChange={handleChangeNewProduct}
            className="form-control mb-2"
          />
          <input
            type="text"
            name="author"
            value={newProduct.author}
            placeholder="Marca"
            onChange={handleChangeNewProduct}
            className="form-control mb-2"
          />
          <button className="btn btn-success" onClick={handleAddProduct}>
            <FaPlus /> Añadir Producto
          </button>
        </div>
      </div>

      {filteredProducts.length === 0 ? (
        <p className="text-center">No se encontraron productos.</p>
      ) : (
        <>
          <table className="table table-striped table-hover">
            <thead>
              <tr>
                <th>ID</th>
                <th>Nombre</th>
                <th>Descripción</th>
                <th>Precio</th>
                <th>Stock</th>
                <th>Categoría</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {currentProducts.map((product) => (
                <tr key={product.id}>
                  <td>{product.id}</td>
                  <td>
                    {editingProduct === product.id ? (
                      <input
                        type="text"
                        name="name"
                        value={updatedProduct.name || ""}
                        onChange={handleChangeEditProduct}
                        className="form-control"
                      />
                    ) : (
                      product.name
                    )}
                  </td>
                  <td>
                    {editingProduct === product.id ? (
                      <input
                        type="text"
                        name="description"
                        value={updatedProduct.description || ""}
                        onChange={handleChangeEditProduct}
                        className="form-control"
                      />
                    ) : (
                      product.description
                    )}
                  </td>
                  <td>
                    {editingProduct === product.id ? (
                      <input
                        type="number"
                        name="price"
                        value={updatedProduct.price || ""}
                        onChange={handleChangeEditProduct}
                        className="form-control"
                      />
                    ) : (
                      `$${product.price.toFixed(2)}`
                    )}
                  </td>
                  <td>
                    {editingProduct === product.id ? (
                      <input
                        type="number"
                        name="stock"
                        value={updatedProduct.stock || ""}
                        onChange={handleChangeEditProduct}
                        className="form-control"
                      />
                    ) : (
                      product.stock
                    )}
                  </td>
                  <td>
                    {editingProduct === product.id ? (
                      <input
                        type="text"
                        name="category"
                        value={updatedProduct.category || ""}
                        onChange={handleChangeEditProduct}
                        className="form-control"
                      />
                    ) : (
                      product.category
                    )}
                  </td>
                  <td>
                    {editingProduct === product.id ? (
                      <>
                        <button
                          className="btn btn-success btn-sm me-2"
                          onClick={() => handleSaveEdit(product.id)}
                        >
                          <FaSave /> Guardar
                        </button>
                      </>
                    ) : (
                      <>
                        <button
                          className="btn btn-info btn-sm me-2"
                          onClick={() => handleEdit(product)}
                        >
                          <FaEdit /> Editar
                        </button>
                        <button
                          className="btn btn-danger btn-sm"
                          onClick={() => handleDelete(product.id)}
                        >
                          <FaTrashAlt /> Eliminar
                        </button>
                      </>
                    )}
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

export default ProductManagement;