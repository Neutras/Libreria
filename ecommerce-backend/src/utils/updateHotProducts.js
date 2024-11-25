const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const fs = require('fs');
const path = require('path');

/**
 * Actualiza los productos marcándolos como "HOT" según criterios específicos y registra las actualizaciones.
 */
async function updateHotProducts() {
  try {
    const logFilePath = path.join(__dirname, '..', 'logs', 'hotProducts.log');

    // Verificar si el directorio de logs existe, y crearlo si no.
    if (!fs.existsSync(path.dirname(logFilePath))) {
      fs.mkdirSync(path.dirname(logFilePath), { recursive: true });
    }

    // Buscar productos que cumplan con los criterios de "HOT".
    const hotProducts = await prisma.product.findMany({
      where: {
        OR: [
          { promotions: { some: { discount: { gt: 20 } } } },
          { orders: { some: { createdAt: { gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) } } } },
        ],
      },
    });

    const updatedProducts = [];
    for (const product of hotProducts) {
      if (!product.isHot) {
        await prisma.product.update({
          where: { id: product.id },
          data: { isHot: true },
        });
        updatedProducts.push(product.name);
      }
    }

    // Preparar mensaje de log
    const logMessage = updatedProducts.length > 0
      ? `${new Date().toISOString()} - Productos actualizados como HOT: ${updatedProducts.join(', ')}\n`
      : `${new Date().toISOString()} - No se encontraron productos para actualizar como HOT.\n`;

    // Escribir en el archivo de log
    fs.appendFile(logFilePath, logMessage, (err) => {
      if (err) console.error('Error al escribir el log de productos HOT:', err);
    });

    console.log('[updateHotProducts] Productos actualizados como HOT:', updatedProducts);
  } catch (err) {
    console.error('[updateHotProducts] Error:', err.message);
  }
}

module.exports = updateHotProducts;
