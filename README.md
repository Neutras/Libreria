
# E-Commerce API
---

## **Tecnologías Utilizadas**

- **Node.js:** Plataforma de desarrollo backend.
- **Express.js:** Framework para construir la API RESTful.
- **Prisma ORM:** Gestión y consultas de base de datos.
- **PostgreSQL:** Base de datos relacional.
- **JWT (JSON Web Tokens):** Para autenticación y autorización.
- **Nodemon:** Herramienta para desarrollo con reinicio automático.
- **node-cron:** Programación de tareas automáticas para funcionalidades avanzadas.

---

## **Instalación**

### **Requisitos Previos**
1. **Node.js** y **npm** instalados.
2. **PostgreSQL** configurado en tu sistema.
3. Archivo `.env` con las siguientes variables:
   ```
   DATABASE_URL="postgresql://<usuario>:<contraseña>@<host>:<puerto>/<nombre_bd>"
   JWT_SECRET="clave_secreta_para_jwt"
   ```

### **Pasos**
1. Clona este repositorio:
   ```bash
   git clone <URL_DEL_REPOSITORIO>
   cd ecommerce-backend
   ```

2. Instala las dependencias:
   ```bash
   npm install
   ```

3. Inicializa la base de datos con Prisma:
   ```bash
   npx prisma migrate dev --name init
   ```

4. Ejecuta el servidor de desarrollo:
   ```bash
   npx nodemon src/app.js
   ```

---

## **Endpoints Principales**

### **Usuarios**

| Método | Ruta           | Descripción                                | Autorización |
|--------|----------------|--------------------------------------------|--------------|
| POST   | `/api/users/register` | Registro de un nuevo usuario.             | No           |
| POST   | `/api/users/login`    | Inicio de sesión y generación de token.  | No           |
| GET    | `/api/users/profile`  | Obtiene el perfil del usuario autenticado.| Token        |

---

### **Productos**

| Método | Ruta                | Descripción                                    | Autorización      |
|--------|---------------------|------------------------------------------------|-------------------|
| POST   | `/api/products`     | Crea un nuevo producto.                        | Token (Admin)     |
| GET    | `/api/products`     | Lista todos los productos.                     | No                |
| GET    | `/api/products/:id` | Obtiene detalles de un producto específico.    | No                |
| PUT    | `/api/products/:id` | Actualiza un producto.                         | Token (Admin)     |
| PATCH  | `/api/products/hot` | Actualiza el estado "HOT" de productos.        | Token (Admin)     |
| DELETE | `/api/products/:id` | Elimina un producto.                           | Token (Admin)     |

---

### **Promociones**

| Método | Ruta                | Descripción                                        | Autorización      |
|--------|---------------------|----------------------------------------------------|-------------------|
| POST   | `/api/promotions`   | Crea una promoción para un producto específico.    | Token (Admin)     |
| GET    | `/api/promotions`   | Lista todas las promociones activas.              | No                |

---

### **Pedidos**

| Método | Ruta              | Descripción                                         | Autorización  |
|--------|-------------------|-----------------------------------------------------|---------------|
| POST   | `/api/orders`     | Crea un pedido y calcula automáticamente el total. | Token         |
| GET    | `/api/orders`     | Lista pedidos del usuario autenticado.             | Token         |
| PUT    | `/api/orders/:id` | Actualiza el estado de un pedido (Admin).          | Token (Admin) |

---

## **Características del Backend**

1. **Autenticación y Autorización:**
   - JWT protege rutas sensibles.
   - Roles de usuario (`user`, `admin`).

2. **Gestión de Productos:**
   - CRUD completo para productos.
   - Gestión de stock al procesar pedidos.
   - Actualización de estado "HOT" basada en criterios:
     - Promociones activas (>20% descuento).
     - Ventas recientes (10 o más en los últimos 7 días).

3. **Gestión de Pedidos:**
   - Cálculo automático del total del pedido.
   - Acumulación de puntos basada en el monto del pedido.
   - Actualización de estados: `Pending`, `Preparing`, `Ready`, `Completed`.

4. **Sistema de Puntos:**
   - 1 punto por cada $100 CLP en compras superiores a $4,000 CLP.
   - Visualización de puntos acumulados por usuario.

5. **Gestión de Promociones:**
   - Promociones vinculadas a productos específicos.
   - Tiempo de expiración configurable.
   - Interacción con el estado "HOT" de productos.

6. **Tareas Automáticas:**
   - Uso de `node-cron` para actualizar el estado "HOT" de productos cada hora, basado en promociones y ventas recientes.

7. **Planificación Automática**
   - **Cron Jobs:** Las tareas automáticas actualizan dinámicamente el estado "HOT" de productos cada hora.
   - **Criterios para "HOT":**
      1. Productos con promociones activas (>20% descuento).
      2. Productos con 10 o más ventas en los últimos 7 días.
   - **Uso:** No requiere intervención manual para mantener actualizados los productos destacados.


---

## **Pruebas**

Puedes usar **Postman** u otra herramienta similar para probar la API. Asegúrate de incluir un token válido en las rutas protegidas.

### **Ejemplo: Crear Promoción**
1. **Método:** `POST`
2. **URL:** `http://localhost:4000/api/promotions`
3. **Headers:**
   - `Authorization`: `Bearer <TOKEN_ADMIN>`
4. **Body:**
   ```json
   {
     "productId": 1,
     "discount": 20, <-- Porcentaje
     "duration": 48  <-- Horas
   }
   ```

### **Respuesta Esperada:**
```json
{
  "id": 1,
  "productId": 1,
  "discount": 20,
  "duration": 48,
  "expiresAt": "2024-11-25T14:00:00.000Z",
  "createdAt": "2024-11-23T14:00:00.000Z",
  "updatedAt": "2024-11-23T14:00:00.000Z"
}
```

---

## **Contribución**

1. Crea un fork del repositorio.
2. Realiza cambios en una rama nueva.
3. Envía un pull request con una descripción clara de tus cambios.

---
