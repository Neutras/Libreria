const express = require('express');
const { protect, admin } = require('../middleware/authMiddleware');
const { 
    addPromotion, 
    getPromotions, 
    deletePromotion // Asegúrate de que deletePromotion esté implementado en el controlador
    } = require('../controllers/promotionController');

const router = express.Router();

// Rutas
router.post('/', protect, admin, addPromotion); // Crear promoción (solo admin)
router.get('/', getPromotions); // Listar promociones activas
router.delete('/:id', protect, admin, deletePromotion); // Eliminar promociones activas

module.exports = router;
