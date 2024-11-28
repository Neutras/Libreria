const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();


// Crear o actualizar una promoción
const addPromotion = async (req, res) => {
    try {
        const { productId, discount, duration } = req.body;

        // Validar datos de entrada
        if (!productId || !discount || !duration) {
            return res.status(400).json({ error: 'Todos los campos son obligatorios.' });
        }

        // Calcular la fecha de expiración
        const expiresAt = new Date();
        expiresAt.setHours(expiresAt.getHours() + duration);

        // Crear o actualizar la promoción
        const promotion = await prisma.promotion.upsert({
            where: { productId },
            update: {
                discount,
                duration,
                expiresAt,
            },
            create: {
                productId,
                discount,
                duration,
                expiresAt,
            },
        });

        // Recalcular el estado HOT del producto
        const isHot = discount >= 20; // Verificar si el descuento cumple el criterio
        await prisma.product.update({
            where: { id: productId },
            data: { isHot },
        });

        return res.status(201).json({
            message: 'Promoción creada o actualizada exitosamente y estado HOT actualizado.',
            promotion,
        });
    } catch (error) {
        console.error('Error al crear la promoción:', error);
        return res.status(500).json({ error: 'Error al crear la promoción.' });
    }
};

// Eliminar Promociones Expiradas
const cleanExpiredPromotions = async () => {
    const now = new Date();

    try {
        await prisma.promotion.deleteMany({
            where: { expiresAt: { lt: now } },
        });
        console.log("Promociones expiradas eliminadas.");
    } catch (error) {
        console.error("Error al limpiar promociones expiradas:", error);
    }
};

// Obtener Promociones
const getPromotions = async (req, res) => {
    try {
        await cleanExpiredPromotions();

        const promotions = await prisma.promotion.findMany({
            include: { product: true },
        });

        return res.status(200).json(promotions);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Error al obtener promociones" });
    }
};

// Eliminar promoción
const deletePromotion = async (req, res) => {
  const { id } = req.params;

  try {
      await prisma.promotion.delete({
          where: { id: parseInt(id) }
      });
      res.status(200).json({ message: 'Promoción eliminada exitosamente.' });
  } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Error al eliminar la promoción.' });
  }
};

module.exports = { addPromotion, getPromotions, deletePromotion };