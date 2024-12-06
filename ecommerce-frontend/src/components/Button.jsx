import React from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import "./Button.scss";

const Button = ({ className, children, onClick, as, to, ...rest }) => {
  const Component = as || "button"; // Por defecto es un botón, pero puede ser un enlace

  return (
    <Component
      className={`btn ${className}`}
      onClick={onClick}
      {...(as === Link && { to })}
      {...rest}
    >
      {children}
    </Component>
  );
};

Button.propTypes = {
  className: PropTypes.string,
  children: PropTypes.node.isRequired,
  onClick: PropTypes.func,
  as: PropTypes.elementType,
  to: PropTypes.string,
};

Button.defaultProps = {
  className: "",
  onClick: undefined,
  as: "button",
  to: undefined,
};

export default Button;
