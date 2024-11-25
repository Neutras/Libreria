const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
const http = require('http');
const { Server } = require('socket.io');
const { setSocketServer } = require('./utils/notificationManager');
const userRoutes = require('./routes/userRoutes');
const productRoutes = require('./routes/productRoutes');
const orderRoutes = require('./routes/orderRoutes');
const promotionRoutes = require('./routes/promotionRoutes');
const { initializeCronJobs } = require('./cronJobs');
const alertRoutes = require('./routes/alertRoutes');

// Configuración de variables de entorno
dotenv.config();

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
  },
});

// Middleware para inyectar Socket.IO
app.use((req, res, next) => {
  req.io = io; // Asignar el objeto io al objeto req
  next();
});

// Configurar Socket.IO en notificationManager
setSocketServer(io);

// Middleware general
app.use(cors());
app.use(express.json());

// Rutas
app.get('/', (req, res) => {
  res.send('Bienvenido a la API de E-commerce');
});

app.use('/api/users', userRoutes);
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/promotions', promotionRoutes);
app.use('/api/alerts', alertRoutes);

// Manejo de rutas no encontradas
app.use((req, res, next) => {
  res.status(404).json({ error: 'Ruta no encontrada' });
});

// Manejo de errores generales
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Error interno del servidor' });
});

// Socket.IO: Manejo de conexiones
io.on('connection', (socket) => {
  const token = socket.handshake.auth.token;

  if (!token) {
    console.log('[Socket.IO] Cliente conectado sin token');
    socket.emit('error', { message: 'Autenticación requerida' });
    socket.disconnect(); // Desconectar cliente no autenticado
    return;
  }

  try {
    const user = jwt.verify(token, process.env.JWT_SECRET || 'default_secret');
    const userRole = user.role;
    const userId = user.id;

    // Asociar el socket con roles y usuarios
    socket.join(userRole);
    socket.join(`user:${userId}`);

    console.log(`[Socket.IO] Cliente conectado con ID: ${socket.id}, Rol: ${userRole}, Usuario: ${userId}`);

    // Eventos de ejemplo (pueden ser eliminados o modificados según necesidades)
    socket.on('example-event', (data) => {
      console.log(`[Socket.IO] Evento recibido del cliente ${userId}:`, data);
    });

    socket.on('disconnect', () => {
      console.log(`[Socket.IO] Cliente desconectado con ID: ${socket.id}`);
    });
  } catch (error) {
    console.error('[Socket.IO] Error en autenticación del cliente:', error.message);
    socket.emit('error', { message: 'Autenticación inválida' });
    socket.disconnect();
  }
});

// Inicializar tareas programadas
initializeCronJobs(io);

// Iniciar servidor
const PORT = process.env.PORT || 4000;
server.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
