const io = require('socket.io-client');

// Conéctate al servidor
const socket = io('http://localhost:4000'); // Cambia el puerto si es necesario

// Mensaje cuando te conectas al servidor
socket.on('connect', () => {
  console.log(`Conectado al servidor Socket.IO con ID: ${socket.id}`);
});

// Escucha los eventos de bajo stock
socket.on('low-stock', (data) => {
  console.log(`Alerta de bajo stock recibida: ${data.message}`);
});

// Manejo de desconexiones
socket.on('disconnect', () => {
  console.log('Desconectado del servidor Socket.IO');
});
