// src/components/Header.jsx
// Header es un encabezado que se muestra en la parte superior de la aplicación.

import { useNavigate } from 'react-router-dom';

const Header = ({ usuario, id }) => {
  const navigate = useNavigate();

  // handleViewProfile Maneja el clic en el botón "VER PERFIL". 
  // Redirige al usuario a la página de perfil, pasando la URL actual como parámetro.
  const handleViewProfile = () => {
    const currentPath = window.location.pathname;
    navigate(`/perfil/${id}?from=${encodeURIComponent(currentPath)}`);
  };

  //handleLogout: Maneja el clic en el botón "CERRAR SESION". 
  // Redirige al usuario a la página de inicio de sesión.
  const handleLogout = () => {
    //cerrar sesión
    console.log('Cerrar sesión');
    navigate('/login');
  };

  return (
    <div className="px-4 py-5 border border-gray-300 flex items-center justify-between bg-gray-300">
      <div className="flex items-center">
        <span className="text-4xl font-bold">
          Sistema de Gestion Estudiantil
          <span style={{ color: 'red' }}> (SGE)</span>
        </span>
      </div>
      <div className="flex flex-col items-end space-y-2">
        <span className="font-bold text-sm">
          {usuario?.nombre.toUpperCase() || ''} {usuario?.apellido.toUpperCase() || ''}
        </span>
        <button
          className="text-blue-500 hover:text-blue-700 text-xs font-bold"
          onClick={handleViewProfile}
        >
          <i className="fa-regular fa-address-card"></i> VER PERFIL
        </button>
        <button
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-2 rounded text-xs"
          onClick={handleLogout}
        >
          <i className="fa-solid fa-xmark"></i> CERRAR SESION
        </button>
      </div>
    </div>
  );
};

export default Header; //Exporto el componete creado arriba const Header