const express = require('express');
const { getAlerts, resolveAlert } = require('../controllers/alertController');
const { protect, admin } = require('../middleware/authMiddleware');

const router = express.Router();

router.get('/', protect, admin, getAlerts); // Listar alertas
router.patch('/:id/resolve', protect, admin, resolveAlert); // Resolver alerta

module.exports = router;
