const express = require('express');
const { protect, admin } = require('../middleware/authMiddleware');
const { getAlerts, createAlert, deleteAlert } = require('../controllers/alertController');

const router = express.Router();

// Obtener todas las alertas (accesible para admin y usuarios)
router.get('/', protect, getAlerts);

// Crear una nueva alerta (solo admin)
router.post('/', protect, admin, createAlert);

// Eliminar una alerta por ID (solo admin)
router.delete('/:id', protect, admin, deleteAlert);

module.exports = router;
