import { Outlet, Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import 'bootstrap/dist/css/bootstrap.min.css';

const MainLayout = () => {
  return (
    <>
      <Navbar />
      <main>
        <Outlet />
      </main>
      <footer>
        <p>© 2024 Librería E-Commerce</p>
      </footer>
    </>
  );
};

export default MainLayout;