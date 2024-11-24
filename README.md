
# E-Commerce
---

## **Tecnologías Utilizadas**

- **Node.js:** Plataforma de desarrollo backend.
- **Express.js:** Framework para construir la API RESTful.
- **Prisma ORM:** Gestión y consultas de base de datos.
- **PostgreSQL:** Base de datos relacional.
- **JWT (JSON Web Tokens):** Para autenticación y autorización.
- **Nodemon:** Herramienta para desarrollo con reinicio automático.

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
| DELETE | `/api/products/:id` | Elimina un producto.                           | Token (Admin)     |

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

3. **Gestión de Pedidos:**
   - Cálculo automático del total del pedido.
   - Acumulación de puntos basada en el monto del pedido.
   - Actualización de estados: `Pending`, `Preparing`, `Ready`, `Completed`.

4. **Sistema de Puntos:**
   - 1 punto por cada $100 CLP en compras superiores a $4,000 CLP.
   - Visualización de puntos acumulados por usuario.

---

## **Pruebas**

Puedes usar **Postman** u otra herramienta similar para probar la API. Asegúrate de incluir un token válido en las rutas protegidas.

### **Ejemplo: Crear Pedido**
1. **Método:** `POST`
2. **URL:** `http://localhost:4000/api/orders`
3. **Headers:**
   - `Authorization`: `Bearer <TOKEN>`
4. **Body:**
   ```json
   {
     "products": [
       { "productId": 1, "quantity": 2 },
       { "productId": 2, "quantity": 1 }
     ]
   }
   ```

### **Respuesta Esperada:**
```json
{
  "message": "Pedido creado exitosamente.",
  "order": {
    "id": 1,
    "userId": 1,
    "total": 5000,
    "status": "Pending",
    "products": [
      {
        "id": 1,
        "orderId": 1,
        "productId": 1,
        "quantity": 2
      },
      {
        "id": 2,
        "orderId": 1,
        "productId": 2,
        "quantity": 1
      }
    ],
    "createdAt": "2024-11-23T14:00:00.000Z",
    "updatedAt": "2024-11-23T14:00:00.000Z"
  }
}
```

---

## **Contribución**

1. Crea un fork del repositorio.
2. Realiza cambios en una rama nueva.
3. Envía un pull request con una descripción clara de tus cambios.

---

## **Licencia**

Este proyecto está bajo la Licencia MIT. Consulta el archivo `LICENSE` para más detalles.
```

Puedes copiar este contenido en el archivo `README.md` de tu proyecto en GitHub. Si necesitas agregar algo más o ajustar detalles, ¡avísame! 😊
