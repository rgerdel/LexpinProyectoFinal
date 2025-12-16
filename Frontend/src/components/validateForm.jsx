const validateForm = () => {
  const errors = {};

  // Validar nombre (solo letras)
  if (!/^[A-Za-záéíóúÁÉÍÓÚñÑ ]+$/.test(newUser.nombre)) {
    errors.nombre = "El nombre debe contener solo letras.";
  }

  // Validar apellido (solo letras)
  if (!/^[A-Za-záéíóúÁÉÍÓÚñÑ ]+$/.test(newUser.apellido)) {
    errors.apellido = "El apellido debe contener solo letras.";
  }

  // Validar email (formato correcto)
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(newUser.email)) {
    errors.email = "El email no es válido.";
  }

  // Validar password (mínimo 8 caracteres, al menos 1 mayúscula, 1 minúscula, 1 número y 1 carácter especial)
  if (!/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z\d\s])[A-Za-z\d\s\W_]{8,}$/.test(newUser.password)) {
    errors.password = "La contraseña debe tener al menos 8 caracteres, incluyendo al menos una mayúscula, una minúscula, un número y un carácter especial.";
  }

  return errors;
};