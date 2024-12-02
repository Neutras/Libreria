# E-Commerce Backend

Este es el backend del sistema de E-Commerce desarrollado con Node.js, Express, Prisma y Socket.IO.

---

## **Tecnologías Utilizadas**

- **Node.js:** Plataforma de desarrollo backend.
- **Express.js:** Framework para construir la API RESTful.
- **Prisma ORM:** Gestión y consultas de base de datos.
- **PostgreSQL:** Base de datos relacional.
- **JWT (JSON Web Tokens):** Autenticación y autorización.
- **Socket.IO:** Implementación de notificaciones en tiempo real.
- **Nodemon:** Herramienta para desarrollo con reinicio automático.

---

## **Instalación**

### **Requisitos Previos**
1. **Node.js** y **npm** instalados.
2. **PostgreSQL** configurado en tu sistema.
3. Archivo `.env` con las siguientes variables:
   ```env
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

| Método | Ruta                  | Descripción                              | Autorización |
|--------|-----------------------|------------------------------------------|--------------|
| POST   | `/api/users/register` | Registro de un nuevo usuario.            | No           |
| POST   | `/api/users/login`    | Inicio de sesión y generación de token.  | No           |
| GET    | `/api/users/profile`  | Obtiene el perfil del usuario autenticado.| Token        |

---

### **Productos**

| Método | Ruta                   | Descripción                                    | Autorización |
|--------|------------------------|------------------------------------------------|--------------|
| POST   | `/api/products`        | Crea un nuevo producto.                        | Token (Admin)|
| GET    | `/api/products`        | Lista todos los productos.                     | No           |
| GET    | `/api/products&isHot=true`        | Lista productos usando query params                    | No           |
| GET    | `/api/products/recommendations`    | Obtiene recomendaciones basadas en el historial de compra o productos destacados.    | Token           |
| GET    | `/api/products/:id`    | Obtiene detalles de un producto específico.    | No           |
| GET    | `/api/products/:id`    | Obtiene detalles de un producto específico.    | No           |
| PUT    | `/api/products/:id`    | Actualiza un producto.                         | Token (Admin)|
| DELETE | `/api/products/:id`    | Elimina un producto.                           | Token (Admin)|

---

### **Pedidos**

| Método | Ruta                  | Descripción                                         | Autorización |
|--------|-----------------------|-----------------------------------------------------|--------------|
| POST   | `/api/orders`         | Crea un pedido.                                     | Token        |
| GET    | `/api/orders`         | Lista pedidos del usuario autenticado o todos (Admin).| Token        |
| GET    | `/api/orders/:id`     | Obtiene detalles de un pedido específico.           | Token        |
| PUT    | `/api/orders/:id`     | Actualiza el estado de un pedido (Admin).           | Token (Admin)|
| DELETE | `/api/orders/:id`     | Cancela un pedido (si está en estado `Pending`).    | Token        |

---

### **Promociones**

| Método | Ruta                     | Descripción                                    | Autorización |
|--------|--------------------------|------------------------------------------------|--------------|
| POST   | `/api/promotions`        | Crea una nueva promoción.                      | Token (Admin)|
| GET    | `/api/promotions`        | Lista todas las promociones activas.           | No           |
| DELETE | `/api/promotions/:id`    | Elimina una promoción específica.              | Token (Admin)|

---

### **Métricas**

| Método | Ruta                             | Descripción                                        | Autorización       |
|--------|----------------------------------|----------------------------------------------------|--------------------|
| GET    | `/api/metrics`                   | Devuelve un resumen general de todas las métricas del sistema. Incluye productos más vendidos, categorías más vendidas, ingresos por período y clientes más activos. | Token (Admin)      |
| GET    | `/api/metrics/top-products`      | Devuelve los productos más vendidos, incluyendo la cantidad total vendida y los ingresos generados por cada uno. | Token (Admin)      |
| GET    | `/api/metrics/top-categories`    | Devuelve las categorías más vendidas, mostrando la cantidad total vendida y los ingresos generados por cada categoría. | Token (Admin)      |
| GET    | `/api/metrics/revenue?period=week` | Calcula los ingresos totales generados en un período específico (día, semana o mes), basándose en las órdenes con estado "Completed". | Token (Admin)      |
| GET    | `/api/metrics/active-customers`  | Devuelve la lista de los clientes más activos, clasificados por la cantidad de pedidos realizados. | Token (Admin)      |

---

### **Extras**

| Método | Ruta               | Descripción                                 | Autorización |
|--------|--------------------|---------------------------------------------|--------------|
| GET    | `/api/alerts`      | Obtiene un listado de las alertas.          | Token (Admin)|
| GET    | `/api/users/points`      | Obtiene puntos del usuario autenticado.          | Token |
| GET    | `/api/:usedId/points`      | Obtiene los puntos del usuario según la ID          | Token (Admin)|

---

### **Websockets (Notificaciones en tiempo real)**

Las notificaciones en tiempo real se gestionan mediante `Socket.IO`:
- **Pedidos:** 
  - Los usuarios reciben notificaciones cuando su pedido es creado o actualizado.
  - Los usuario reciben notificaciones cuando se suman o descuentan puntos.
  - Los administradores son notificados cuando se crea un nuevo pedido.
- **Alertas:**
  - Los administradores reciben notificaciones de bajo stock.

---

## **Características del Backend**

1. **Autenticación y Autorización:**
   - Basada en JWT.
   - Separación de roles (`admin` y `user`).

2. **Notificaciones en tiempo real:**
   - Implementación de `Socket.IO`.
   - Canalización por roles y usuarios.

3. **Gestión de Productos:**
   - CRUD completo para productos.
   - Control de stock.

4. **Gestión de Pedidos:**
   - Cálculo automático del total.
   - Actualización de estados y cancelación.

5. **Sistema de Promociones:**
   - Promociones con condiciones específicas.
   - Gestión automática de promociones expiradas.
  
6. **Sistema de Recomendaciones:**
   - Generación de recomendaciones basadas en el historial de compra del usuario autenticado, si el usuario no tiene un historial de compra recibirá como recomendaciones productos destacados (isHot).

7. **Sistema de Puntos:**
   - Acumulación de puntos por compras mayores a $4,000 CLP.

---

## **Contribución**

1. Haz un fork del repositorio.
2. Crea una rama nueva para tus cambios.
3. Envía un pull request con una descripción clara de tus cambios.

---

## **Pruebas**

Usa **Postman** para probar los endpoints. Asegúrate de incluir un token válido en las rutas protegidas.
