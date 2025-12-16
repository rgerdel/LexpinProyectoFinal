import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { logout } from '../utils/auth.js';
import Modal from '../components/Modal.jsx';
import Header from '../components/Header.jsx';
import '../components/styles.css';

function ListarGrados() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [grados, setGrados] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newGrado, setNewGrado] = useState({ nombre: '', descripcion: '' });
  const [UsuarioActual, setUsuarioActual] = useState(null); // Estado para el usuario actual

  useEffect(() => {
    const fetchGrado = async () => {
      try {
        const response = await fetch(`http://localhost:3000/api/usuario/${id}`);
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json();
        setUsuarioActual(data); // Actualizar el estado del grado actual
        setLoading(false);
      } catch (error) {
        setError(error.message);
        setLoading(false);
      }
    };

    fetchGrado();
  }, [id]);

  useEffect(() => {
    fetch("http://localhost:3000/api/grados")
      .then((response) => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then((data) => {
        setGrados(data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error al obtener los grados:", error);
        setError(error);
        setLoading(false);
      });
  }, []);

  const handleAddGrado = () => {
    setIsModalOpen(true);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setNewGrado({ nombre: '', descripcion: '' });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewGrado({ ...newGrado, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:3000/api/grado', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newGrado),
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const data = await response.json();
      setGrados([...grados, data]);
      setIsModalOpen(false);
      setNewGrado({ nombre: '', descripcion: '' });
    } catch (error) {
      console.error("Error al agregar el grado:", error);
      setError(error);
    }
  };

  const handleToggleGrado = async (gradoId) => {
    try {
      const response = await fetch(`http://localhost:3000/api/grado/${gradoId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          eliminado: !grados.find(grado => grado._id === gradoId).eliminado,
        }),
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const updatedGrado = await response.json();
      setGrados(grados.map(grado => grado._id === gradoId ? updatedGrado : grado));
    } catch (error) {
      console.error("Error al actualizar el grado:", error);
      setError(error);
    }
  };

  if (loading) return <div className="text-center text-gray-600">Cargando...</div>;

  return (
    <div className="max-w-5xl mx-auto px-4 py-0">
      <Header usuario={UsuarioActual} id={id} />
      <div className="px-4 py-5 border border-gray-300 bg-gray-300 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <p className="text-xs font-bold ">PANEL DEL {UsuarioActual?.rol.toUpperCase() || '' }</p>
        </div>
        <div className="flex items-center space-x-4">
          <button className="text-gray-800 font-bold hover:text-gray-800 text-xs" onClick={() => navigate(`/administradorDashboard/${id}`)}>
            INICIO
          </button>
          <a href={`/usuarios/${id}`} className="text-gray-800 font-bold hover:text-gray-800 text-xs">USUARIO</a>
          <a href="/materias" className="text-gray-800 font-bold hover:text-gray-800 text-xs">MATERIAS</a>
          <a href={`/estudiantesgrados/${id}`} className="text-gray-800 font-bold hover:text-gray-800 text-xs">GRADOS</a>
        </div>
      </div>
      <div className="bg-white shadow-md rounded my- bg-gray-400">
        <div className="px-4 py-5 border border-gray-400 bg-gray-400">
          <div className="flex items-center justify-between">
            <button
              className="bg-green-500 text-xs text-white px-4 py-2 rounded hover:bg-green-600 align-center w-24 h-8"
              onClick={handleAddGrado}
            >
              <i className="fa-solid fa-user-plus"></i> Agregar
            </button>
            <h2 className="text-3xl font-bold text-white">Lista de Grados</h2>
          </div>
        </div>
        <div className="overflow-x-auto ">
          <table className="w-full whitespace-no-wrap ">
            <thead>
              <tr className="text-left font-bold tracking-wide text-white uppercase bg-gray-400 border-b border-gray-400">
                <th className="px-4 py-3 text-xs">Nombre</th>
                <th className="px-4 py-3 text-xs">Descripción</th>
                <th className="px-4 py-3 text-xs"></th>
              </tr>
            </thead>
            <tbody className="bg-gray-200 divide-y divide-gray-200">
              {grados.map((grado, index) => (
                <tr key={index} className="text-gray-700">
                  <td className={`px-4 py-1 text-xs ${grado.eliminado ? 'thick-line-through' : ''}`}>{grado.nombre.toUpperCase()}</td>
                  <td className={`px-4 py-1 text-xs ${grado.eliminado ? 'thick-line-through' : ''}`}>{grado.descripcion.toUpperCase()}</td>
                  <td className="px-4 py-1 text-right">
                    <button className="bg-blue-500 text-xs text-white px-2 py-1 rounded hover:bg-blue-600 mr-2 w-24 h-8 " onClick={() => navigate(`/ActualizarGrado/${grado._id}?currentUserId=${id}`)}><i class="fa-solid fa-file-pen"></i> Actualizar</button>
                    <button
                      className={`bg-${grado.eliminado ? 'green' : 'red'}-500 text-xs text-white px-2 py-1 rounded hover:bg-${grado.eliminado ? 'green' : 'red'}-600 w-24 h-8`}
                      onClick={() => handleToggleGrado(grado._id)}
                    >
                      <i className={`fa-solid ${grado.eliminado ? 'fa-check' : 'fa-eraser'}`}></i> {grado.eliminado ? 'Activar' : 'Eliminar'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="px-4 py-5 border-t border-gray-200 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <p className="place-content-center text-sm flex items-center justify-center w-8 h-8 rounded-full bg-gray-600 text-white text-center font-bold">G</p>
            <p className="text-xs text-white font-bold">= GRADO&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; </p>
          </div>
          <button
            className="bg-green-500 text-xs text-white px-4 py-2 rounded hover:bg-green-600 align-center w-24 h-8"
            onClick={handleAddGrado}
          >
            <i className="fa-solid fa-user-plus"></i> Agregar
          </button>
        </div>
      </div>
      <Modal isOpen={isModalOpen} onRequestClose={handleModalClose}>
        <div className="max-w-sm mx-auto px-4 py-8">
          <form onSubmit={handleSubmit}>
            <div className="px-0 py-3 flex items-center justify-between">
              <div className="flex items-center justify-center w-full">
                <span className="text-2xl font-bold font-center">REGISTRO DE GRADO</span>
              </div>
            </div>
            <div className="mb-1">
              <label className="block text-gray-700 font-bold mb-2 text-xs" htmlFor="nombre">
                Nombre:
              </label>
              <input
                className="w-full p-2 border border-gray-300 rounded text-xs"
                type="text"
                id="nombre"
                name="nombre"
                value={newGrado.nombre.toUpperCase()}
                onChange={handleInputChange}
                placeholder="Nombre"
              />
            </div>
            <div className="mb-1">
              <label className="block text-gray-700 font-bold mb-2 text-xs" htmlFor="descripcion">
                Descripción:
              </label>
              <input
                className="w-full p-2 border border-gray-300 rounded text-xs"
                type="text"
                id="descripcion"
                name="descripcion"
                value={newGrado.descripcion.toUpperCase()}
                onChange={handleInputChange}
                placeholder="Descripción"
              />
            </div>
            <div className="flex justify-center gap-2">
              <button
                className="bg-green-500 text-white text-xs px-4 py-2 rounded hover:bg-green-600 align-center w-32 h-8"
                type="submit">
                <i className="fa-solid fa-user-plus"></i>Agregar
              </button>
            </div>
          </form>
        </div>
      </Modal>
    </div>
  );
}

export { ListarGrados };