import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { logout } from '../utils/auth';
import Header from '../components/Header.jsx';

function EstudianteDashboard() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [usuarioActual, setUsuarioActual] = useState(null);
  const [tareas, setTareas] = useState([]);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await fetch(`http://localhost:3000/api/usuario/${id}`);
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json();
        setUsuarioActual(data);
      } catch (error) {
        setError(error.message);
      }
    };

    const fetchTareas = async () => {
      try {
        const response = await fetch(`http://localhost:3000/api/tareas/estudiante/${id}`);
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json();
        setTareas(data);
      } catch (error) {
        console.error("Error al obtener las tareas:", error);
        setError("Error al obtener las tareas: " + error.message);
      }
    };

    Promise.all([fetchUser(), fetchTareas()])
      .then(() => setLoading(false))
      .catch((error) => {
        setError(error.message);
        setLoading(false);
      });
  }, [id]);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleViewProfile = () => {
    const currentPath = window.location.pathname;
    navigate(`/perfil/${id}?from=${encodeURIComponent(currentPath)}`);
  };

  //if (loading) return <p>Cargando...</p>;
  //if (error) return <p>Error: {error}</p>;
  
  return (
    <div class="max-w-5xl mx-auto px-4 py-8">
      <div class="px-4 py-5 border border-gray-200 flex items-center justify-between">
        <div class="flex items-center">
          <span class="text-2xl font-bold">SISTEMA DE GESTION ESTUDIANTIL</span>
        </div>
        <div class="flex flex-col items-end space-y-2">
          <span class="font-semibold text-sm">{usuarioActual?.nombre.toUpperCase() || ''} {usuarioActual?.apellido.toUpperCase() || ''}</span>
          <button
            className="text-blue-500 hover:text-blue-700 text-xs font-bold"
            onClick={handleViewProfile}
          >
            <i className="fa-regular fa-address-card"></i> VER PERFIL
          </button>
          <button class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-2 rounded text-xs" onClick={handleLogout}>
            <i class="fa-solid fa-xmark"></i> CERRAR SESION
          </button>
        </div>
      </div>
      <div class="px-4 py-5 border border-gray-200 flex items-center justify-between">
        <div class="flex items-center space-x-2 text-sm font-bold">
          Panel del {usuarioActual?.rol.toUpperCase() || ''}
        </div>
        <div class="flex items-center space-x-4 font-bold text-sm">
          BIENVENIDO
        </div>
      </div>
      <div class="bg-gray-200 px-0 py-5 border border-gray-200">
        <div class="flex flex-wrap justify-center gap-10">
          <div class="bg-white border border-gray-400 p-4 text-left w-full sm:w-1/2 md:w-1/3 lg:w-1/5">
            <span class="text-sm font-semibold">Tareas Totales:</span>
          </div>
          <div class="bg-white border border-gray-400 p-4 text-left w-full sm:w-1/2 md:w-1/3 lg:w-1/5">
            <span class="text-sm font-bold">Pendientes:</span>
          </div>
          <div class="bg-white border border-gray-400 p-4 text-left w-full sm:w-1/2 md:w-1/3 lg:w-1/5">
            <span class="text-sm font-bold">Entregadas:</span>
          </div>
          <div class="bg-white border border-gray-400 p-4 text-left w-full sm:w-1/2 md:w-1/3 lg:w-1/5">
            <span class="text-sm font-bold">Evaluadas:</span>
          </div>
        </div>
      </div>

      

      <div class="bg-gray-200 px-4 py-5 border border-gray-200">
        {tareas.map((tarea, index) => (
          <div key={index} class="flex flex-col md:flex-row md:items-center md:justify-between p-4 bg-white shadow-md rounded-md mb-4">
            <div class="flex flex-col md:w-3/4">
              <div class="flex items-center justify-between mb-2">
                <span class="text-sm font-bold">Materia: {tarea.asignatura}</span>
              </div>
              <div class="flex items-center justify-between mb-2">
                <span class="text-sm font-bold">Título de la Tarea: {tarea.tituloTarea}</span>
              </div>
              <div class="flex items-center justify-between mb-2">
                <span class="text-sm">Descripción: {tarea.descripcionTarea}</span>
              </div>
              <div class="flex items-center justify-between mb-2">
                <span class="text-sm font-bold text-red-600">PENDIENTE</span>
              </div>
            </div>
            <div class="flex items-center justify-center md:w-1/6">
              <a href="#" class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"><i class="fa-solid fa-list-check"></i> Entregar</a>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export { EstudianteDashboard };