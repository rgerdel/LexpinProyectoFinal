import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Modal from '../components/Modal';
import Header from '../components/Header';
import '../components/styles.css';

function ListarAsignaturas() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [asignaturas, setAsignaturas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [usuarioActual, setUsuarioActual] = useState(null);
  const [profesores, setProfesores] = useState([]);
  const [grados, setGrados] = useState([]);
  const [nuevaAsignatura, setNuevaAsignatura] = useState({
    nombre: '',
    descripcion: '',
    profesorId: '',
    gradoId: ''
  });
  const [formErrors, setFormErrors] = useState({});

  const fetchAsignaturas = async () => {
    try {
      const response = await fetch("http://localhost:3000/api/asignaturas/detalles");
      if (!response.ok) {
        throw new Error(`Network response was not ok. Status: ${response.status}`);
      }
      const data = await response.json();
      console.log('Asignaturas con detalles:', data); // Verifica los datos aquí
      setAsignaturas(data);
      setLoading(false);
    } catch (error) {
      console.error("Error al obtener las asignaturas con detalles:", error);
      setError(error.message);
      setLoading(false);
    }
  };

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await fetch(`http://localhost:3000/api/usuario/${id}`);
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json();
        setUsuarioActual(data);
        setLoading(false);
      } catch (error) {
        setError(error.message);
        setLoading(false);
      }
    };

    const fetchProfesores = async () => {
      try {
        const response = await fetch("http://localhost:3000/api/usuarios?rol=profesor");
        if (!response.ok) {
          throw new Error(`Network response was not ok. Status: ${response.status}`);
        }
        const data = await response.json();
        setProfesores(data);
      } catch (error) {
        console.error("Error al obtener los profesores:", error);
      }
    };

    const fetchGrados = async () => {
      try {
        const response = await fetch("http://localhost:3000/api/grados");
        if (!response.ok) {
          throw new Error(`Network response was not ok. Status: ${response.status}`);
        }
        const data = await response.json();
        setGrados(data);
      } catch (error) {
        console.error("Error al obtener los grados:", error);
      }
    };

    fetchUser();
    fetchAsignaturas();
    fetchProfesores();
    fetchGrados();
  }, [id]);

  const validateAsignatura = () => {
    const errors = {};

    // Validar nombre (requerido, no vacío)
    if (!nuevaAsignatura.nombre.trim()) {
      errors.nombre = "El nombre es requerido.";
    }

    // Validar descripción (requerido, no vacío)
    if (!nuevaAsignatura.descripcion.trim()) {
      errors.descripcion = "La descripción es requerida.";
    }

    // Validar profesor (requerido, no vacío)
    if (!nuevaAsignatura.profesorId.trim()) {
      errors.profesorId = "Debe seleccionar un profesor.";
    }

    // Validar grado (requerido, no vacío)
    if (!nuevaAsignatura.gradoId.trim()) {
      errors.gradoId = "Debe seleccionar un grado.";
    }

    setFormErrors(errors);
    return errors;
  };

  const handleAgregarAsignatura = async () => {
    // Validar el formulario
    const errors = validateAsignatura();
    if (Object.keys(errors).length > 0) {
      console.error("Errores de validación:", errors);
      return; // No enviar el formulario si hay errores
    }

    try {
      const response = await fetch("http://localhost:3000/api/asignatura", {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          nombre: nuevaAsignatura.nombre,
          descripcion: nuevaAsignatura.descripcion,
          id_profesor: nuevaAsignatura.profesorId,
          grado: nuevaAsignatura.gradoId,
          periodo_escolar: "2025-2026"
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error("Error al agregar la asignatura:", errorData);
        throw new Error(`Network response was not ok. Status: ${response.status}`);
      }

      const data = await response.json();
      // Refresca los datos de las asignaturas
      fetchAsignaturas();
      setIsModalOpen(false);
      setNuevaAsignatura({
        nombre: '',
        descripcion: '',
        profesorId: '',
        gradoId: ''
      });
    } catch (error) {
      console.error("Error al agregar la asignatura:", error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNuevaAsignatura({
      ...nuevaAsignatura,
      [name]: value
    });
  };

  const handleToggleAsignatura = async (asignaturaId) => {
    try {
      console.log('Actualizando asignatura con ID:', asignaturaId); // Verifica que el ID no sea undefined

      const asignatura = asignaturas.find(a => a.id === asignaturaId);
      if (!asignatura) {
        throw new Error('Asignatura no encontrada');
      }

      const response = await fetch(`http://localhost:3000/api/asignatura/${asignaturaId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ eliminado: !asignatura.eliminado })
      });

      if (!response.ok) {
        throw new Error(`Network response was not ok. Status: ${response.status}`);
      }

      const updatedAsignatura = await response.json();
      const updatedAsignaturas = asignaturas.map(a => {
        if (a.id === asignaturaId) {
          return { ...a, eliminado: !a.eliminado };
        }
        return a;
      });

      setAsignaturas(updatedAsignaturas);
    } catch (error) {
      console.error("Error al togglear el estado de la asignatura:", error);
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-0">
      <Header usuario={usuarioActual} id={id} />
      <div className="px-4 py-5 border border-gray-300 bg-gray-300 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <p className="text-xs font-bold ">PANEL DEL {usuarioActual?.rol.toUpperCase() || '' }</p>
        </div>
        <div className="flex items-center space-x-4">
          <button className="text-gray-800 font-bold hover:text-gray-800 text-xs" onClick={() => navigate(`/administradorDashboard/${id}`)}>
            INICIO
          </button>
          <a href={`/usuarios/${id}`} className="text-gray-800 font-bold hover:text-gray-800 text-xs">USUARIO</a>
          <a href={`/asignaturas/${id}`} className="text-gray-800 font-bold hover:text-gray-800 text-xs">ASIGNATURAS</a>
          <a href={`/estudiantesgrados/${id}`} className="text-gray-800 font-bold hover:text-gray-800 text-xs">GRADOS</a>
        </div>
      </div>
      <div className="bg-white shadow-md rounded my-0 bg-gray-400">
        <div className="px-4 py-5 border border-gray-400 bg-gray-400">
          <div className="flex items-center justify-between">
            <button
              className="bg-green-500 text-xs text-white px-4 py-2 rounded hover:bg-green-600 align-center w-24 h-8"
              onClick={() => setIsModalOpen(true)}
            >
              <i className="fa-solid fa-user-plus"></i> Agregar
            </button>
            <h2 className="text-3xl font-bold text-white">Lista de Asignaturas</h2>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full whitespace-no-wrap">
            <thead>
              <tr className="text-left font-bold tracking-wide text-white uppercase bg-gray-400 border-b border-gray-400">
                <th className="px-4 py-3 text-xs">Nombre</th>
                <th className="px-4 py-3 text-xs">Descripción</th>
                <th className="px-4 py-3 text-xs">Profesor</th>
                <th className="px-4 py-3 text-xs">Grado</th>
                <th className="px-4 py-3 text-xs"></th>
              </tr>
            </thead>
            <tbody className="bg-gray-200 divide-y divide-gray-200">
              {asignaturas.map((asignatura, index) => (
                <tr key={index} className="text-gray-700 ">
                  <td className={`px-4 py-1 text-xs ${asignatura.eliminado ? 'thick-line-through' : ''}`}>
                    {asignatura.nombre.toUpperCase()}
                  </td>
                  <td className={`px-0 py-1 text-xs ${asignatura.eliminado ? 'thick-line-through' : ''}`}>
                    {asignatura.descripcion.length > 40 ? asignatura.descripcion.substring(0, 30).toUpperCase() + '...' : asignatura.descripcion.toUpperCase()}
                  </td>
                  <td className={`px-2 py-1 text-xs ${asignatura.eliminado ? 'thick-line-through' : ''}`}>
                    {asignatura.profesorNombre ? `${asignatura.profesorNombre.toUpperCase()} ${asignatura.profesorApellido.toUpperCase()}` : 'Sin profesor'}
                  </td>
                  <td className={`px-2 py-1 text-xs ${asignatura.eliminado ? 'thick-line-through' : ''}`}>
                    {asignatura.gradoNombre ? asignatura.gradoNombre.toUpperCase() : ''}
                  </td>
                  <td className={`px-2 py-1 text-xs ${asignatura.eliminado ? 'line-through' : ''}`}>
                    
                  </td>
                  <td className="px-4 py-1 text-right">
                    <button className="bg-blue-500 text-xs text-white px-2 py-1 rounded hover:bg-blue-600 mr-2 w-24 h-8 " onClick={() => navigate(`/ActualizarAsignatura/${asignatura.id}?currentUserId=${id}`)}  disabled={asignatura.eliminado}>
                      <i className="fa-solid fa-file-pen"></i> Actualizar
                    </button>
                    <button
                      className={`bg-${asignatura.eliminado ? 'green' : 'red'}-500 text-xs text-white px-2 py-1 rounded hover:bg-${asignatura.eliminado ? 'green' : 'red'}-600 w-24 h-8`}
                      onClick={() => handleToggleAsignatura(asignatura.id)}
                    >
                      <i className={`fa-solid ${asignatura.eliminado ? 'fa-check' : 'fa-eraser'}`}></i> {asignatura.eliminado ? 'Activar' : 'Eliminar'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      {isModalOpen && (
        <Modal isOpen={isModalOpen} onRequestClose={() => setIsModalOpen(false)}>
          <div className="max-w-sm mx-auto px-4 py-8">
            <form onSubmit={(e) => e.preventDefault()}>
              <div className="px-0 py-3 flex items-center justify-between">
                <div className="flex items-center justify-center w-full">
                  <span className="text-2xl font-bold font-center">REGISTRO ASIGNATURAS</span>
                </div>
              </div>
              <div className="mb-1">
                <label className="block text-gray-700 font-bold mb-2 text-xs" htmlFor="nombre">
                  Nombre
                </label>
                <input
                  className="w-full p-2 border border-gray-300 rounded text-xs"
                  id="nombre"
                  type="text"
                  name="nombre"
                  value={nuevaAsignatura.nombre}
                  onChange={handleInputChange}
                  placeholder="Nombre"
                />
                {formErrors.nombre && (
                  <p className="text-red-500 text-xs">{formErrors.nombre}</p>
                )}
              </div>
              <div className="mb-1">
                <label className="block text-xs text-gray-700 font-bold mb-2" htmlFor="descripcion">
                  Descripción
                </label>
                <textarea
                  className="w-full p-2 border border-gray-300 rounded text-xs"
                  id="descripcion"
                  name="descripcion"
                  value={nuevaAsignatura.descripcion}
                  onChange={handleInputChange}
                  placeholder="Escriba una breve descripcion"
                ></textarea>
                {formErrors.descripcion && (
                  <p className="text-red-500 text-xs">{formErrors.descripcion}</p>
                )}
              </div>
              <div className="mb-1">
                <label className="block text-xs text-gray-700 font-bold mb-2" htmlFor="profesorId">
                  Profesor
                </label>
                <select
                  className="w-full p-2 border border-gray-300 rounded text-xs"
                  id="profesorId"
                  name="profesorId"
                  value={nuevaAsignatura.profesorId}
                  onChange={handleInputChange}
                >
                  <option value="">Seleccione un profesor</option>
                  {profesores.filter(profesor => profesor.rol === 'profesor').map(profesor => (
                    <option key={profesor._id} value={profesor._id}>
                      {`${profesor.nombre.toUpperCase()} ${profesor.apellido.toUpperCase()}`}
                    </option>
                  ))}
                </select>
                {formErrors.profesorId && (
                  <p className="text-red-500 text-xs">{formErrors.profesorId}</p>
                )}
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 text-xs font-bold mb-2" htmlFor="gradoId">
                  Grado
                </label>
                <select
                  className="w-full p-2 border border-gray-300 rounded text-xs"
                  id="gradoId"
                  name="gradoId"
                  value={nuevaAsignatura.gradoId}
                  onChange={handleInputChange}
                >
                  <option value="">Seleccione un grado</option>
                  {grados.map(grado => (
                    <option key={grado._id} value={grado._id}>
                      {grado.nombre}
                    </option>
                  ))}
                </select>
                {formErrors.gradoId && (
                  <p className="text-red-500 text-xs">{formErrors.gradoId}</p>
                )}
              </div>
              <div className="flex justify-center gap-2">
                <button
                  className="bg-green-500 text-white text-xs px-4 py-2 rounded hover:bg-green-600 align-center w-32 h-8"
                  onClick={handleAgregarAsignatura}
                >
                  <i className="fa-solid fa-user-plus"></i> Agregar
                </button>
                <button
                  className="bg-red-500 text-white text-xs px-4 py-2 rounded hover:bg-red-600 align-center w-32 h-8"
                  onClick={() => setIsModalOpen(false)}
                >
                  <i className="fa-solid fa-ban"></i> Cancelar
                </button>
              </div>
            </form>
          </div>
        </Modal>
      )}
      <div className="bg-gray-400 px-4 py-5 border-t border-gray-200 flex items-center justify-between">
        <div className="flex items-center space-x-2">
        </div>
        <button
          className="bg-green-500 text-xs text-white px-4 py-2 rounded hover:bg-green-600 align-center w-24 h-8"
          onClick={() => setIsModalOpen(true)}
        >
          <i className="fa-solid fa-user-plus"></i> Agregar
        </button>
      </div>
    </div>
  );
}

export { ListarAsignaturas };