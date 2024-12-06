// Valida que un correo electrónico tenga un formato válido
export const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };
  
  // Valida que una contraseña cumpla ciertos criterios (mínimo 8 caracteres, al menos 1 número)
  export const validatePassword = (password) => {
    const passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}$/;
    return passwordRegex.test(password);
  };
  
  // Valida que el nombre no esté vacío y tenga al menos 2 caracteres
  export const validateName = (name) => {
    return name.trim().length >= 2;
  };
  
  // Función genérica para mostrar mensajes de validación
  export const getValidationMessage = (field, isValid) => {
    if (!isValid) {
      switch (field) {
        case 'email':
          return 'Por favor, introduce un correo electrónico válido.';
        case 'password':
          return 'La contraseña debe tener al menos 8 caracteres, incluyendo una letra mayúscula, una minúscula y un número.';
        case 'name':
          return 'El nombre debe tener al menos 2 caracteres.';
        default:
          return 'Este campo es inválido.';
      }
    }
    return '';
  };  