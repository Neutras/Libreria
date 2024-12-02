const express = require('express');
const { protect, admin } = require('../middleware/authMiddleware');
const router = express.Router();
const {
  getTopProducts,
  getTopCategories,
  getRevenueByPeriod,
  getActiveCustomers,
  getMetricsSummary,
} = require('../controllers/metricController');

router.get('/top-products', protect, admin, getTopProducts); // Productos más vendidos
router.get('/top-categories', protect, admin, getTopCategories); // Categorías más vendidas
router.get('/revenue', protect, admin, getRevenueByPeriod); // Ingresos por período
router.get('/active-customers', protect, admin, getActiveCustomers); // Clientes más activos
router.get('/', protect, admin, getMetricsSummary); // Resumen general de métricas

module.exports = router;