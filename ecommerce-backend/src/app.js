const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const userRoutes = require("./routes/userRoutes");
const productRoutes = require("./routes/productRoutes");

dotenv.config();

const app = express();

// Middlewares
app.use(cors());
app.use(express.json()); // Asegura que los cuerpos JSON se procesen correctamente

// Ruta raíz
app.get("/", (req, res) => {
  res.send("Bienvenido a la API de E-commerce");
});

// Ruta base para /api
app.get("/api", (req, res) => {
  res.json({
    message: "Bienvenido a la API de E-commerce",
    endpoints: {
      users: "/api/users",
    },
  });
});

// Rutas específicas
app.use("/api/users", userRoutes);

// Manejo de rutas no encontradas
app.use((req, res, next) => {
  res.status(404).json({
    error: "Ruta no encontrada",
  });
});

// Manejo de errores generales
app.use((err, req, res, next) => {
  console.error("Error Interno:", err.stack);
  res.status(500).json({
    message: "Error interno del servidor",
    error: err.message,
  });
});

// Iniciar el servidor
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
