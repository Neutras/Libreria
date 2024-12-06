import React, { useState } from 'react';
import AuthForm from '../components/AuthForm';
import authService from '../services/authService';
import { useNavigate } from 'react-router-dom';
import ToastNotification from '../components/ToastNotification';  // Asegúrate de tener el componente de ToastNotification

const Register = () => {
  const [globalError, setGlobalError] = useState('');
  const [showSuccessToast, setShowSuccessToast] = useState(false);  // Estado para mostrar el toast
  const navigate = useNavigate();

  const handleRegister = async ({ name, email, password }) => {
    try {
      const success = await authService.register({ name, email, password });
      if (success) {
        console.log('Registro exitoso, token almacenado:', localStorage.getItem('token')); // Verifica el token
        
        // Mostrar el toast de éxito
        setShowSuccessToast(true);
        
        // Redirigir después de unos segundos (para que el usuario vea el mensaje)
        setTimeout(() => {
          navigate('/login'); // Redirige al login
        }, 3000); // 3 segundos de retraso antes de la redirección
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

      {/* Mostrar el toast cuando el registro sea exitoso */}
      {showSuccessToast && (
        <ToastNotification
          message="Registro exitoso. Redirigiendo al inicio de sesión..."
          show={showSuccessToast}
          onClose={() => setShowSuccessToast(false)}
        />
      )}
    </div>
  );
};

export default Register;