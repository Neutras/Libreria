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

    // Extraer texto de la imagen con Tesseract.js
    const { data: { text } } = await Tesseract.recognize(preprocessedImagePath, 'spa', {
      logger: (info) => console.log(info), // Opcional: para depuración
    });

    if (!text.trim()) {
      return res.status(422).json({ error: 'No se pudo extraer texto de la imagen.' });
    }

    // Limpiar y estructurar el texto extraído
    const extractedProducts = parseTextToProducts(text);

    // Comparar con la base de datos
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
 * Preprocesar la imagen para mejorar la calidad del OCR.
 */
const preprocessImage = async (filePath) => {
  const preprocessedPath = path.join(
    path.dirname(filePath),
    `processed-${path.basename(filePath)}`
  );

  await sharp(filePath)
    .grayscale()
    .normalise()
    .threshold(128) // Binarización de la imagen
    .toFile(preprocessedPath);

  return preprocessedPath;
};

/**
 * Analiza el texto extraído para estructurarlo como productos con cantidades opcionales.
 */
const parseTextToProducts = (text) => {
  const lines = text
    .replace(/,/g, '\n') // Convertir listas separadas por comas a líneas
    .split('\n')
    .map(line => line.trim())
    .filter(line => line);

  const products = [];
  lines.forEach((line) => {
    const match = line.match(/(\d+)?\s?(.+)/); // Extraer cantidad opcional y nombre
    if (match) {
      const quantity = match[1] ? parseInt(match[1], 10) : 1;
      const name = match[2].trim().toLowerCase(); // Convertir a minúsculas para uniformidad
      products.push({ quantity, name: normalizeProductName(name) });
    }
  });

  return products;
};

/**
 * Normaliza los nombres de los productos para simplificar las búsquedas.
 */
const normalizeProductName = (name) => {
  const stopWords = ['de', 'el', 'la', 'cm', 'mm'];
  return name
    .replace(/\s+/g, ' ') // Eliminar espacios extra
    .replace(/[.,]/g, '') // Quitar puntuación
    .split(' ')
    .filter(word => !stopWords.includes(word)) // Eliminar palabras irrelevantes
    .join(' ')
    .trim();
};

/**
 * Compara productos extraídos con los disponibles en la base de datos y añade recomendaciones.
 */
const matchProductsWithDatabase = async (extractedProducts) => {
  const matchedProducts = [];
  const unmatchedProducts = [];
  const alternatives = [];

  for (const { quantity, name } of extractedProducts) {
    // Normalizar palabras clave para búsquedas flexibles
    const keywords = name.split(' ');

    // Buscar coincidencias exactas o parciales
    const product = await prisma.product.findFirst({
      where: {
        OR: keywords.map(keyword => ({
          name: { contains: keyword, mode: 'insensitive' },
        })),
      },
    });

    if (product) {
      // Buscar recomendaciones para productos coincidentes
      const recommendations = await prisma.product.findMany({
        where: {
          name: {
            contains: name.split(' ')[0], // Buscar por la primera palabra
            mode: 'insensitive',
          },
          NOT: {
            id: product.id, // Excluir el producto ya encontrado
          },
        },
        take: 5, // Limitar a 5 recomendaciones
      });

      matchedProducts.push({
        name: product.name,
        quantity,
        price: product.price,
        recommendations, // Incluir recomendaciones
      });
    } else {
      // Si no se encuentra, buscar alternativas más amplias
      unmatchedProducts.push(name);
      const similarProducts = await prisma.product.findMany({
        where: {
          OR: keywords.map(keyword => ({
            name: { contains: keyword, mode: 'insensitive' },
          })),
        },
        take: 5,
      });

      alternatives.push({ name, suggestions: similarProducts });
    }
  }

  return { matchedProducts, unmatchedProducts, alternatives };
};

module.exports = { processImage };