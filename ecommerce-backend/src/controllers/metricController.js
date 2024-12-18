const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

/**
 * Función auxiliar para obtener detalles de productos en lote.
 */
const fetchProductDetails = async (productIds) => {
  const products = await prisma.product.findMany({
    where: { id: { in: productIds } },
    select: { id: true, name: true, price: true, category: true },
  });
  return products.reduce((map, product) => {
    map[product.id] = product;
    return map;
  }, {});
};

/**
 * Obtiene los productos más vendidos por cantidad y por ingresos totales.
 */
const getTopProducts = async (req, res) => {
  try {
    const topProducts = await prisma.orderProduct.groupBy({
      by: ['productId'],
      _sum: { quantity: true },
      orderBy: { _sum: { quantity: 'desc' } },
      take: 10, // Limitar a top 10
    });

    const productIds = topProducts.map((p) => p.productId);
    const productDetails = await fetchProductDetails(productIds);

    const labels = [];
    const data = [];

    const products = topProducts.map((product) => {
      const details = productDetails[product.productId];
      labels.push(details.name);
      data.push(product._sum.quantity);
      return {
        productId: product.productId,
        name: details.name,
        totalQuantity: product._sum.quantity,
        totalRevenue: product._sum.quantity * details.price,
      };
    });

    res.status(200).json({ products, chartData: { labels, data } });
  } catch (error) {
    console.error("Error al obtener los productos más vendidos:", error);
    res.status(500).json({ message: "Error al obtener los productos más vendidos." });
  }
};

/**
 * Obtiene las categorías más vendidas por cantidad e ingresos totales.
 */
const getTopCategories = async (req, res) => {
  try {
    const topCategories = await prisma.orderProduct.groupBy({
      by: ['productId'],
      _sum: { quantity: true },
    });

    const productIds = topCategories.map((c) => c.productId);
    const productDetails = await fetchProductDetails(productIds);

    const categoryData = {};

    topCategories.forEach((item) => {
      const product = productDetails[item.productId];
      if (!categoryData[product.category]) {
        categoryData[product.category] = {
          totalQuantity: 0,
          totalRevenue: 0,
        };
      }
      categoryData[product.category].totalQuantity += item._sum.quantity;
      categoryData[product.category].totalRevenue += item._sum.quantity * product.price;
    });

    const labels = Object.keys(categoryData);
    const data = labels.map((label) => categoryData[label].totalQuantity);

    const result = Object.entries(categoryData).map(([category, data]) => ({ category, ...data }));
    res.status(200).json({ categories: result, chartData: { labels, data } });
  } catch (error) {
    console.error("Error al obtener las categorías más vendidas:", error);
    res.status(500).json({ message: "Error al obtener las categorías más vendidas." });
  }
};

/**
 * Obtiene los ingresos agrupados por períodos (día, semana, mes).
 */
const getRevenueByPeriod = async (req, res) => {
  const { period = "day", startDate, endDate } = req.query;

  try {
    const validPeriods = ['day', 'week', 'month'];
    if (!validPeriods.includes(period)) {
      return res.status(400).json({ message: "Período inválido. Usa 'day', 'week' o 'month'." });
    }

    const revenue = await prisma.$queryRaw`
      SELECT 
        DATE_TRUNC(${period}, "createdAt") AS period, 
        SUM("total") AS "totalRevenue"
      FROM "Order"
      WHERE "status" = 'Completed' 
        AND "createdAt" BETWEEN ${new Date(startDate || 0)} AND ${new Date(endDate || Date.now())}
      GROUP BY period
      ORDER BY period;
    `;

    const labels = revenue.map((r) => new Date(r.period).toISOString()); // Asegurar formato ISO
    const data = revenue.map((r) => r.totalRevenue || 0); // Reemplazar null por 0

    res.status(200).json({ revenue, chartData: { labels, data } });
  } catch (error) {
    console.error("Error al obtener ingresos por períodos:", error);
    res.status(500).json({ message: "Error al obtener ingresos por períodos." });
  }
};

/**
 * Obtiene los clientes más activos por número de pedidos realizados.
 */
const getActiveCustomers = async (req, res) => {
  try {
    const activeCustomers = await prisma.order.groupBy({
      by: ['userId'],
      _count: true,
      orderBy: { _count: { userId: 'desc' } }, // Cambié `_all` por `userId`
      take: 5,
    });

    const userIds = activeCustomers.map((c) => c.userId);
    const users = await prisma.user.findMany({
      where: { id: { in: userIds } },
      select: { id: true, name: true, email: true },
    });

    const userMap = users.reduce((map, user) => {
      map[user.id] = user;
      return map;
    }, {});

    const result = activeCustomers.map((customer) => {
      const user = userMap[customer.userId];
      return {
        userId: customer.userId,
        name: user.name,
        email: user.email,
        orderCount: customer._count,
      };
    });

    const labels = result.map((r) => r.name);
    const data = result.map((r) => r.orderCount);

    res.status(200).json({ customers: result, chartData: { labels, data } });
  } catch (error) {
    console.error("Error al obtener los clientes más activos:", error);
    res.status(500).json({ message: "Error al obtener los clientes más activos." });
  }
};

/**
 * Devuelve un resumen general de las métricas del sistema.
 */
const getMetricsSummary = async (req, res) => {
  try {
    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);

    const weekStart = new Date();
    weekStart.setDate(weekStart.getDate() - weekStart.getDay());

    const monthStart = new Date();
    monthStart.setDate(1);
    monthStart.setHours(0, 0, 0, 0);

    const [topProductsData, revenueToday, revenueThisWeek, revenueThisMonth, activeCustomersData] = await Promise.all([
      prisma.orderProduct.groupBy({
        by: ['productId'],
        _sum: { quantity: true },
        orderBy: { _sum: { quantity: 'desc' } },
        take: 3,
      }),
      prisma.order.aggregate({
        _sum: { total: true },
        where: {
          status: 'Completed',
          createdAt: { gte: todayStart },
        },
      }),
      prisma.order.aggregate({
        _sum: { total: true },
        where: {
          status: 'Completed',
          createdAt: { gte: weekStart },
        },
      }),
      prisma.order.aggregate({
        _sum: { total: true },
        where: {
          status: 'Completed',
          createdAt: { gte: monthStart },
        },
      }),
      prisma.order.groupBy({
        by: ['userId'],
        _count: true,
        orderBy: { _count: { userId: 'desc' } },
        take: 5,
      }),
    ]);

    // Enriquecer `topProducts` con detalles de producto
    const productIds = topProductsData.map((p) => p.productId);
    const productDetails = await prisma.product.findMany({
      where: { id: { in: productIds } },
      select: { id: true, name: true, price: true },
    });
    const productMap = productDetails.reduce((map, product) => {
      map[product.id] = product;
      return map;
    }, {});

    const topProducts = topProductsData.map((p) => ({
      productId: p.productId,
      name: productMap[p.productId]?.name || 'Desconocido',
      totalQuantity: p._sum.quantity,
      totalRevenue: productMap[p.productId]
        ? productMap[p.productId].price * p._sum.quantity
        : 0,
    }));

    // Enriquecer `activeCustomers` con detalles de usuario
    const userIds = activeCustomersData.map((u) => u.userId);
    const userDetails = await prisma.user.findMany({
      where: { id: { in: userIds } },
      select: { id: true, name: true, email: true },
    });
    const userMap = userDetails.reduce((map, user) => {
      map[user.id] = user;
      return map;
    }, {});

    const activeCustomers = activeCustomersData.map((u) => ({
      userId: u.userId,
      name: userMap[u.userId]?.name || 'Desconocido',
      email: userMap[u.userId]?.email || 'No disponible',
      orderCount: u._count,
    }));

    // Respuesta enriquecida
    res.status(200).json({
      topProducts,
      revenue: {
        today: revenueToday._sum.total || 0,
        thisWeek: revenueThisWeek._sum.total || 0,
        thisMonth: revenueThisMonth._sum.total || 0,
      },
      activeCustomers,
    });
  } catch (error) {
    console.error("Error al obtener el resumen de métricas:", error);
    res.status(500).json({ message: "Error al obtener el resumen de métricas." });
  }
};

module.exports = {
  getTopProducts,
  getTopCategories,
  getRevenueByPeriod,
  getActiveCustomers,
  getMetricsSummary,
};