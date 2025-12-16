// src/utils/auth.js
import Cookies from 'js-cookie';

export const logout = () => {
  // Borrar la cookie del token
  Cookies.remove('token');
  // Otras acciones de limpieza si es necesario
};