const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const { emitToUser, emitToRole } = require('../utils/notificationManager');

/**
 * Crear un pedido.
 */
const createOrder = async (req, res) => {
  const { products } = req.body;

  try {
    const userId = req.user.id;

    // Validar stock antes de procesar
    for (const item of products) {
      const product = await prisma.product.findUnique({ where: { id: item.productId } });
      if (!product || product.stock < item.quantity) {
        return res.status(400).json({ error: `Stock insuficiente para el producto con ID ${item.productId}` });
      }
    }

    // Calcular el total del pedido
    const total = await products.reduce(async (sumPromise, item) => {
      const sum = await sumPromise;
      const product = await prisma.product.findUnique({ where: { id: item.productId } });

      // Reducir el stock
      await prisma.product.update({
        where: { id: item.productId },
        data: { stock: { decrement: item.quantity } },
      });

      return sum + product.price * item.quantity;
    }, Promise.resolve(0));

    // Calcular puntos
    const points = Math.floor(total / 100);

    // Crear el pedido
    const order = await prisma.order.create({
      data: {
        userId,
        status: 'Pending',
        total,
        points,
        products: {
          create: products.map((item) => ({
            productId: item.productId,
            quantity: item.quantity,
          })),
        },
      },
      include: { products: true },
    });

    // Asignar puntos al usuario
    await prisma.user.update({
      where: { id: userId },
      data: { points: { increment: points } },
    });

    // Notificaciones
    emitToUser(userId, 'order-created', {
      message: `Pedido creado exitosamente con ID ${order.id}. Has ganado ${points} puntos.`,
      order,
    });

    emitToRole('admin', 'new-order', {
      message: `Un nuevo pedido ha sido creado por el usuario ${userId}.`,
      order,
    });

    res.status(201).json({ message: 'Pedido creado exitosamente.', order });
  } catch (error) {
    console.error('Error al crear el pedido:', error.message);
    res.status(500).json({ error: 'Error al crear el pedido.' });
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
      include: { products: true },
    });

    if (!order || order.status !== 'Pending') {
      return res.status(400).json({ error: 'El pedido no existe o no puede ser cancelado.' });
    }

    // Restaurar stock de los productos
    const productUpdates = order.products.map((item) =>
      prisma.product.update({
        where: { id: item.productId },
        data: { stock: { increment: item.quantity } },
      })
    );
    await Promise.all(productUpdates);

    // Descontar puntos del usuario
    await prisma.user.update({
      where: { id: order.userId },
      data: { points: { decrement: order.points } },
    });

    // Actualizar el estado del pedido
    const updatedOrder = await prisma.order.update({
      where: { id: parseInt(id) },
      data: { status: 'Canceled' },
    });

    // Notificaciones
    emitToUser(order.userId, 'order-canceled', {
      message: `Tu pedido con ID ${order.id} ha sido cancelado y se han reducido ${order.points} puntos.`,
    });

    emitToRole('admin', 'order-canceled', {
      message: `El pedido con ID ${order.id} ha sido cancelado.`,
    });

    res.status(200).json({ message: 'Pedido cancelado exitosamente.', order: updatedOrder });
  } catch (error) {
    console.error('Error al cancelar el pedido:', error.message);
    res.status(500).json({ error: 'Error al cancelar el pedido.' });
  }
};

/**
 * Actualizar el estado de un pedido.
 */
const updateOrderStatus = async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  try {
    const order = await prisma.order.findUnique({ where: { id: parseInt(id) } });

    if (!order) {
      return res.status(404).json({ error: 'Pedido no encontrado.' });
    }

    const updatedOrder = await prisma.order.update({
      where: { id: parseInt(id) },
      data: { status },
    });

    // Notificación al usuario
    emitToUser(order.userId, 'order-status-updated', {
      message: `El estado de tu pedido con ID ${order.id} ha sido actualizado a ${status}.`,
    });

    res.status(200).json({ message: 'Estado del pedido actualizado.', order: updatedOrder });
  } catch (error) {
    console.error('Error al actualizar el estado del pedido:', error.message);
    res.status(500).json({ error: 'Error al actualizar el estado del pedido.' });
  }
};

/**
 * Listar pedidos.
 */
const listOrders = async (req, res) => {
  try {
    const orders = req.user.role === 'admin'
      ? await prisma.order.findMany({ include: { products: true } })
      : await prisma.order.findMany({
          where: { userId: req.user.id },
          include: { products: true },
        });

    res.status(200).json({ orders });
  } catch (error) {
    console.error('Error al listar pedidos:', error.message);
    res.status(500).json({ error: 'Error al listar pedidos.' });
  }
};

/**
 * Obtener detalles de un pedido.
 */
const getOrderDetails = async (req, res) => {
  const { id } = req.params;

  try {
    const order = await prisma.order.findUnique({
      where: { id: parseInt(id) },
      include: { products: true },
    });

    if (!order || (req.user.role !== 'admin' && order.userId !== req.user.id)) {
      return res.status(404).json({ error: 'Pedido no encontrado.' });
    }

    res.status(200).json({ order });
  } catch (error) {
    console.error('Error al obtener detalles del pedido:', error.message);
    res.status(500).json({ error: 'Error al obtener detalles del pedido.' });
  }
};

module.exports = {
  createOrder,
  cancelOrder,
  updateOrderStatus,
  listOrders,
  getOrderDetails,
};
