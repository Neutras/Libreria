const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();


/**
 * Obtener todas las alertas visibles para el usuario actual.
*/
const getAlerts = async (req, res) => {
  try {
    const alerts = await prisma.alert.findMany({
      orderBy: { createdAt: 'desc' }, // Ordenar por las alertas más recientes
    });

    res.status(200).json({ alerts });
  } catch (error) {
    console.error('Error al obtener alertas:', error.message);
    res.status(500).json({ error: 'Error al obtener alertas.' });
  }
};

/**
 * Crear una nueva alerta.
*/
const createAlert = async (req, res) => {
  const { message, role } = req.body;

  try {
    const alert = await prisma.alert.create({
      data: {
        message,
        role, // Puede ser null, 'user' o 'admin'
        createdAt: new Date(),
      },
    });

    // Emitir notificación en tiempo real
    req.io.emit('new-alert', { message: `Nueva alerta: ${alert.message}` });

    res.status(201).json({ alert });
  } catch (error) {
    console.error('Error al crear alerta:', error);
    res.status(500).json({ error: 'Error al crear la alerta.' });
  }
};

/**
 * Eliminar una alerta por su ID.
*/
const deleteAlert = async (req, res) => {
  const { id } = req.params;

  try {
    await prisma.alert.delete({
      where: { id: parseInt(id) },
    });

    res.status(200).json({ message: 'Alerta eliminada exitosamente.' });
  } catch (error) {
    console.error('Error al eliminar alerta:', error);
    res.status(500).json({ error: 'Error al eliminar la alerta.' });
  }
};

module.exports = { getAlerts, createAlert, deleteAlert };