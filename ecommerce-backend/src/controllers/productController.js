const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

// Crear Producto
const createProduct = async (req, res) => {
  const { name, description, price, stock, category, isHot } = req.body;

  try {
    const product = await prisma.product.create({
      data: {
        name,
        description,
        price,
        stock,
        category,
        isHot: isHot || false,
      },
    });
    res.status(201).json(product);
  } catch (error) {
    res.status(500).json({ error: "Error al crear el producto." });
  }
};

// Listar Productos con Filtros y Paginación
const getProducts = async (req, res) => {
  const { category, page = 1, limit = 10 } = req.query;

  try {
    const filters = category ? { category } : {};
    const products = await prisma.product.findMany({
      where: filters,
      skip: (page - 1) * limit,
      take: parseInt(limit),
    });

    const total = await prisma.product.count({ where: filters });

    res.json({ products, total, page: parseInt(page), limit: parseInt(limit) });
  } catch (error) {
    res.status(500).json({ error: "Error al obtener los productos." });
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
    res.status(404).json({ error: "Producto no encontrado." });
  }
};

module.exports = {
  createProduct,
  getProducts,
  updateProduct,
  deleteProduct,
};
