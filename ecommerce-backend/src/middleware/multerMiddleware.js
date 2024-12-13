const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Configuración del almacenamiento de archivos
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadBasePath = path.join(__dirname, '../../uploads');
    const uploadPath = path.join(uploadBasePath, `${new Date().toISOString().split('T')[0]}`);
    
    // Crear directorio si no existe
    fs.mkdirSync(uploadPath, { recursive: true });
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    cb(null, `${uniqueSuffix}-${file.originalname}`);
  },
});

// Filtro para validar archivos permitidos
const fileFilter = (req, file, cb) => {
  const allowedExtensions = [".jpg", ".jpeg", ".png"];
  const fileExtension = path.extname(file.originalname).toLowerCase();

  if (allowedExtensions.includes(fileExtension)) {
    cb(null, true);
  } else {
    cb(new Error('El archivo debe ser una imagen válida (JPG, PNG, etc.).'));
  }
};

// Limitar el tamaño del archivo a 5 MB
const limits = { fileSize: 5 * 1024 * 1024 };

// Middleware Multer configurado
const upload = multer({ 
  storage, 
  fileFilter, 
  limits,
});

// Middleware para manejar errores de Multer
const handleMulterError = (err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    console.error('Error de Multer:', err.message);
    return res.status(400).json({ error: `Error en la subida del archivo: ${err.message}` });
  } else if (err) {
    console.error('Error en el middleware de Multer:', err.message);
    return res.status(500).json({ error: 'Error interno del servidor al manejar el archivo.' });
  }
  next();
};

module.exports = { upload, handleMulterError };