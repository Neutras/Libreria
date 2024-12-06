import React, { useState } from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import Button from "./Button";
import TermsModal from "./TermsModal";
import { validateEmail, validatePassword, validateName } from "../utils/validation";
import ToastNotification from "./ToastNotification";  // Asegúrate de tener este componente para los toasts
import "./AuthForm.scss";

const AuthForm = ({ type, onSubmit, globalError }) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [toastMessage, setToastMessage] = useState("");  // Para mostrar el mensaje del toast

  const handlePasswordVisibility = () => setShowPassword(!showPassword);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = {};

    if (type === "register" && !validateName(name)) {
      validationErrors.name = "El nombre debe tener al menos 2 caracteres.";
    }
    if (!validateEmail(email)) {
      validationErrors.email = "Correo inválido.";
    }
    if (!validatePassword(password)) {
      validationErrors.password =
        "La contraseña debe tener al menos 8 caracteres, una mayúscula, una minúscula y un número.";
    }
    if (type === "register" && password !== confirmPassword) {
      validationErrors.confirmPassword = "Las contraseñas no coinciden.";
    }
    if (type === "register" && !termsAccepted) {
      validationErrors.terms = "Debes aceptar los términos y condiciones.";
    }

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setErrors({});
    setLoading(true);

    const data = { email, password, rememberMe };
    if (type === "register") data.name = name;

    try {
      await onSubmit(data, setErrors);
      if (type === "register") {
        setToastMessage("Registro exitoso. Ahora puedes iniciar sesión.");
      }
    } catch (error) {
      setErrors((prev) => ({
        ...prev,
        globalError: "Ocurrió un error inesperado. Intenta nuevamente más tarde.",
      }));
    }

    setLoading(false);
  };

  const toggleModal = () => setShowModal(!showModal);

  return (
    <div className="auth-form-container">
      <div className="auth-form-wrapper">
        <div className="auth-form-header">
          <h2>{type === "login" ? "Iniciar sesión" : "Registrarse"}</h2>
        </div>

        {/* Mostrar el toast de éxito si es necesario */}
        {toastMessage && <ToastNotification message={toastMessage} show={true} onClose={() => setToastMessage("")} />}

        {/* Global error */}
        {globalError && <div className="alert alert-danger text-center">{globalError}</div>}

        <form onSubmit={handleSubmit}>
          {type === "register" && (
            <div className="form-group">
              <label htmlFor="name" className="form-label">
                Nombre
              </label>
              <input
                type="text"
                id="name"
                className={`form-control ${errors.name ? "is-invalid" : name ? "is-valid" : ""}`}
                placeholder="Ingresa tu nombre"
                value={name}
                onChange={(e) => {
                  setName(e.target.value);
                  if (e.target.value && !validateName(e.target.value)) {
                    setErrors((prev) => ({
                      ...prev,
                      name: "El nombre debe tener al menos 2 caracteres.",
                    }));
                  } else {
                    setErrors((prev) => ({ ...prev, name: null }));
                  }
                }}
              />
              {errors.name && <div className="invalid-feedback">{errors.name}</div>}
            </div>
          )}

          <div className="form-group">
            <label htmlFor="email" className="form-label">
              Correo electrónico
            </label>
            <input
              type="email"
              id="email"
              className={`form-control ${errors.email ? "is-invalid" : email ? "is-valid" : ""}`}
              placeholder="Ingresa tu email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                if (e.target.value && !validateEmail(e.target.value)) {
                  setErrors((prev) => ({
                    ...prev,
                    email: "Correo inválido.",
                  }));
                } else {
                  setErrors((prev) => ({ ...prev, email: null }));
                }
              }}
            />
            {errors.email && <div className="invalid-feedback">{errors.email}</div>}
          </div>

          <div className="form-group">
            <label htmlFor="password" className="form-label">
              Contraseña
            </label>
            <div className="input-group">
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                className={`form-control ${errors.password ? "is-invalid" : password ? "is-valid" : ""}`}
                placeholder="Ingresa tu contraseña"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  if (e.target.value && !validatePassword(e.target.value)) {
                    setErrors((prev) => ({
                      ...prev,
                      password:
                        "La contraseña debe tener al menos 8 caracteres, una mayúscula, una minúscula y un número.",
                    }));
                  } else {
                    setErrors((prev) => ({ ...prev, password: null }));
                  }
                }}
              />
              <button
                type="button"
                className="btn btn-outline-secondary"
                onClick={handlePasswordVisibility}
              >
                <i className={`bi ${showPassword ? "bi-eye-slash" : "bi-eye"}`}></i>
              </button>
            </div>
            {errors.password && <div className="invalid-feedback">{errors.password}</div>}
          </div>

          {type === "register" && (
            <div className="form-group">
              <label htmlFor="confirmPassword" className="form-label">
                Confirmar contraseña
              </label>
              <input
                type="password"
                id="confirmPassword"
                className={`form-control ${errors.confirmPassword ? "is-invalid" : confirmPassword ? "is-valid" : ""}`}
                placeholder="Confirma tu contraseña"
                value={confirmPassword}
                onChange={(e) => {
                  setConfirmPassword(e.target.value);
                  if (e.target.value && password !== e.target.value) {
                    setErrors((prev) => ({
                      ...prev,
                      confirmPassword: "Las contraseñas no coinciden.",
                    }));
                  } else {
                    setErrors((prev) => ({ ...prev, confirmPassword: null }));
                  }
                }}
              />
              {errors.confirmPassword && <div className="invalid-feedback">{errors.confirmPassword}</div>}
            </div>
          )}

          {type === "register" && (
            <div className="form-group form-check">
              <input
                type="checkbox"
                className="form-check-input"
                id="terms"
                checked={termsAccepted}
                onChange={(e) => setTermsAccepted(e.target.checked)}
              />
              <label className="form-check-label" htmlFor="terms">
                Acepto los{" "}
                <button type="button" className="btn btn-link p-0" onClick={toggleModal}>
                  términos y condiciones
                </button>
              </label>
              {errors.terms && <div className="invalid-feedback">{errors.terms}</div>}
            </div>
          )}

          <Button type="submit" className="btn btn-primary w-100" disabled={loading}>
            {loading ? (
              <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
            ) : type === "login" ? (
              "Iniciar sesión"
            ) : (
              "Registrarse"
            )}
          </Button>
        </form>

        <div className="mt-3 text-center">
          {type === "login" ? (
            <>
              ¿No tienes cuenta?{" "}
              <Link to="/register" className="text-primary">
                Regístrate aquí
              </Link>
              <br />
              ¿Olvidaste tu contraseña?{" "}
              <Link to="/forgot-password" className="text-primary">
                Recuperar acceso
              </Link>
            </>
          ) : (
            <>
              ¿Ya tienes cuenta?{" "}
              <Link to="/login" className="text-primary">
                Inicia sesión aquí
              </Link>
            </>
          )}
        </div>

        <TermsModal show={showModal} onHide={toggleModal} />
      </div>
    </div>
  );
};

AuthForm.propTypes = {
  type: PropTypes.oneOf(["login", "register"]).isRequired,
  onSubmit: PropTypes.func.isRequired,
  globalError: PropTypes.string,
};

AuthForm.defaultProps = {
  globalError: null,
};

export default AuthForm;