const jwt = require('jsonwebtoken');
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

/**
 * Middleware para autenticar al usuario usando JSON Web Tokens (JWT).
 * @param {string[]} roles - Lista de roles permitidos para acceder a la ruta.
 */
const protect = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      // Obtener el token de los headers
      token = req.headers.authorization.split(' ')[1];

      // Verificar el token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Obtener el usuario correspondiente
      req.user = await prisma.user.findUnique({
        where: { id: decoded.id },
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
          points: true,
        },
      });

      if (!req.user) {
        return res.status(401).json({ error: 'Usuario no encontrado.' });
      }

      next();
    } catch (error) {
      console.error(error);
      res.status(401).json({ error: 'No autorizado. Token no válido.' });
    }
  } else {
    res.status(401).json({ error: 'No autorizado. Token no encontrado.' });
  }
};

/**
 * Middleware para verificar roles específicos.
 * @param {string[]} roles - Lista de roles permitidos para acceder a la ruta.
 */
const admin = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    next();
  } else {
    res.status(403).json({ error: 'Acceso denegado. Se requiere rol de administrador.' });
  }
};

module.exports = { protect, admin };
