

# E-Commerce Frontend

Este es el frontend del sistema de E-Commerce desarrollado con React, Bootstrap, Axios, y otras herramientas modernas de JavaScript.

---

## **Tecnologías Utilizadas**

- **React:** Biblioteca para la creación de interfaces de usuario.
- **React Router:** Gestión de rutas para la navegación entre páginas.
- **Axios:** Cliente HTTP para la comunicación con el backend.
- **Bootstrap:** Framework de diseño para crear interfaces responsivas y modernas.
- **React Icons:** Biblioteca de iconos para una mejor UI.
- **JWT (JSON Web Tokens):** Autenticación y autorización.
- **React Bootstrap Modal:** Para la creación de modales en la interfaz.

---

## **Instalación**

### **Requisitos Previos**
1. **Node.js** y **npm** instalados.
2. Asegúrate de que el backend esté corriendo en el puerto correcto.

### **Pasos**

1. Clona este repositorio:
   ```bash
   git clone <URL_DEL_REPOSITORIO>
   cd ecommerce-frontend
   ```

2. Instala las dependencias:
   ```bash
   npm install
   ```

3. Ejecuta el servidor de desarrollo:
   ```bash
   npm start
   ```

4. El frontend estará disponible en `http://localhost:5173`.

---

## **Estructura del Proyecto**

La estructura del proyecto es la siguiente:

```
ecommerce-frontend/
├── public/                 # Archivos públicos (imágenes, favicon, etc.)
├── src/
│   ├── components/         # Componentes reutilizables (Botón, Toast, Modal, etc.)
│   ├── context/            # Contextos de estado global (Carrito, Autenticación)
│   ├── pages/              # Páginas del proyecto (Home, Login, Register, Profile)
│   ├── services/           # Lógica de acceso a datos (AuthService, OrderService)
│   ├── utils/              # Utilidades (Validación, etc.)
│   └── App.js              # Componente raíz de la aplicación
├── package.json            # Dependencias y scripts
└── README.md               # Este archivo
```

---

## **Rutas y Páginas Principales**

### **Rutas de Usuario**

| Ruta                  | Descripción                                    | Autenticación       |
|-----------------------|------------------------------------------------|---------------------|
| `/`                   | Página principal del E-Commerce                | No                  |
| `/login`              | Página de inicio de sesión                     | No                  |
| `/register`           | Página de registro                             | No                  |
| `/account`            | Página de perfil de usuario                    | Token               |
| `/cart`               | Página del carrito de compras                 | Token               |
| `/order-confirmation` | Página de confirmación de pedido               | Token               |

### **Componentes Importantes**

- **AuthForm:** Formulario utilizado para el inicio de sesión y registro. Validaciones de entrada y feedback de errores.
- **Navbar:** Barra de navegación con enlaces a las secciones principales, carrito y opciones de usuario.
- **Profile:** Página donde el usuario puede ver su información, pedidos anteriores y puntos.
- **OrderDetails:** Modal o sección que muestra los detalles de un pedido cuando el usuario hace clic en "Ver detalles".
- **Button:** Botón reutilizable con estilos personalizados.
- **ToastNotification:** Componente para mostrar notificaciones tipo toast.

---

## **Características del Frontend**

1. **Autenticación y Autorización:**
   - Uso de JWT para la autenticación de usuarios.
   - Persistencia del token en `localStorage` para mantener la sesión activa.
   - Proceso de inicio de sesión y registro con validaciones adecuadas.

2. **Gestión de Carrito:**
   - El carrito es administrado globalmente mediante un contexto.
   - Los productos pueden ser añadidos, eliminados o modificados en cantidad.

3. **Sección de Perfil:**
   - El usuario puede ver su perfil, su correo, nombre y puntos acumulados.
   - Acceso a la lista de pedidos, que se muestra en una tabla optimizada con una barra de progreso para el estado del pedido.
   - Función para cambiar la contraseña y canjear puntos.

4. **Interfaz de Usuario:**
   - Estilo moderno utilizando **Bootstrap** para una experiencia fluida.
   - **Modales** para confirmación de acciones o ver detalles del pedido.
   - **Notificaciones de tipo toast** para mostrar mensajes importantes al usuario.

5. **Páginas Responsivas:**
   - El diseño es completamente responsivo, adaptándose a dispositivos móviles y escritorio usando **Bootstrap**.
   
---

## **Integración con el Backend**

### **Autenticación**

- Al iniciar sesión o registrarse, se obtiene un token JWT que es almacenado en el `localStorage`. Este token es usado para acceder a las rutas protegidas del backend.

### **Pedidos**

- Al acceder a `/account`, se realiza una consulta al backend para obtener los pedidos del usuario autenticado, mostrando la lista de pedidos en una tabla. Los pedidos incluyen información sobre el estado, productos, y precio total.
- Además, se pueden ver los detalles de cada pedido con un modal que muestra el estado, productos y puntos acumulados.

---

## **Próximos Pasos**

1. **Mejoras en la experiencia de usuario:**
   - Implementar paginación o scroll infinito para la lista de pedidos si se espera una gran cantidad de datos.
   - Añadir más interacciones en el carrito, como descuentos por cantidad o promociones.
   
2. **Validaciones adicionales:**
   - Ampliar las validaciones del frontend en cuanto a formatos de dirección, teléfono, etc.

3. **Implementar el pago:**
   - Integrar con alguna API de pagos como **MercadoPago Checkout** para procesar los pagos del cliente.

4. **Optimización:**
   - Revisar la carga y optimización de imágenes para mejorar los tiempos de carga.
   - Implementar lazy loading para componentes y rutas.

---

## **Problemas Conocidos**

1. **Fondo opaco en modales**: En algunas ocasiones, el fondo opaco de los modales se muestra encima de la propia modal, bloqueando la interacción. Esto se puede resolver ajustando las capas de z-index.
   
2. **Redirección después de logout**: La página no se actualiza completamente después de hacer logout. Esto se soluciona redirigiendo al usuario a la página de login después del cierre de sesión.

---

Este README puede y será modificado en base a nuevas funcionalidades o cambios en la arquitectura del frontend a medida que el proyecto evoluciona.

---
