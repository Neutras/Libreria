const express = require('express');
const { protect } = require('../middleware/authMiddleware');
const { createOrder } = require('../controllers/orderController');

const router = express.Router();

// Ruta para crear un pedido
router.post('/', protect, createOrder);

module.exports = router;
