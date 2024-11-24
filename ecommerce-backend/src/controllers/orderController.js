const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const createOrder = async (req, res) => {
    const { products } = req.body;
  
    if (!products || !Array.isArray(products) || products.length === 0) {
      return res.status(400).json({ error: 'Debes incluir productos en el pedido.' });
    }
  
    try {
      // Verificar los productos en el inventario y calcular el total
      let total = 0;
  
      for (const product of products) {
        const productData = await prisma.product.findUnique({
          where: { id: product.productId },
        });
  
        if (!productData) {
          return res.status(404).json({ error: `Producto con ID ${product.productId} no encontrado.` });
        }
  
        if (productData.stock < product.quantity) {
          return res.status(400).json({
            error: `Stock insuficiente para el producto "${productData.name}".`,
          });
        }
  
        total += productData.price * product.quantity;
      }
  
      // Calcular los puntos acumulados
      let points = 0;
      if (total >= 4000) {
        points = Math.floor(total / 100);
      }
  
      // Crear el pedido
      const order = await prisma.order.create({
        data: {
          userId: req.user.id,
          total,
          points,
          status: 'Pending',
          products: {
            create: products.map((product) => ({
              productId: product.productId,
              quantity: product.quantity,
            })),
          },
        },
        include: {
          products: true,
        },
      });
  
      // Actualizar los puntos del usuario
      await prisma.user.update({
        where: { id: req.user.id },
        data: {
          points: { increment: points },
        },
      });
  
      // Actualizar el stock de los productos
      for (const product of products) {
        await prisma.product.update({
          where: { id: product.productId },
          data: { stock: { decrement: product.quantity } },
        });
      }
  
      res.status(201).json({
        message: 'Pedido creado exitosamente.',
        order,
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Error al crear el pedido.' });
    }
  };
  

module.exports = {
  createOrder, // Asegúrate de exportar esta función
};
