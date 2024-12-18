const cron = require('node-cron');
const { PrismaClient } = require('@prisma/client');
const updateHotProducts = require('./utils/updateHotProducts');
const prisma = new PrismaClient();

/**
 * Tarea programada para eliminar promociones expiradas.
 */
const deleteExpiredPromotions = () => {
  cron.schedule('0 * * * *', async () => {
    console.log('Eliminando promociones expiradas...');
    try {
      const deletedCount = await prisma.promotion.deleteMany({
        where: {
          expiresAt: { lte: new Date() },
        },
      });
      console.log(`Promociones expiradas eliminadas: ${deletedCount.count}`);
    } catch (error) {
      console.error('Error al eliminar promociones expiradas:', error);
    }
  });
};

/**
 * Tarea programada para recalcular productos "HOT".
 * Usa la función `updateHotProducts`.
 */
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

/**
 * Tarea programada para verificar productos con bajo stock.
 */
const checkLowStockCron = () => {
  cron.schedule('0 12 * * *', async () => { // Se ejecuta diariamente a las 12 p.m.
    console.log('Verificando productos con bajo stock...');
    try {
      const lowStockProducts = await prisma.product.findMany({
        where: { stock: { lt: 10 } },
      });

      if (lowStockProducts.length > 0) {
        for (const product of lowStockProducts) {
          const existingAlert = await prisma.alert.findFirst({
            where: {
              productId: product.id,
              message: `El producto "${product.name}" tiene bajo stock.`,
              resolved: false,
            },
          });

          if (!existingAlert) {
            await prisma.alert.create({
              data: {
                productId: product.id,
                message: `El producto "${product.name}" tiene bajo stock.`,
                role: 'admin',
              },
            });
          }
        }
        console.log('Alertas de bajo stock actualizadas.');
      } else {
        console.log('No se encontraron productos con bajo stock.');
      }
    } catch (error) {
      console.error('Error verificando bajo stock:', error.message);
    }
  });
};

/**
 * Inicializa todas las tareas programadas.
 */
const initializeCronJobs = () => {
  deleteExpiredPromotions();
  updateHotProductsCron();
  checkLowStockCron();
};

module.exports = { initializeCronJobs };