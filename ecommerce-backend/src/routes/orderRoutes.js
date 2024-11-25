const express = require('express');
const { protect, admin } = require('../middleware/authMiddleware');
const {
  createOrder,
  cancelOrder,
  updateOrderStatus,
  listOrders,
  getOrderDetails,
} = require('../controllers/orderController');

const router = express.Router();

// Rutas para los pedidos
router.post('/', protect, createOrder);
router.patch('/:id/cancel', protect, cancelOrder);
router.patch('/:id/status', protect, admin, updateOrderStatus);
router.get('/', protect, listOrders);
router.get('/:id', protect, getOrderDetails);

module.exports = router;
