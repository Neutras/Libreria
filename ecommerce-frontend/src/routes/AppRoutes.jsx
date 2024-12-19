import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import MainLayout from '../layouts/MainLayout';
import Home from '../pages/Home';
import Products from '../pages/Products';
import Cart from '../pages/Cart';
import Checkout from '../pages/Checkout';
import Login from '../pages/Login';
import Register from '../pages/Register';
import Profile from '../pages/Profile';
import ImageUpload from '../pages/ImageUpload';
import AdminDashboard from '../pages/admin/AdminDashboard'; // Dashboard de Admin
import UserManagement from '../pages/admin/UserManagement'; // Subcomponentes de administración
import OrderManagement from '../pages/admin/OrderManagement'; // Subcomponentes de administración
import ProductManagement from '../pages/admin/ProductManagement'; // Subcomponentes de administración

const AppRoutes = () => {
  return (
    <Router>
      <Routes>
        {/* Todas las rutas comparten el mismo MainLayout */}
        <Route element={<MainLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/products" element={<Products />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/account" element={<Profile />} />
          <Route path="/image-upload" element={<ImageUpload />} />

          {/* Rutas para Administración */}
          <Route path="/admin">
            <Route index element={<AdminDashboard />} /> {/* Página principal */}
            <Route path="users" element={<UserManagement />} /> {/* Gestión de Usuarios */}
            <Route path="orders" element={<OrderManagement />} /> {/* Gestión de Pedidos */}
            <Route path="products" element={<ProductManagement />} /> {/* Gestión de Productos */}
          </Route>
        </Route>
      </Routes>
    </Router>
  );
};

export default AppRoutes;
