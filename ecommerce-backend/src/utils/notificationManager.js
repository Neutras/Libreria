let io = null;

const setSocketServer = (socketServer) => {
  io = socketServer;
};

const emitToUser = (userId, event, payload) => {
  if (!io) {
    console.error('[NotificationManager] Socket.IO no está inicializado.');
    return;
  }
  io.to(`user:${userId}`).emit(event, payload);
  console.log(`[NotificationManager] Emitiendo evento "${event}" al usuario ${userId}`);
};

const emitToRole = (role, event, payload) => {
  if (!io) {
    console.error('[NotificationManager] Socket.IO no está inicializado.');
    return;
  }
  io.to(role).emit(event, payload);
  console.log(`[NotificationManager] Emitiendo evento "${event}" al rol ${role}`);
};

module.exports = {
  setSocketServer,
  emitToUser,
  emitToRole,
};
