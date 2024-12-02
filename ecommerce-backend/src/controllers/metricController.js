const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

/**
 * Obtiene los productos más vendidos por cantidad y por ingresos totales.
 */
const getTopProducts = async (req, res) => {
  try {
    const topProducts = await prisma.orderProduct.groupBy({
      by: ['productId'],
      _sum: { quantity: true },
    });

    const products = await Promise.all(
      topProducts.map(async (product) => {
        const productDetails = await prisma.product.findUnique({
          where: { id: product.productId },
          select: { name: true, price: true },
        });

        return {
          productId: product.productId,
          name: productDetails.name,
          totalQuantity: product._sum.quantity,
          totalRevenue: product._sum.quantity * productDetails.price,
        };
      })
    );

    res.status(200).json(products);
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

    const categoryData = {};

    await Promise.all(
      topCategories.map(async (item) => {
        const product = await prisma.product.findUnique({
          where: { id: item.productId },
          select: { category: true, price: true },
        });

        if (!categoryData[product.category]) {
          categoryData[product.category] = {
            totalQuantity: 0,
            totalRevenue: 0,
          };
        }

        categoryData[product.category].totalQuantity += item._sum.quantity;
        categoryData[product.category].totalRevenue += item._sum.quantity * product.price;
      })
    );

    res.status(200).json(categoryData);
  } catch (error) {
    console.error("Error al obtener las categorías más vendidas:", error);
    res.status(500).json({ message: "Error al obtener las categorías más vendidas." });
  }
};

/**
 * Obtiene los ingresos agrupados por períodos (día, semana, mes).
 */
const getRevenueByPeriod = async (req, res) => {
  const { period = "day" } = req.query; // day, week, or month

  try {
    let dateTruncUnit;
    
    // Determinar la unidad para DATE_TRUNC según el período solicitado
    if (period === "day") {
      dateTruncUnit = "day";
    } else if (period === "week") {
      dateTruncUnit = "week";
    } else if (period === "month") {
      dateTruncUnit = "month";
    } else {
      return res.status(400).json({ message: "Período inválido. Usa 'day', 'week' o 'month'." });
    }

    // Realizamos la consulta con DATE_TRUNC directamente en GROUP BY
    const revenue = await prisma.$queryRaw`
      SELECT 
        DATE_TRUNC(${dateTruncUnit}, "createdAt") AS period, 
        SUM("total") AS totalRevenue
      FROM "Order"
      WHERE "status" = 'Completed'
      GROUP BY period
      ORDER BY period;
    `;

    res.status(200).json(revenue);
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
      _count: { _all: true },
    });

    const customers = await Promise.all(
      activeCustomers.map(async (customer) => {
        const user = await prisma.user.findUnique({
          where: { id: customer.userId },
          select: { name: true, email: true },
        });

        return {
          userId: customer.userId,
          name: user.name,
          email: user.email,
          orderCount: customer._count._all,
        };
      })
    );

    res.status(200).json(customers);
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
      // **Top 3 Productos Más Vendidos**
      const topProducts = await prisma.orderProduct.groupBy({
        by: ['productId'],
        _sum: { quantity: true },
        orderBy: { _sum: { quantity: 'desc' } },
        take: 3,
      });
  
      const productDetails = await Promise.all(
        topProducts.map(async (product) => {
          const details = await prisma.product.findUnique({
            where: { id: product.productId },
            select: { name: true, price: true },
          });
  
          return {
            productId: product.productId,
            name: details.name,
            totalQuantity: product._sum.quantity,
            totalRevenue: product._sum.quantity * details.price,
          };
        })
      );
  
      // **Top 3 Categorías Más Vendidas**
      const topCategories = {};
      const categories = await prisma.orderProduct.groupBy({
        by: ['productId'],
        _sum: { quantity: true },
      });
  
      await Promise.all(
        categories.map(async (item) => {
          const product = await prisma.product.findUnique({
            where: { id: item.productId },
            select: { category: true, price: true },
          });
  
          if (!topCategories[product.category]) {
            topCategories[product.category] = {
              totalQuantity: 0,
              totalRevenue: 0,
            };
          }
  
          topCategories[product.category].totalQuantity += item._sum.quantity;
          topCategories[product.category].totalRevenue += item._sum.quantity * product.price;
        })
      );
  
      const topCategoriesData = Object.entries(topCategories)
        .map(([category, data]) => ({ category, ...data }))
        .sort((a, b) => b.totalQuantity - a.totalQuantity)
        .slice(0, 3);
  
      // **Ingresos Totales**
      const today = await prisma.order.aggregate({
        _sum: { total: true },
        where: {
          status: 'Completed',
          createdAt: { gte: new Date().setHours(0, 0, 0, 0) },
        },
      });
  
      const thisWeek = await prisma.order.aggregate({
        _sum: { total: true },
        where: {
          status: 'Completed',
          createdAt: {
            gte: new Date(new Date().setDate(new Date().getDate() - new Date().getDay())),
          },
        },
      });
  
      const thisMonth = await prisma.order.aggregate({
        _sum: { total: true },
        where: {
          status: 'Completed',
          createdAt: {
            gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
          },
        },
      });
  
      // **Top 3 Clientes Más Activos**
      const activeCustomers = await prisma.order.groupBy({
        by: ['userId'],
        _count: { _all: true },
        orderBy: { _count: { _all: 'desc' } },
        take: 3,
      });
  
      const activeCustomerDetails = await Promise.all(
        activeCustomers.map(async (customer) => {
          const user = await prisma.user.findUnique({
            where: { id: customer.userId },
            select: { name: true, email: true },
          });
  
          return {
            userId: customer.userId,
            name: user.name,
            email: user.email,
            orderCount: customer._count._all,
          };
        })
      );
  
      // **Construcción del Resumen**
      res.status(200).json({
        topProducts: productDetails,
        topCategories: topCategoriesData,
        revenue: {
          today: today._sum.total || 0,
          thisWeek: thisWeek._sum.total || 0,
          thisMonth: thisMonth._sum.total || 0,
        },
        activeCustomers: activeCustomerDetails,
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
