const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

let io; // Para almacenar la instancia de Socket.IO
const setSocketIO = (socketInstance) => {
  io = socketInstance;
};


/**
 * Crear un nuevo pedido.
 */
const createOrder = async (req, res) => {
  const { products } = req.body; // [{ productId: 1, quantity: 2 }, ...]
  const userId = req.user.id;

  try {
    // Validar los productos y calcular el total del pedido
    let total = 0;

    for (const item of products) {
      const product = await prisma.product.findUnique({
        where: { id: item.productId },
      });

      if (!product) {
        return res.status(404).json({ error: `Producto con ID ${item.productId} no encontrado.` });
      }

      if (product.stock < item.quantity) {
        return res.status(400).json({ error: `Stock insuficiente para el producto ${product.name}.` });
      }

      // Reducir el stock del producto
      await prisma.product.update({
        where: { id: item.productId },
        data: { stock: { decrement: item.quantity } },
      });

      // Sumar al total
      total += product.price * item.quantity;
    }

    // Crear el pedido
    const order = await prisma.order.create({
      data: {
        userId,
        total,
        status: 'Pending',
        products: {
          create: products.map((item) => ({
            productId: item.productId,
            quantity: item.quantity,
          })),
        },
      },
      include: {
        products: true,
      },
    });

    // Actualizar puntos del usuario
    if (total > 4000) {
      const points = Math.floor(total / 100);
      await prisma.user.update({
        where: { id: userId },
        data: { points: { increment: points } },
      });
    }

    // Emitir notificación a los administradores
    req.io.emit('new-order', { message: 'Un nuevo pedido ha sido creado', order });

    res.status(201).json({ message: 'Pedido creado exitosamente.', order });
  } catch (error) {
    console.error('Error al crear el pedido:', error.message);
    res.status(500).json({ error: 'Error al crear el pedido.' });
  }
};





const calculateTotalAndPoints = async (products) => {
  let total = 0;
  let totalPoints = 0;

  for (const item of products) {
    const product = await prisma.product.findUnique({
      where: { id: item.productId },
      include: { promotions: true }, // Incluye la relación con promociones
    });

    if (!product) {
      throw new Error(`Producto con ID ${item.productId} no encontrado.`);
    }

    // Utilizar el precio original para calcular los puntos
    const originalTotal = product.price * item.quantity;
    total += product.promotions.length > 0
      ? product.promotions[0].discount // Aplicar descuento si existe una promoción activa
        ? (product.price * (1 - product.promotions[0].discount / 100)) * item.quantity
        : originalTotal
      : originalTotal;

    // Calcular puntos sobre el precio original
    if (originalTotal > 4000) {
      totalPoints += Math.floor(originalTotal / 100);
    }
  }

  return { total, totalPoints };
};

// Obtener ordenes del usuario
  const getOrders = async (req, res) => {
    try {
        const { role, id } = req.user; // Obtenemos el rol y el ID del usuario autenticado

        let orders;

        if (role === "admin") {
            // Si el usuario es administrador, obtener todos los pedidos
            orders = await prisma.order.findMany({
                include: {
                    user: {
                        select: { id: true, name: true, email: true }, // Mostrar información básica del cliente
                    },
                    products: {
                        include: {
                            product: true, // Mostrar detalles del producto
                        },
                    },
                },
                orderBy: { createdAt: "desc" },
            });
        } else {
            // Si el usuario es cliente, obtener solo sus pedidos
            orders = await prisma.order.findMany({
                where: { userId: id },
                include: {
                    products: {
                        include: {
                            product: true, // Mostrar detalles del producto
                        },
                    },
                },
                orderBy: { createdAt: "desc" },
            });
        }

        return res.status(200).json(orders);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Error al obtener los pedidos" });
    }
};

// Actualizar estado de la órden
const updateOrderStatus = async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  try {
    const order = await prisma.order.findUnique({
      where: { id: parseInt(id) },
      include: { products: { include: { product: true } } },
    });

    if (!order) {
      return res.status(404).json({ error: "Pedido no encontrado" });
    }

    if (status === 'Preparing') {
      // Calcular puntos antes de aplicar descuentos
      const totalBeforeDiscounts = order.products.reduce((sum, item) => {
        return sum + item.product.price * item.quantity;
      }, 0);

      const points = Math.floor(totalBeforeDiscounts / 100); // 1 punto por cada $100
      await prisma.user.update({
        where: { id: order.userId },
        data: { points: { increment: points } },
      });
    }

    // Actualizar estado del pedido
    const updatedOrder = await prisma.order.update({
      where: { id: parseInt(id) },
      data: { status },
    });

    res.status(200).json({ message: "Estado del pedido actualizado", updatedOrder });
  } catch (error) {
    console.error("Error al actualizar el estado del pedido:", error);
    res.status(500).json({ error: "Error al actualizar el estado del pedido" });
  }
};



// Eliminar pedido
const deleteOrder = async (req, res) => {
  const { id } = req.params;

  try {
      await prisma.order.delete({
          where: { id: parseInt(id) }
      });
      res.status(200).json({ message: 'Pedido eliminado exitosamente.' });
  } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Error al eliminar el pedido.' });
  }
};

/**
 * Cancelar un pedido.
 */
const cancelOrder = async (req, res) => {
  const { id } = req.params;

  try {
    const order = await prisma.order.findUnique({
      where: { id: parseInt(id) },
      include: {
        products: {
          include: {
            product: true,
          },
        },
      },
    });

    if (!order || order.status === 'Canceled') {
      return res.status(400).json({ error: 'El pedido no existe o ya está cancelado.' });
    }

    if (order.status !== 'Pending') {
      return res.status(400).json({ error: 'Solo se pueden cancelar pedidos con estado Pending.' });
    }

    // Restaurar stock de los productos
    const productUpdates = order.products.map((item) =>
      prisma.product.update({
        where: { id: item.product.id },
        data: { stock: { increment: item.quantity } },
      })
    );
    await Promise.all(productUpdates);

    // Actualizar el estado del pedido
    const updatedOrder = await prisma.order.update({
      where: { id: parseInt(id) },
      data: { status: 'Canceled' },
    });

    // Enviar notificación a los administradores
    req.io.emit('order-canceled', { message: 'Un pedido ha sido cancelado', order: updatedOrder });

    res.status(200).json({ message: 'Pedido cancelado exitosamente.', order: updatedOrder });
  } catch (error) {
    console.error('Error al cancelar el pedido:', error.message);
    res.status(500).json({ error: 'Error al cancelar el pedido.' });
  }
};

// Listar todos los pedidos
const getAllOrders = async (req, res) => {
  const { userId } = req.query; // Filtrar por usuario si se pasa un query param

  try {
    const orders = userId
      ? await prisma.order.findMany({
          where: { userId: Number(userId) },
          include: { products: true, user: true },
        })
      : await prisma.order.findMany({
          include: { products: true, user: true },
        });

    return res.status(200).json({
      message: "Listado de pedidos obtenido exitosamente",
      orders,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error al obtener los pedidos" });
  }
};


module.exports = {
  createOrder,
  getOrders,
  updateOrderStatus,
  deleteOrder,
  setSocketIO,
  cancelOrder,
  getAllOrders
};
