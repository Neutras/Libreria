const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const http = require('http');
const { Server } = require('socket.io');
const userRoutes = require('./routes/userRoutes');
const productRoutes = require('./routes/productRoutes');
const { router: orderRoutes, initSocketIO } = require('./routes/orderRoutes'); // Corregido
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
    methods: ['GET', 'POST', 'PUT', 'DELETE']
  }
});

// Middleware para compartir io
app.use((req, res, next) => {
  req.io = io;
  next();
});

// Middleware general
app.use(cors());
app.use(express.json());

// Ruta de prueba
app.get('/', (req, res) => {
  res.send('Bienvenido a la API de E-commerce');
});

// Rutas
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

// Inicializar tareas programadas
initializeCronJobs(io);

// Iniciar servidor
const PORT = process.env.PORT || 4000;
server.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
