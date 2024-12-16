const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Configuración centralizada
const ALLOWED_MIME_TYPES = ['image/jpeg', 'image/png'];
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5 MB

// Crear directorio si no existe
const createUploadDir = () => {
  const basePath = path.join(__dirname, '../../uploads');
  const todayFolder = new Date().toISOString().split('T')[0];
  const fullPath = path.join(basePath, todayFolder);

  if (!fs.existsSync(fullPath)) {
    fs.mkdirSync(fullPath, { recursive: true });
  }
  return fullPath;
};

// Configuración de almacenamiento
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = createUploadDir();
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    const timestamp = Date.now();
    const sanitizedOriginalName = file.originalname.replace(/\s+/g, '-').toLowerCase();
    const uniqueName = `${timestamp}-${Math.round(Math.random() * 1e9)}-${sanitizedOriginalName}`;
    cb(null, uniqueName);
  },
});

// Validación de archivo
const fileFilter = (req, file, cb) => {
  if (ALLOWED_MIME_TYPES.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('El archivo debe ser una imagen válida (JPG, PNG).'), false);
  }
};

// Middleware de Multer
const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: MAX_FILE_SIZE },
});

// Middleware para manejar errores de Multer
const handleMulterError = (err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    console.error(`Error de Multer: ${err.message}`);
    return res.status(400).json({ error: `Error de archivo: ${err.message}` });
  } else if (err) {
    console.error(`Error: ${err.message}`);
    return res.status(422).json({ error: err.message });
  }
  next();
};

module.exports = { upload, handleMulterError };
