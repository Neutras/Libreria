const express = require('express');
const { registerUser, loginUser, getUserPoints } = require('../controllers/userController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

// Ruta para registrar un nuevo usuario
router.post('/register', registerUser);

// Ruta para iniciar sesión
router.post('/login', loginUser);

// Ruta protegida de perfil
router.get('/profile', protect, (req, res) => {
  res.status(200).json({
    message: 'Acceso permitido. Datos del usuario autenticado:',
    user: req.user, // Esto asume que el middleware "protect" asigna "req.user"
  });
});

// Ruta para ver puntos
router.get('/points', protect, getUserPoints);

module.exports = router;
