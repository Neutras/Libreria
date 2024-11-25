const express = require('express');
const { protect, admin } = require('../middleware/authMiddleware');
const { createOrder, 
        getOrders, 
        updateOrderStatus,
        deleteOrder,
        setSocketIO,
        cancelOrder,
        getAllOrders
    } = require("../controllers/orderController");

    const router = express.Router();

    let ioInstance;
    
    const initSocketIO = (io) => {
      ioInstance = io;
      setSocketIO(io); // Pasar la instancia de Socket.IO al controlador
    };

// Rutas
router.post('/', protect, createOrder); // Crear pedido
router.get('/', protect, getOrders); // Listar pedidos del usuario autenticado
router.put('/:id', protect, admin, updateOrderStatus); // Actualizar estado de pedido (solo admin)
router.delete('/:id', protect, admin, deleteOrder); // Eliminar pedido (opcional, solo admin)
router.put('/:id/cancel', protect, cancelOrder); // Ruta para cancelar pedido
router.get('/all', protect, admin, getAllOrders); // Ruta para listar todos los pedidos o filtrar por usuario


module.exports = { router, initSocketIO };
