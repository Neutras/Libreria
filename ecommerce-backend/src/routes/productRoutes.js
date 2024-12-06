const express = require('express');
const { protect, admin } = require('../middleware/authMiddleware');
const { 
    createProduct, 
    getProducts, 
    getProductById, 
    updateProduct, 
    deleteProduct, 
    toggleHotStatus,
    getRecommendations,
    getCategories
} = require('../controllers/productController');

const router = express.Router();

// Rutas

router.post('/', protect, admin, createProduct);// Crear producto (solo admin)
router.get('/', getProducts); // Listar productos
router.get('/recommendations', protect, getRecommendations); // Obtener recomendaciones de productos
router.put('/:id', protect, admin, updateProduct); // Actualizar producto (solo admin)
router.delete('/:id', protect, admin, deleteProduct); // Eliminar producto (solo admin)
router.patch('/hot', protect, admin, toggleHotStatus); // Cambiar estado HOT (solo admin)
router.get("/categories", getCategories); // Obtener categorías únicas
router.get('/:id', getProductById);






module.exports = router;
