const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

// Crear Producto
const createProduct = async (req, res) => {
  const { name, description, price, stock, category, author } = req.body;

  try {
    const product = await prisma.product.create({
      data: { name, description, price, stock, category, author },
    });
    res.status(201).json(product);
  } catch (error) {
    console.error("Error al crear producto:", error.message);
    res.status(500).json({ error: "Error al crear el producto." });
  }
};


// Listar Productos con Procesamiento
const getProducts = async (req, res) => {
  try {
    const { isHot, category, minStock, name } = req.query;

    // Construir filtros dinámicos basados en query params
    const where = {};
    if (isHot !== undefined) where.isHot = isHot === "true";
    if (category) where.category = category;
    if (minStock) where.stock = { gte: parseInt(minStock) };
    if (name) where.name = { contains: name};

    const products = await prisma.product.findMany({
      where, // Filtros dinámicos
      select: { // Seleccionar solo los campos necesarios
        id: true,
        author: true,
        name: true,
        description: true,
        price: true,
        stock: true,
        category: true,
        isHot: true,
        promotions: {
          select: {
            discount: true,
            expiresAt: true,
          },
        },
      }
    });

    const processedProducts = products.map((product) => {
      const activePromotion = product.promotions.find(
        (promo) => new Date(promo.expiresAt) > new Date()
      );

      const discountPercentage = activePromotion
        ? activePromotion.discount
        : null;
      const priceWithDiscount = discountPercentage
        ? (product.price * (1 - discountPercentage / 100)).toFixed(2)
        : null;

      return {
        id: product.id,
        author: product.author,
        name: product.name,
        description: product.description,
        price: product.price,
        priceWithDiscount,
        discountPercentage,
        stock: product.stock,
        category: product.category,
        isHot: product.isHot,
      };
    });

    res.status(200).json({ products: processedProducts });
  } catch (error) {
    console.error("Error al obtener productos:", error.message);
    res.status(500).json({ message: "Error al obtener productos." });
  }
};

// Editar Producto
const updateProduct = async (req, res) => {
  const { id } = req.params;
  const { name, description, price, stock, category, isHot } = req.body;

  try {
    const product = await prisma.product.update({
      where: { id: parseInt(id) },
      data: { name, description, price, stock, category, isHot },
    });
    res.json(product);
  } catch (error) {
    console.error("Error al actualizar producto:", error.message);
    res.status(404).json({ error: "Producto no encontrado." });
  }
};

// Eliminar Producto
const deleteProduct = async (req, res) => {
  const { id } = req.params;

  try {
    await prisma.product.delete({ where: { id: parseInt(id) } });
    res.json({ message: "Producto eliminado exitosamente." });
  } catch (error) {
    console.error("Error al eliminar producto:", error.message);
    res.status(404).json({ error: "Producto no encontrado." });
  }
};

// Cambiar Estado HOT de Producto
const toggleHotStatus = async (req, res) => {
  try {
    const { productId } = req.body;

    if (!productId) {
      return res
        .status(400)
        .json({ message: "Se necesita la ID del producto." });
    }

    const product = await prisma.product.findUnique({
      where: { id: productId },
    });

    if (!product) {
      return res.status(404).json({ message: "Producto no encontrado." });
    }

    const updatedProduct = await prisma.product.update({
      where: { id: productId },
      data: { isHot: !product.isHot },
    });

    res
      .status(200)
      .json({ message: "Estado HOT actualizado.", product: updatedProduct });
  } catch (error) {
    console.error("Error al cambiar estado HOT:", error.message);
    res.status(500).json({ message: "Error al cambiar estado HOT." });
  }
};

// Obtener Producto por ID
const getProductById = async (req, res) => {
  const { id } = req.params;

  try {
    // Convertir `id` a entero
    const productId = parseInt(id);

    // Verificar si la conversión fue exitosa
    if (isNaN(productId)) {
      return res.status(400).json({ message: "El ID del producto debe ser un número válido." });
    }

    const product = await prisma.product.findUnique({
      where: { id: productId },
      include: { promotions: true },
    });

    if (!product) {
      return res.status(404).json({ message: "Producto no encontrado." });
    }

    const activePromotion = product.promotions.find(
      (promo) => new Date(promo.expiresAt) > new Date()
    );

    const priceWithDiscount = activePromotion
      ? (product.price * (1 - activePromotion.discount / 100)).toFixed(2)
      : null;

    res.status(200).json({
      ...product,
      priceWithDiscount,
      discountPercentage: activePromotion ? activePromotion.discount : null,
    });
  } catch (error) {
    console.error("Error al obtener producto:", error.message);
    res.status(500).json({ message: "Error al obtener producto." });
  }
};

// Obtener Recomendaciones
const getRecommendations = async (req, res) => {
  console.log("req.user:", req.user);
  const userId = req.user?.id;

  try {
    if (!userId) {
      return res
        .status(400)
        .json({ message: "No se pudo obtener el ID del usuario." });
    }

    // Obtener el historial de compras del usuario
    const userOrders = await prisma.order.findMany({
      where: { userId },
      include: { products: { include: { product: true } } },
    });

    if (userOrders.length === 0) {
      const hotProducts = await prisma.product.findMany({
        where: { isHot: true },
        take: 5,
        include: { promotions: true }, // Incluir promociones para calcular descuentos
      });

      const processedHotProducts = hotProducts.map((product) => {
        const activePromotion = product.promotions.find(
          (promo) => new Date(promo.expiresAt) > new Date()
        );

        const discountPercentage = activePromotion
          ? activePromotion.discount
          : null;
        const priceWithDiscount = discountPercentage
          ? (product.price * (1 - discountPercentage / 100)).toFixed(2)
          : null;

        return {
          ...product,
          priceWithDiscount,
          discountPercentage,
        };
      });

      return res.status(200).json(processedHotProducts);
    }

    // Calcular categorías y autores comprados
    const purchasedCategories = {};
    const purchasedAuthors = {};

    userOrders.forEach((order) => {
      order.products.forEach((orderProduct) => {
        const category = orderProduct.product?.category;
        const author = orderProduct.product?.author;

        if (category) {
          purchasedCategories[category] =
            (purchasedCategories[category] || 0) + 1;
        }
        if (author) {
          purchasedAuthors[author] =
            (purchasedAuthors[author] || 0) + 1;
        }
      });
    });

    // Calcular la puntuación de cada producto
    const products = await prisma.product.findMany({
      include: { promotions: true },
    });

    const productScores = {};

    products.forEach((product) => {
      let score = 0;

      if (purchasedCategories[product.category]) {
        score += purchasedCategories[product.category] * 0.6;
      }

      if (purchasedAuthors[product.author]) {
        score += purchasedAuthors[product.author] * 0.4;
      }

      if (product.promotions.some((promo) => new Date(promo.expiresAt) > new Date())) {
        score += 0.2;
      }

      if (product.isHot) {
        score += 0.1;
      }

      if (score > 0) {
        productScores[product.id] = score;
      }
    });

    const purchasedProductIds = userOrders.flatMap((order) =>
      order.products.map((product) => product.productId)
    );

    const recommendedProductIds = Object.entries(productScores)
      .sort(([, scoreA], [, scoreB]) => scoreB - scoreA)
      .map(([productId]) => parseInt(productId))
      .filter((id) => !purchasedProductIds.includes(id))
      .slice(0, 5);

    const recommendedProducts = await prisma.product.findMany({
      where: { id: { in: recommendedProductIds } },
      include: { promotions: true },
    });

    const processedRecommendations = recommendedProducts.map((product) => {
      const activePromotion = product.promotions.find(
        (promo) => new Date(promo.expiresAt) > new Date()
      );

      const discountPercentage = activePromotion
        ? activePromotion.discount
        : null;
      const priceWithDiscount = discountPercentage
        ? (product.price * (1 - discountPercentage / 100)).toFixed(2)
        : null;

      return {
        ...product,
        priceWithDiscount,
        discountPercentage,
      };
    });

    res.json(processedRecommendations);
  } catch (error) {
    console.error("Error en getRecommendations:", error);
    res.status(500).json({ error: "Error al obtener recomendaciones" });
  }
};

const getCategories = async (req, res) => {
  try {
    const categories = await prisma.product.findMany({
      select: {
        category: true,
      },
      distinct: ["category"], // Selecciona categorías únicas
    });

    const uniqueCategories = categories.map((c) => c.category).filter(Boolean); // Filtrar valores nulos o vacíos
    res.status(200).json(uniqueCategories);
  } catch (error) {
    console.error("Error al obtener categorías:", error.message);
    res.status(500).json({ message: "Error al obtener categorías." });
  }
};


module.exports = {
  createProduct,
  getProducts,
  getProductById,
  updateProduct,
  deleteProduct,
  toggleHotStatus,
  getRecommendations,
  getCategories,
};
