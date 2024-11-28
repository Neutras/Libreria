const express = require('express');
const { protect, admin } = require('../middleware/authMiddleware');
const { 
    createProduct, 
    getProducts, 
    getProductById, 
    updateProduct, 
    deleteProduct, 
    toggleHotStatus,
    getHotProducts,
} = require('../controllers/productController');

const router = express.Router();

// Rutas

router.post('/', protect, admin, createProduct);// Crear producto (solo admin)
router.get('/', getProducts); // Listar productos
router.get('/:id', getProductById); // Obtener producto por ID
router.put('/:id', protect, admin, updateProduct); // Actualizar producto (solo admin)
router.delete('/:id', protect, admin, deleteProduct); // Eliminar producto (solo admin)
router.patch('/hot', protect, admin, toggleHotStatus); // Cambiar estado HOT (solo admin)


module.exports = router;
