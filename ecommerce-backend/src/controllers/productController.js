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
    res.status(500).json({ error: "Error al crear el producto." });
  }
};

// Listar Productos con Filtros y Paginación
const getProducts = async (req, res) => {
  try {
      // Obtener todos los productos
      const products = await prisma.product.findMany({
          include: {
              promotions: {
                  select: {
                      discount: true,
                      expiresAt: true,
                  },
              },
          },
      });

      // Procesar productos para aplicar descuentos
      const processedProducts = products.map((product) => {
          const activePromotion = product.promotions.find(
              (promo) => new Date(promo.expiresAt) > new Date()
          );

          return {
              ...product,
              finalPrice: activePromotion
                  ? product.price * (1 - activePromotion.discount / 100)
                  : product.price,
          };
      });

      return res.status(200).json(processedProducts);
  } catch (error) {
      console.error(error);
      return res.status(500).json({ message: "Error al obtener productos" });
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


const toggleHotStatus = async (req, res) => {
  try {
    const { productId } = req.body;

    if (!productId) {
      return res.status(400).json({ message: 'Se necesita la ID del producto.' });
    }

    const product = await prisma.product.findUnique({ where: { id: productId } });

    if (!product) {
      return res.status(404).json({ message: 'Producto no encontrado.' });
    }

    const updatedProduct = await prisma.product.update({
      where: { id: productId },
      data: { isHot: !product.isHot },
    });

    res.status(200).json({ message: 'Se actualizó el estado Hot.', product: updatedProduct });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error toggling hot status.' });
  }
};

// Obtener producto por ID
const getProductById = async (req, res) => {
  const { id } = req.params; // Obtener el ID de los parámetros de la URL

  try {
      const product = await prisma.product.findUnique({
          where: {
              id: parseInt(id), // Convertir el ID a número entero
          },
          include: {
              promotions: true, // Incluir promociones relacionadas, si existen
          },
      });

      if (!product) {
          return res.status(404).json({ message: 'Producto no encontrado.' });
      }

      // Verificar si el producto tiene una promoción activa y ajustar el precio
      if (product.promotions && product.promotions.length > 0) {
          const activePromotion = product.promotions.find(
              (promo) => new Date(promo.expiresAt) > new Date() // La promoción está activa
          );

          if (activePromotion) {
              product.priceWithDiscount = product.price * (1 - activePromotion.discount / 100);
          }
      }

      res.status(200).json(product);
  } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Error al obtener el producto.' });
  }
};

module.exports = { 
  createProduct, 
  getProducts, 
  getProductById, 
  updateProduct, 
  deleteProduct, 
  toggleHotStatus 
};