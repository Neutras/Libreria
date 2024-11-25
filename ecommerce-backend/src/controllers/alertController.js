const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const getAlerts = async (req, res) => {
  try {
    const alerts = await prisma.inventoryAlert.findMany({
      where: { isResolved: false },
      include: { product: true },
    });
    res.json(alerts);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener alertas de inventario.' });
  }
};

const resolveAlert = async (req, res) => {
  const { id } = req.params;
  try {
    await prisma.inventoryAlert.update({
      where: { id: parseInt(id) },
      data: { isResolved: true },
    });
    res.json({ message: 'Alerta resuelta exitosamente.' });
  } catch (error) {
    res.status(500).json({ message: 'Error al resolver la alerta.' });
  }
};

module.exports = { getAlerts, resolveAlert };