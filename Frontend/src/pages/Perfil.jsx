import { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import Modal from '../components/Modal';

function Perfil() {
  const { id } = useParams();
  const [usuario, setUsuario] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(true); // Abrir el modal automáticamente
  const navigate = useNavigate();
  const location = useLocation();

  const handleUpdateProfile = () => {
    const currentPath = window.location.pathname; // Guardar la URL actual
    navigate(`/updateProfile/${id}?from=${encodeURIComponent(currentPath)}`);
  };

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await fetch(`http://localhost:3000/api/usuario/${id}`);
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json();
        setUsuario(data);
        setLoading(false);
      } catch (error) {
        setError(error.message);
        setLoading(false);
      }
    };

    if (id) {
      fetchUser();
    }
  }, [id]);

  const handleCloseModal = () => {
    setIsModalOpen(false);
    // Redirigir a la página anterior
    const from = new URLSearchParams(location.search).get('from');
    if (from) {
      navigate(decodeURIComponent(from));
    } else {
      navigate('/'); // Redirigir a la página principal si no hay página anterior
    }
  };

  if (loading) return <p>Cargando...</p>;
  if (error) return <p>Error: {error}</p>;

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`http://localhost:3000/api/usuario/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(usuario),
      });

      if (!response.ok) {
        throw new Error('Error al actualizar el usuario');
      }

      const updatedData = await response.json();
      console.log('Usuario actualizado:', updatedData);
      // Redirigir al usuario a la página anterior
      const from = new URLSearchParams(window.location.search).get('from');
      if (from) {
        navigate(decodeURIComponent(from));
      } else {
        // Si no hay URL guardada, redirigir al dashboard correspondiente del rol
        switch (updatedData.rol) {
          case 'admin':
            navigate(`/administradorDashboard/${id}`);
            break;
          case 'estudiante':
            navigate(`/estudianteDashboard/${id}`);
            break;
          case 'profesor':
            navigate(`/profesorDashboard/${id}`);
            break;
          default:
            setError('Rol no válido');
        }
      }
    } catch (error) {
      console.error('Error al actualizar el usuario:', error);
      setError('Error al actualizar el usuario');
    }
  };

  return (
    <Modal isOpen={isModalOpen} onRequestClose={handleCloseModal}>
      <div className="max-w-sm mx-auto px-4 py-8">
        <div className="px-0 py-4 flex items-center justify-between">
          <div className="flex items-center justify-center w-full">
            <span className="text-2xl font-bold font-center">PERFIL DE USUARIO</span>
          </div>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="mb-1">
            <label className="block text-gray-700 font-bold mb-2 text-xs" htmlFor="nombre">
              Nombre:
            </label>
            <input
              className="w-full p-2 border border-gray-300 rounded text-xs"
              type="text"
              id="nombre"
              value={usuario?.nombre || ''}
              onChange={(e) => setUsuario({ ...usuario, nombre: e.target.value })}
              placeholder="Nombre"
              style={{ textTransform: 'uppercase' }}
            />
          </div>
          <div className="mb-1">
            <label className="block text-gray-700 font-bold mb-2 text-xs" htmlFor="apellido">
              Apellido:
            </label>
            <input
              className="w-full p-2 border border-gray-300 rounded text-xs"
              type="text"
              id="apellido"
              value={usuario?.apellido || ''}
              onChange={(e) => setUsuario({ ...usuario, apellido: e.target.value })}
              placeholder="Apellido"
              style={{ textTransform: 'uppercase' }}
            />
          </div>
          <div className="mb-1">
            <label className="block text-gray-700 font-bold mb-2 text-xs" htmlFor="email">
              Correo Electrónico:
            </label>
            <input
              className="w-full p-2 border border-gray-300 rounded text-xs"
              type="email"
              id="email"
              value={usuario?.email || ''}
              onChange={(e) => setUsuario({ ...usuario, email: e.target.value })}
              placeholder="Email"
              style={{ textTransform: 'uppercase' }}
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 font-bold mb-2 text-xs" htmlFor="rol">
              Contraseña:
            </label>
            <input
              className="w-full p-2 border border-gray-300 rounded text-xs"
              type=""
              id="password"
              value={usuario?.password || ''}
              onChange={(e) => setUsuario({ ...usuario, password: e.target.value })}
              placeholder="password"
            />
          </div>
          <div className="flex justify-center">
            <button
              className="bg-blue-500 text-white px-4 py-1 rounded hover:bg-blue-600 mr-2 text-xs w-32 h-8"
              type="submit">
              <i className="fa-solid fa-file-pen"></i> Guardar
            </button>
            <button
              className="bg-red-500 text-white text-xs px-4 py-2 rounded hover:bg-red-600 align-center w-32 h-8"
              type="button" onClick={() => window.history.back()}>
              <i class="fa-solid fa-ban"></i> Cancelar
            </button>
          </div>
        </form>
      </div>
    </Modal>
  );
}

export { Perfil };