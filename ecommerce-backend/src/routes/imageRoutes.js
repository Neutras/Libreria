const express = require('express');
const { upload, handleMulterError } = require('../middleware/multerMiddleware');
const imageController = require('../controllers/imageController');
const router = express.Router();

// Ruta para procesar imágenes
router.post(
  '/process', 
  upload.single('image'), 
  handleMulterError, 
  imageController.processImage
);

module.exports = router;