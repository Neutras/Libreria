const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Registrar un nuevo usuario
const registerUser = async (req, res) => {
  console.log("Cuerpo de la solicitud recibido:", req.body); // Verifica lo que llega
  console.log("Método:", req.method); // Confirma que es POST
  console.log("Headers:", req.headers); // Revisa el tipo de contenido enviado

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
    console.error('Error al registrar usuario:', error);
    if (error.code === 'P2002') { // Prisma duplicate key error
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

    const token = jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET || 'default_secret', { expiresIn: '1h' });

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
    console.error('Error al iniciar sesión:', error);
    res.status(500).json({ error: 'Error al iniciar sesión.' });
  }
};

module.exports = {
  registerUser,
  loginUser,
};