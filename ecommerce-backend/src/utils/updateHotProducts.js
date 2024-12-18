const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const fs = require('fs/promises');
const path = require('path');

/**
 * Actualiza los productos marcándolos como "HOT" si tienen un descuento igual o superior al 20% y elimina el estado "HOT" si no cumplen.
 */
async function updateHotProducts() {
  try {
    const logFilePath = path.join(__dirname, '..', 'logs', 'hotProducts.log');

    // Crear el directorio de logs si no existe
    await fs.mkdir(path.dirname(logFilePath), { recursive: true });

    // Obtener todos los productos con sus descuentos
    const allProducts = await prisma.product.findMany({
      include: {
        promotions: {
          select: { discount: true },
        },
      },
    });

    const updatedProducts = [];
    const removedHotStatus = [];

    for (const product of allProducts) {
      const hasValidDiscount = product.promotions.some(promo => promo.discount >= 20);

      if (hasValidDiscount && !product.isHot) {
        // Marcar como HOT si cumple con el criterio
        await prisma.product.update({
          where: { id: product.id },
          data: { isHot: true },
        });
        updatedProducts.push(product.name);
      } else if (!hasValidDiscount && product.isHot) {
        // Quitar estado HOT si no cumple con el criterio
        await prisma.product.update({
          where: { id: product.id },
          data: { isHot: false },
        });
        removedHotStatus.push(product.name);
      }
    }

    // Preparar mensaje de log
    let logMessage = `${new Date().toISOString()} - Actualización de estado HOT:\n`;
    if (updatedProducts.length > 0) {
      logMessage += `  - Marcados como HOT: ${updatedProducts.join(', ')}\n`;
    }
    if (removedHotStatus.length > 0) {
      logMessage += `  - Estado HOT eliminado: ${removedHotStatus.join(', ')}\n`;
    }
    if (updatedProducts.length === 0 && removedHotStatus.length === 0) {
      logMessage += `  - No se encontraron cambios necesarios.\n`;
    }

    // Escribir en el archivo de log
    await fs.appendFile(logFilePath, logMessage);

    console.log('[updateHotProducts] Actualización completada:', {
      updatedProducts,
      removedHotStatus,
    });
  } catch (err) {
    console.error('[updateHotProducts] Error:', err.message);
  }
}

module.exports = updateHotProducts;