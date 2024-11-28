const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

// Crear Producto
const createProduct = async (req, res) => {
  const { name, description, price, stock, category } = req.body;

  try {
    const product = await prisma.product.create({
      data: {
        name,
        description,
        price,
        stock,
        category,
      },
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
    const { isHot, category, minStock } = req.query;

    // Construir filtros dinámicos basados en query params
    const where = {};
    if (isHot !== undefined) where.isHot = isHot === "true";
    if (category) where.category = category;
    if (minStock) where.stock = { gte: parseInt(minStock) };

    const products = await prisma.product.findMany({
      where, // Filtros dinámicos
      include: {
        promotions: {
          select: {
            discount: true,
            expiresAt: true,
          },
        },
      },
    });

    const processedProducts = products.map((product) => {
      const activePromotion = product.promotions.find(
        (promo) => new Date(promo.expiresAt) > new Date()
      );

      const discountPercentage = activePromotion ? activePromotion.discount : null;
      const priceWithDiscount = discountPercentage
        ? (product.price * (1 - discountPercentage / 100)).toFixed(2)
        : null;

      return {
        id: product.id,
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
      return res.status(400).json({ message: "Se necesita la ID del producto." });
    }

    const product = await prisma.product.findUnique({ where: { id: productId } });

    if (!product) {
      return res.status(404).json({ message: "Producto no encontrado." });
    }

    const updatedProduct = await prisma.product.update({
      where: { id: productId },
      data: { isHot: !product.isHot },
    });

    res.status(200).json({ message: "Estado HOT actualizado.", product: updatedProduct });
  } catch (error) {
    console.error("Error al cambiar estado HOT:", error.message);
    res.status(500).json({ message: "Error al cambiar estado HOT." });
  }
};

// Obtener Producto por ID
const getProductById = async (req, res) => {
  const { id } = req.params;

  try {
    const product = await prisma.product.findUnique({
      where: { id: parseInt(id) },
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

module.exports = {
  createProduct,
  getProducts,
  getProductById,
  updateProduct,
  deleteProduct,
  toggleHotStatus,
};
