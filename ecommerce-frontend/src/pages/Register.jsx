import React, { useState } from 'react';
import AuthForm from '../components/AuthForm';
import authService from '../services/authService';

const Register = () => {
  const [globalError, setGlobalError] = useState('');

  const handleRegister = async ({ name, email, password }) => {
    try {
      const success = await authService.register({ name, email, password });
      if (success) {
        console.log('Registro exitoso, token almacenado:', localStorage.getItem('token')); // Verifica el token
        alert('Registro exitoso. Ahora puedes iniciar sesión.');
        window.location.href = '/login';
      } else {
        setGlobalError('Error al registrarse. Intenta de nuevo.');
      }
    } catch (error) {
      console.error('Error en register:', error);
      setGlobalError('Hubo un problema con el servidor. Intenta nuevamente más tarde.');
    }
  };

  return (
    <div className="auth-page">
      <AuthForm
        type="register"
        onSubmit={handleRegister}
        globalError={globalError}
      />
    </div>
  );
};

export default Register;