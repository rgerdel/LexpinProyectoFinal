import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { logout } from '../utils/auth';
import Header from '../components/Header.jsx';

function AdministradorDashboard() {

    const { id } = useParams();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [usuario, setUsuario] = useState(null);
    const [usuarioActual, setUsuarioActual] = useState(null); // Estado para el usuario actual

      useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await fetch(`http://localhost:3000/api/usuario/${id}`);
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json();
        setUsuarioActual(data); // Actualizar el estado del usuario actual
        setLoading(false);
      } catch (error) {
        setError(error.message);
        setLoading(false);
      }
    };

    fetchUser();
  }, [id]);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

    const handleViewProfile = () => {
    // Almacenar la URL actual antes de redirigir
    const currentPath = window.location.pathname;
    navigate(`/perfil/${id}?from=${encodeURIComponent(currentPath)}`);
    };

  if (loading) return <p>Cargando...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
<div class="max-w-5xl mx-auto px-4 py-0">
    <Header usuario={usuarioActual} id={id} />
    <div class="px-4 py-5 border border-gray-300 flex items-center justify-between bg-gray-300">
        <div class="flex items-center space-x-2 text-xs font-bold">
            PANEL DEL  {usuarioActual?.rol.toUpperCase() || ''}
        </div>
        <div class="flex items-center space-x-4 font-bold text-sm">
            BIENVENIDO 
        </div>
    </div>
    <div class="flex justify-between gap-4 px-2 py-8 bg-gray-400">
        <div class="bg-gray-200 h-40 rounded-2xl border border-gray-400 p-4 text-center w-full sm:w-1/3 md:w-1/3 lg:w-1/3 relative">
            <p className="text-1xl font-bold text-gray-800 uppercase">Gestion de Usuarios</p>
            <p className="text-sm text-justify">Administrar profesores y estudiantes. 
                <br></br>Registra y administra usuarios del sistema.</p>
            <br></br>
            <p class="mb-20 relative">
                <a href={`/usuarios/${id}`} class="bg-blue-500 hover:bg-blue-700 text-white  py-2 px-2 rounded text-xs absolute bottom--10 right-0 mb-4 mr-4 w-20 h-8">
                    <i class="fa-solid fa-circle-check"></i> Entrar
                </a>
            </p>
        </div>
        <div class="bg-gray-200 h-40 rounded-2xl border border-gray-400 p-4 text-center w-full sm:w-1/3 md:w-1/3 lg:w-1/3 relative">
            <p className="text-1xl font-bold text-gray-800 uppercase">Gestion de Asignaturas</p>
            <p className="text-sm text-justify">Administrar asignaturas.<br></br> Crea y asigna materias a profesores.</p>
            <br></br>
            <p class="mb-20 relative">
                <a href={`/asignaturas/${id}`} class="bg-blue-500 hover:bg-blue-700 text-white  py-2 px-2 rounded text-xs absolute bottom--10 right-0 mb-4 mr-4 w-20 h-8">
                    <i class="fa-solid fa-circle-check"></i> Entrar
                </a>
            </p>
        </div>
        <div class="bg-gray-200 h-40 rounded-2xl border border-gray-400 p-4 text-center w-full sm:w-1/3 md:w-1/3 lg:w-1/3">
            <p className="text-1xl font-bold text-gray-800 uppercase">Gestion de Grados</p>
            <p className="text-sm text-justify">Administrar niveles académicos.<br></br> Organiza estudiantes por grados.</p>
            <br></br>
            <p class="mb-20 relative">
                <a href={`/estudiantesgrados/${id}`} class="bg-blue-500 hover:bg-blue-700 text-white  py-2 px-2 rounded text-xs absolute bottom--10 right-0 mb-4 mr-4 w-20 h-8">
                    <i class="fa-solid fa-circle-check"></i> Entrar
                </a>
            </p>
        </div>
    </div> 
</div>
  );
}

export { AdministradorDashboard }