import React from "react";
import {
  FaPhoneAlt,
  FaEnvelope,
  FaInstagram,
  FaFacebookF,
  FaGithub,
  FaMapMarkerAlt,
} from "react-icons/fa";
import "./Footer.scss";

const Footer = () => {
  return (
    <footer id="footer" className="footer bg-dark text-light py-4">
      <div className="container">
        <div className="row">

          {/* Sección Contacto */}
          <div className="col-md-3 mb-3">
            <h5 className="text-uppercase fw-bold mb-3">Contacto</h5>
            <ul className="list-unstyled">
              <li>
                <FaPhoneAlt className="me-2" />
                Llamar:{" "}
                <a href="tel:+56982082373" className="text-light text-decoration-none">
                  +569 82082373
                </a>
              </li>
              <li>
                <FaEnvelope className="me-2" />
                Email:{" "}
                <a href="mailto:Ventas@libreriasanjavier.cl" className="text-light text-decoration-none">
                  Ventas@libreriasanjavier.cl
                </a>
              </li>
            </ul>
          </div>

          {/* Sección Direcciones */}
          <div className="col-md-3 mb-3">
            <h5 className="text-uppercase fw-bold mb-3">Direcciones</h5>
            <ul className="list-unstyled">
              <li>
                <FaMapMarkerAlt className="me-2" />
                <a
                  href="https://www.google.com/maps?ll=-36.608603,-72.101471&z=15&t=m&hl=es-419&gl=CL&mapclient=embed&cid=14226413108386418680"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-light text-decoration-none"
                >
                  Local 5 de Abril 657 (Galería Radio Ñuble)
                </a>
              </li>
              <li>
                <FaMapMarkerAlt className="me-2" />
                <a
                  href="https://www.google.com/maps?ll=-36.6089,-72.100126&z=15&t=m&hl=es-419&gl=CL&mapclient=embed&cid=4993674946704881421"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-light text-decoration-none"
                >
                  Sucursal Isabel Riquelme 652
                </a>
              </li>
            </ul>
          </div>

          {/* Sección Redes Sociales */}
          <div className="col-md-3 mb-3">
            <h5 className="text-uppercase fw-bold mb-3">Redes Sociales</h5>
            <ul className="list-unstyled">
              <li>
                <FaInstagram className="me-2" />
                <a
                  href="https://www.instagram.com/libreriasanjavier/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-light text-decoration-none"
                >
                  @libreriasanjavier
                </a>
              </li>
              <li>
                <FaFacebookF className="me-2" />
                <a
                  href="https://www.facebook.com/SANJAVIERCHILLAN/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-light text-decoration-none"
                >
                  Librería San Javier Chillán
                </a>
              </li>
            </ul>
          </div>

          {/* Sección GitHub y Desarrollo */}
          {/* Sección GitHub y Desarrollo */}
<div className="col-md-3 mb-3">
  <h5 className="text-uppercase fw-bold mb-3">Sobre el Proyecto</h5>
  <p className="mb-2">
    Sitio web diseñado por{" "}
    <a
      href="https://github.com/Neutras"
      target="_blank"
      rel="noopener noreferrer"
      className="text-light fw-bold text-decoration-none"
    >
      Neutras
    </a>
    .
  </p>
  <p className="mb-2">
    ¿Interesado en contribuir? Explora nuestro repositorio en GitHub.
  </p>
  <a
      href="https://github.com/Neutras/Libreria"
      target="_blank"
      rel="noopener noreferrer"
      className="text-warning text-decoration-underline"
    >
    <FaGithub className="me-2 fs-5" />
    Repositorio del Proyecto
  </a>
</div>
        </div>

        {/* Copyright */}
        <div className="text-center mt-4">
          <p className="mb-0">
            © {new Date().getFullYear()} Librería E-Commerce. Todos los derechos reservados.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;