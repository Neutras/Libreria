const fs = require('fs');
const path = require('path');
const Tesseract = require('tesseract.js');
const sharp = require('sharp');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

/**
 * Procesar imagen cargada y extraer texto utilizando Tesseract.js.
 */
const processImage = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No se ha proporcionado una imagen.' });
    }

    const filePath = req.file.path;

    // Preprocesar la imagen
    const preprocessedImagePath = await preprocessImage(filePath);

    // Extraer texto con Tesseract
    const { data: { text } } = await Tesseract.recognize(preprocessedImagePath, 'spa', {
      logger: (info) => console.log(info), // Para depuración
    });

    if (!text.trim()) {
      return res.status(422).json({ error: 'No se pudo extraer texto de la imagen.' });
    }

    // Limpiar y estructurar el texto extraído
    const extractedProducts = parseTextToProducts(text);

    // Comparar productos con la base de datos
    const { matchedProducts, unmatchedProducts, alternatives } = await matchProductsWithDatabase(extractedProducts);

    res.status(200).json({
      message: 'Imagen procesada exitosamente.',
      extractedData: {
        matchedProducts,
        unmatchedProducts,
        alternatives,
      },
    });
  } catch (error) {
    console.error('Error al procesar la imagen:', error);
    res.status(500).json({ error: 'Error interno al procesar la imagen.' });
  }
};

/**
 * Preprocesar la imagen con Sharp para mejorar la calidad del OCR.
 */
const preprocessImage = async (filePath) => {
  const preprocessedPath = path.join(
    path.dirname(filePath),
    `processed-${path.basename(filePath)}`
  );

  await sharp(filePath)
    .grayscale()
    .normalise()
    .threshold(128)
    .resize({ width: 1200 }) // Ajustar tamaño para mejor OCR
    .toFile(preprocessedPath);

  return preprocessedPath;
};

/**
 * Analiza el texto extraído y lo estructura en objetos { quantity, name }.
 */
const parseTextToProducts = (text) => {
  const lines = text
    .split('\n')
    .map(line => line.replace(/[^a-zA-Z0-9áéíóúÁÉÍÓÚñÑ\s]/g, '').trim())
    .filter(line => line);

  const products = [];
  const uniqueNames = new Set(); // Evitar duplicados

  lines.forEach((line) => {
    const match = line.match(/(\d+)?\s?(.+)/); // Extraer cantidad y nombre
    if (match) {
      const quantity = match[1] ? parseInt(match[1], 10) : 1;
      const name = normalizeProductName(match[2]);

      if (!uniqueNames.has(name)) { // Evitar duplicados
        products.push({ quantity, name });
        uniqueNames.add(name);
      }
    }
  });

  return products;
};

/**
 * Normaliza nombres de productos (remueve palabras irrelevantes).
 */
const normalizeProductName = (name) => {
  const stopWords = ['de', 'el', 'la', 'cm', 'mm', 'color', 'tamaño', 'pack'];
  return name
    .toLowerCase()
    .split(' ')
    .filter(word => !stopWords.includes(word))
    .join(' ')
    .trim();
};

/**
 * Compara productos extraídos con la base de datos y añade recomendaciones.
 */
const matchProductsWithDatabase = async (extractedProducts) => {
  const matchedProducts = [];
  const unmatchedProducts = [];
  const alternatives = [];
  const uniqueProductIds = new Set(); // Evitar duplicados

  for (const { quantity, name } of extractedProducts) {
    const keywords = name.split(' ');

    // Buscar coincidencias en la base de datos
    const product = await prisma.product.findFirst({
      where: {
        OR: keywords.map(keyword => ({
          name: { contains: keyword, mode: 'insensitive' },
        })),
      },
    });

    if (product && !uniqueProductIds.has(product.id)) {
      uniqueProductIds.add(product.id);

      // Buscar recomendaciones
      const recommendations = await prisma.product.findMany({
        where: {
          name: {
            contains: name.split(' ')[0], // Buscar por la primera palabra
            mode: 'insensitive',
          },
          NOT: { id: product.id },
        },
        take: 3,
      });

      matchedProducts.push({
        id: product.id,
        name: product.name,
        quantity,               // Cantidad detectada por OCR
        stock: product.stock,   // Stock real del producto
        brand: product.author,  // Marca/Autor del producto
        price: product.price,
        recommendations,
      });
    } else {
      // Buscar alternativas si no hay coincidencia
      unmatchedProducts.push(name);
      const similarProducts = await prisma.product.findMany({
        where: {
          OR: keywords.map(keyword => ({
            name: { contains: keyword, mode: 'insensitive' },
          })),
        },
        take: 3,
      });

      if (similarProducts.length > 0) {
        alternatives.push({ name, suggestions: similarProducts });
      }
    }
  }

  return { matchedProducts, unmatchedProducts, alternatives };
};

module.exports = { processImage };