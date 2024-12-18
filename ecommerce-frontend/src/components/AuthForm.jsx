import React, { useState } from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import Button from "./Button";
import TermsModal from "./TermsModal";
import { validateEmail, validatePassword, validateName } from "../utils/validation";
import ToastNotification from "./ToastNotification";
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
  const [toastMessage, setToastMessage] = useState("");

  const [disableSubmit, setDisableSubmit] = useState(false); // Bloquear el botón de registro temporalmente

  // Validaciones en tiempo real
  const validateField = (field, value) => {
    const newErrors = { ...errors };

    switch (field) {
      case "name":
        newErrors.name = validateName(value)
          ? null
          : "El nombre debe tener al menos 2 caracteres.";
        break;
      case "email":
        newErrors.email = validateEmail(value) ? null : "Correo inválido.";
        break;
      case "password":
        newErrors.password = validatePassword(value)
          ? null
          : "La contraseña debe tener al menos 8 caracteres, una mayúscula, una minúscula y un número.";
        break;
      case "confirmPassword":
        newErrors.confirmPassword =
          value === password ? null : "Las contraseñas no coinciden.";
        break;
      default:
        break;
    }

    setErrors(newErrors);
  };

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
    setDisableSubmit(true); // Bloquear botón de registro

    const data = { email: email.toLowerCase(), password, rememberMe };
    if (type === "register") data.name = name;

    try {
      await onSubmit(data);
      if (type === "register") {
        setToastMessage("Registro exitoso. Redirigiendo al inicio de sesión...");
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

        {toastMessage && (
          <ToastNotification
            message={toastMessage}
            show={true}
            onClose={() => {
              setToastMessage("");
              setDisableSubmit(false); // Reactivar el botón después de cerrar el toast
            }}
          />
        )}

        {globalError && <div className="alert alert-danger text-center">{globalError}</div>}

        <form onSubmit={handleSubmit}>
          {type === "register" && (
            <div className="form-group">
              <label htmlFor="name" className="form-label">Nombre</label>
              <input
                type="text"
                id="name"
                className={`form-control ${errors.name ? "is-invalid" : ""}`}
                placeholder="Ingresa tu nombre"
                value={name}
                onChange={(e) => {
                  setName(e.target.value);
                  validateField("name", e.target.value);
                }}
              />
              {errors.name && <div className="invalid-feedback">{errors.name}</div>}
            </div>
          )}

          <div className="form-group">
            <label htmlFor="email" className="form-label">Correo electrónico</label>
            <input
              type="email"
              id="email"
              className={`form-control ${errors.email ? "is-invalid" : ""}`}
              placeholder="Ingresa tu email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                validateField("email", e.target.value);
              }}
            />
            {errors.email && <div className="invalid-feedback">{errors.email}</div>}
          </div>

          <div className="form-group">
            <label htmlFor="password" className="form-label">Contraseña</label>
            <input
              type={showPassword ? "text" : "password"}
              id="password"
              className={`form-control ${errors.password ? "is-invalid" : ""}`}
              placeholder="Ingresa tu contraseña"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                validateField("password", e.target.value);
              }}
            />
            {errors.password && <div className="invalid-feedback">{errors.password}</div>}
            <div className="form-check mt-2">
              <input
                type="checkbox"
                className="form-check-input"
                id="showPassword"
                checked={showPassword}
                onChange={() => setShowPassword(!showPassword)}
              />
              <label className="form-check-label" htmlFor="showPassword">Mostrar contraseña</label>
            </div>
          </div>

          {type === "register" && (
            <>
              <div className="form-group">
                <label htmlFor="confirmPassword" className="form-label">Confirmar contraseña</label>
                <input
                  type="password"
                  id="confirmPassword"
                  className={`form-control ${errors.confirmPassword ? "is-invalid" : ""}`}
                  placeholder="Confirma tu contraseña"
                  value={confirmPassword}
                  onChange={(e) => {
                    setConfirmPassword(e.target.value);
                    validateField("confirmPassword", e.target.value);
                  }}
                />
                {errors.confirmPassword && <div className="invalid-feedback">{errors.confirmPassword}</div>}
              </div>

              <div className="form-check mb-3 d-flex align-items-center">
                <input
                  type="checkbox"
                  className="form-check-input"
                  id="terms"
                  checked={termsAccepted}
                  onChange={() => setTermsAccepted(!termsAccepted)}
                />
                <label className="form-check-label ms-2" htmlFor="terms">
                  Acepto los{" "}
                  <button type="button" className="btn btn-link p-0 align-baseline" onClick={toggleModal}>
                    términos y condiciones
                  </button>
                </label>
                {errors.terms && <div className="invalid-feedback d-block">{errors.terms}</div>}
              </div>
            </>
          )}

          <Button
            type="submit"
            className="btn btn-primary w-100"
            disabled={loading || disableSubmit} // Desactivar botón si está cargando o mostrando toast
          >
            {loading ? "Cargando..." : type === "login" ? "Iniciar sesión" : "Registrarse"}
          </Button>
        </form>

        <div className="text-center mt-3">
          {type === "login" ? (
            <>
              ¿No tienes cuenta?{" "}
              <Link to="/register" className="text-primary">Regístrate aquí</Link>
            </>
          ) : (
            <>
              ¿Ya tienes cuenta?{" "}
              <Link to="/login" className="text-primary">Inicia sesión aquí</Link>
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