const express = require("express");
const {
  createProduct,
  getProducts,
  updateProduct,
  deleteProduct,
} = require("../controllers/productController");
const { protect, admin } = require("../middleware/authMiddleware");

const router = express.Router();

// Crear Producto (Solo Administradores)
router.post("/", protect, admin, createProduct);

// Listar Productos
router.get("/", getProducts);

// Editar Producto (Solo Administradores)
router.put("/:id", protect, admin, updateProduct);

// Eliminar Producto (Solo Administradores)
router.delete("/:id", protect, admin, deleteProduct);

module.exports = router;
