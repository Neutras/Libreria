import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// Páginas Base
const Home = () => <h1>Página de Inicio</h1>;
const Products = () => <h1>Productos</h1>;
const NotFound = () => <h1>404 - Página No Encontrada</h1>;

const AppRoutes = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/products" element={<Products />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
};

export default AppRoutes;
