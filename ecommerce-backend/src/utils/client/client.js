const io = require('socket.io-client');

// Configuración del cliente
const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MTAwLCJyb2xlIjoidXNlciIsImlhdCI6MTczMjY3Mjk4NSwiZXhwIjoxNzMyNjc2NTg1fQ.j9szaxsXPQTTOgVbPU4Li_6U1Ta0bg6SU9XEJbL0RRk'; // Reemplaza con un token válido
const socket = io('http://localhost:4000', {
  auth: {
    token, // Enviar el token para autenticación
  },
  reconnectionAttempts: 5, // Intentar reconectar 5 veces
  reconnectionDelay: 2000, // Esperar 2 segundos entre intentos
});

// Conexión exitosa
socket.on('connect', () => {
  console.log(`[Socket.IO] Conectado al servidor con ID: ${socket.id}`);
});

// Escucha las notificaciones
socket.on('notification', (data) => {
  const notification = typeof data === 'string' ? JSON.parse(data) : data;
  console.log(`[Notificación] Evento: ${notification.event} | Mensaje: ${notification.message}`);
});


// Notificación específica: Pedido creado
socket.on('order-created', (data) => {
  console.log(`[Socket.IO] Notificación de pedido creado: ${data.message}`);
});

// Notificación específica: Pedido creado
socket.on('order-canceled', (data) => {
  console.log(`[Socket.IO] Notificación de pedido cancelado: ${data.message}`);
});

// Notificación específica: Nuevo pedido para administradores
socket.on('new-order', (data) => {
  console.log(`[Socket.IO] Notificación para administradores: ${data.message}`);
});

// Desconexión
socket.on('disconnect', (reason) => {
  console.log(`[Socket.IO] Desconectado del servidor: ${reason}`);
});

// Reintento de conexión
socket.on('reconnect_attempt', (attempt) => {
  console.log(`[Socket.IO] Intento de reconexión #${attempt}`);
});

// Error en la conexión
socket.on('connect_error', (error) => {
  console.error(`[Socket.IO] Error en la conexión: ${error.message}`);
});