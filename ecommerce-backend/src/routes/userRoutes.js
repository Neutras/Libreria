const express = require('express');
const { protect, admin } = require('../middleware/authMiddleware');
const { 
  registerUser, 
  loginUser, 
  getUserPoints, 
  getUserPointsByAdmin,
  getUserProfile,
  getAllUsers,
  deleteUser,
  editUser
} = require('../controllers/userController');

const router = express.Router();

// Ruta para registrar un nuevo usuario
router.post('/register', registerUser);

// Ruta para iniciar sesión
router.post('/login', loginUser);

// Ruta para obtener todos los usuarios (admin)
router.get('/all', protect, admin, getAllUsers);

// Ruta protegida para obtener perfil del usuario
router.get('/profile', protect, getUserProfile);

// Ruta para ver puntos del usuario autenticado
router.get('/points', protect, getUserPoints);

// Ruta para obtener puntos de un usuario específico (admin)
router.get('/:userId/points', protect, admin, getUserPointsByAdmin);

// Eliminar usuario
router.delete("/:id", protect, admin, deleteUser);

// Editar usuario
router.patch("/:id", protect, admin, editUser);



module.exports = router;
