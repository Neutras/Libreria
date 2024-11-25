const cron = require('node-cron');
const { PrismaClient } = require('@prisma/client');
const updateHotProducts = require('./utils/updateHotProducts');
const prisma = new PrismaClient();

// Función para eliminar promociones expiradas
const deleteExpiredPromotions = () => {
  cron.schedule('0 * * * *', async () => {
    console.log('Eliminando promociones expiradas...');
    try {
      await prisma.promotion.deleteMany({
        where: {
          expiresAt: { lte: new Date() },
        },
      });
      console.log('Promociones expiradas eliminadas.');
    } catch (error) {
      console.error('Error al eliminar promociones expiradas:', error);
    }
  });
};

const updateHotProductsCron = () => {
  cron.schedule('0 3 * * *', async () => { // Se ejecuta diariamente a las 3 a.m.
    console.log('Actualizando productos HOT...');
    try {
      await updateHotProducts();
    } catch (error) {
      console.error('Error al actualizar productos HOT:', error);
    }
  });
};


// Función para recalcular productos "HOT"
const recalculateHotProducts = () => {
  cron.schedule('0 0 * * *', async () => {
    console.log('Recalculando productos "HOT"...');
    try {
      const products = await prisma.product.findMany();
      for (const product of products) {
        const promotions = await prisma.promotion.findMany({
          where: {
            productId: product.id,
            discount: { gte: 20 },
          },
        });
        const isHot = promotions.length > 0;
        await prisma.product.update({
          where: { id: product.id },
          data: { isHot },
        });
      }
      console.log('Productos "HOT" recalculados.');
    } catch (error) {
      console.error('Error al recalcular productos "HOT":', error);
    }
  });
};

// Función para verificar bajo stock y emitir alertas
const checkLowStockCron = (io) => {
  cron.schedule('*/5 * * * *', async () => {
    console.log('Verificando productos con bajo stock...');
    try {
      const lowStockProducts = await prisma.product.findMany({
        where: {
          stock: { lte: 5 },
        },
      });

      if (lowStockProducts.length > 0) {
        io.emit('low-stock-alert', lowStockProducts);
        console.log('Alertas de bajo stock enviadas:', lowStockProducts.map(p => p.name));
      }
    } catch (error) {
      console.error('Error verificando bajo stock:', error);
    }
  });
};

// Inicializar tareas programadas
const initializeCronJobs = (io) => {
  deleteExpiredPromotions();
  recalculateHotProducts();
  checkLowStockCron(io);
  updateHotProductsCron();
};

module.exports = { initializeCronJobs };
