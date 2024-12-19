const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Registrar un nuevo usuario
const registerUser = async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ error: 'Todos los campos son obligatorios.' });
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
      },
    });

    res.status(201).json({
      message: 'Usuario registrado exitosamente.',
      user: {
        id: newUser.id,
        name: newUser.name,
        email: newUser.email,
      },
    });
  } catch (error) {
    if (error.code === 'P2002') {
      return res.status(400).json({ error: 'El correo ya está registrado.' });
    }
    res.status(500).json({ error: 'Error al registrar el usuario.' });
  }
};

// Iniciar sesión de un usuario
const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return res.status(404).json({ error: 'Correo o contraseña incorrectos.' });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ error: 'Correo o contraseña incorrectos.' });
    }

    const token = jwt.sign(
      { id: user.id, name: user.name, email: user.email, role: user.role },
      process.env.JWT_SECRET || 'default_secret',
      { expiresIn: '1h' }
    );

    res.status(200).json({
      message: 'Inicio de sesión exitoso.',
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    res.status(500).json({ error: 'Error al iniciar sesión.' });
  }
};

// Obtener puntos del usuario actual
const getUserPoints = async (req, res) => {
  try {
    const userId = req.user.id;
    const user = await prisma.user.findUnique({ where: { id: userId } });

    if (!user) {
      return res.status(404).json({ error: 'Usuario no encontrado.' });
    }

    res.status(200).json({ points: user.points });
  } catch (error) {
    console.error('Error al obtener puntos del usuario:', error.message);
    res.status(500).json({ error: 'Error al obtener puntos del usuario.' });
  }
};

// Obtener puntos de un usuario específico (solo para administradores)
const getUserPointsByAdmin = async (req, res) => {
  const { userId } = req.params;

  try {
    const user = await prisma.user.findUnique({ where: { id: parseInt(userId) } });

    if (!user) {
      return res.status(404).json({ error: 'Usuario no encontrado.' });
    }

    res.status(200).json({ points: user.points });
  } catch (error) {
    console.error('Error al obtener puntos del usuario por admin:', error.message);
    res.status(500).json({ error: 'Error al obtener puntos del usuario.' });
  }
};

// Actualizar puntos del usuario (por eventos del sistema)
const updateUserPoints = async (userId, points, operation = 'increment') => {
  try {
    const updateData =
      operation === 'increment' ? { increment: points } : { decrement: points };

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: { points: updateData },
    });

    return updatedUser;
  } catch (error) {
    console.error('Error al actualizar puntos del usuario:', error.message);
    throw new Error('Error al actualizar puntos del usuario.');
  }
};

// Obtener perfil del usuario actual
const getUserProfile = async (req, res) => {
  try {
    const userId = req.user.id;

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        name: true,
        email: true,
        points: true,
      },
    });

    if (!user) {
      return res.status(404).json({ error: 'Usuario no encontrado.' });
    }

    res.status(200).json(user);
  } catch (error) {
    console.error('Error al obtener el perfil del usuario:', error.message);
    res.status(500).json({ error: 'Error al obtener el perfil del usuario.' });
  }
};

// Obtener lista de todos los usuarios (solo para administradores)
const getAllUsers = async (req, res) => {
  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        points: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    res.status(200).json({ users });
  } catch (error) {
    console.error('Error al obtener usuarios:', error.message);
    res.status(500).json({ error: 'Error al obtener usuarios.' });
  }
};

/**
 * Eliminar un usuario.
 */
const deleteUser = async (req, res) => {
  const { id } = req.params;

  try {
    const user = await prisma.user.findUnique({ where: { id: parseInt(id) } });

    if (!user) {
      return res.status(404).json({ error: "Usuario no encontrado." });
    }

    // Eliminar pedidos relacionados
    await prisma.order.deleteMany({ where: { userId: parseInt(id) } });

    // Eliminar usuario
    await prisma.user.delete({ where: { id: parseInt(id) } });

    res.status(200).json({ message: "Usuario eliminado exitosamente." });
  } catch (error) {
    console.error("Error al eliminar usuario:", error.message);
    res.status(500).json({ error: "Error al eliminar usuario." });
  }
};

/**
 * Editar un usuario.
 */
const editUser = async (req, res) => {
  const { id } = req.params;
  const { name, email, role } = req.body;

  try {
    const user = await prisma.user.findUnique({ where: { id: parseInt(id) } });

    if (!user) {
      return res.status(404).json({ error: "Usuario no encontrado." });
    }

    const updatedUser = await prisma.user.update({
      where: { id: parseInt(id) },
      data: { name, email, role },
    });

    res.status(200).json({ message: "Usuario actualizado exitosamente.", user: updatedUser });
  } catch (error) {
    console.error("Error al actualizar usuario:", error.message);
    res.status(500).json({ error: "Error al actualizar usuario." });
  }
};

module.exports = {
  registerUser,
  loginUser,
  getUserPoints,
  getUserPointsByAdmin,
  updateUserPoints,
  getUserProfile,
  getAllUsers,
  deleteUser,
  editUser
};
