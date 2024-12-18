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

/**
 * @route GET /api/metrics/top-products
 * @description Obtiene los productos más vendidos por cantidad e ingresos.
 * @access Admin
 */
router.get('/top-products', protect, admin, getTopProducts);

/**
 * @route GET /api/metrics/top-categories
 * @description Obtiene las categorías más vendidas por cantidad e ingresos.
 * @access Admin
 */
router.get('/top-categories', protect, admin, getTopCategories);

/**
 * @route GET /api/metrics/revenue
 * @description Obtiene los ingresos agrupados por períodos (día, semana, mes).
 * @query {string} period - Período de agrupación ('day', 'week', 'month').
 * @query {string} startDate - Fecha de inicio (opcional).
 * @query {string} endDate - Fecha de fin (opcional).
 * @access Admin
 */
router.get('/revenue', protect, admin, getRevenueByPeriod);

/**
 * @route GET /api/metrics/active-customers
 * @description Obtiene los clientes más activos por número de pedidos realizados.
 * @access Admin
 */
router.get('/active-customers', protect, admin, getActiveCustomers);

/**
 * @route GET /api/metrics
 * @description Obtiene un resumen general de las métricas del sistema.
 * @access Admin
 */
router.get('/', protect, admin, getMetricsSummary);

module.exports = router;