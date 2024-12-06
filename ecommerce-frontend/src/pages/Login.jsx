import React, { useState } from 'react';
import AuthForm from '../components/AuthForm';
import authService from '../services/authService';

const Login = () => {
  const [globalError, setGlobalError] = useState('');

  const handleLogin = async ({ email, password }) => {
    try {
      const success = await authService.login({ email, password });
      if (success) {
        console.log('Inicio de sesión exitoso, token almacenado:', localStorage.getItem('token')); // Verifica el token
        window.location.href = '/';
      } else {
        setGlobalError('Error en el inicio de sesión. Verifica tus credenciales.');
      }
    } catch (error) {
      console.error('Error en login:', error);
      setGlobalError('Hubo un problema con el servidor. Intenta nuevamente más tarde.');
    }
  };

  return (
    <div className="auth-page">
      <AuthForm type="login" onSubmit={handleLogin} globalError={globalError} />
    </div>
  );
};

export default Login;