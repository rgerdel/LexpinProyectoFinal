import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { useEffect, useState } from 'react';
import '../components/styles.css';


function ActualizarAsignatura() {
  const { id } = useParams();
  const location = useLocation();
  const currentUserId = new URLSearchParams(location.search).get('currentUserId'); // ID del usuario actual
  const navigate = useNavigate();
  const [asignatura, setAsignatura] = useState(null);
  const [profesores, setProfesores] = useState([]);
  const [grados, setGrados] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!id) {
      setError('ID de asignatura no proporcionado');
      setLoading(false);
      return;
    }

    const fetchAsignatura = async () => {
      try {
        const response = await fetch(`http://localhost:3000/api/asignatura/${id}`);
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json();
        console.log('Datos de la asignatura:', data); // Verifica los datos aquí
        setAsignatura(data);
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

    fetchAsignatura();
    fetchProfesores();
    fetchGrados();
  }, [id]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setAsignatura({
      ...asignatura,
      [name]: value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!asignatura) {
      setError('Datos de asignatura no disponibles');
      return;
    }

    try {
      const asignaturaId = asignatura._id || asignatura.id;
      if (!asignaturaId) {
        throw new Error('ID de asignatura no disponible');
      }

      const response = await fetch(`http://localhost:3000/api/asignatura/${asignaturaId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          nombre: asignatura.nombre,
          descripcion: asignatura.descripcion,
          id_profesor: asignatura.id_profesor,
          grado: asignatura.grado
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error("Error al actualizar la asignatura:", errorData);
        throw new Error(`Network response was not ok. Status: ${response.status}`);
      }


      
      //const data = await response.json();
      navigate(`/asignaturas/${currentUserId}`);
    } catch (error) {
      console.error("Error al actualizar la asignatura:", error);
      setError(error.message);
    }
  };

  return (
    <div className="max-w-sm mx-auto px-4 py-0">
      <div className="px-4 py-5 border border-gray-300 bg-gray-300 text-center">
        <span className="text-2xl font-bold">ACTUALIZAR ASIGNATURA</span>
      </div>
      <div className="bg-white shadow-md rounded my-1 p-6">
        {asignatura && (
          <form onSubmit={handleSubmit}>
            <div className="mb-1">
              <label className="block text-gray-700 font-bold mb-2 text-xs" htmlFor="nombre">
                Nombre
              </label>
              <input
                className="w-full p-2 border border-gray-300 rounded text-xs"
                id="nombre"
                type="text"
                name="nombre"
                value={asignatura.nombre || ''}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="mb-1">
              <label className="block text-gray-700 font-bold mb-2 text-xs" htmlFor="descripcion">
                Descripción
              </label>
              <textarea
                className="w-full p-2 border border-gray-300 rounded text-xs"
                id="descripcion"
                name="descripcion"
                value={asignatura.descripcion || ''}
                onChange={handleInputChange}
                required
              ></textarea>
            </div>
            <div className="mb-1">
              <label className="block text-gray-700 font-bold mb-2 text-xs" htmlFor="profesorId">
                Profesor
              </label>
              <select
                className="w-full p-2 border border-gray-300 rounded text-xs"
                id="profesorId"
                name="id_profesor"
                value={asignatura.id_profesor || ''}
                onChange={handleInputChange}
                required
              >
                <option value="">Seleccione un profesor</option>
                 {profesores.filter(profesor => profesor.rol === 'profesor').map(profesor => (
                  <option key={profesor._id} value={profesor._id}>
                    {`${profesor.nombre.toUpperCase()} ${profesor.apellido.toUpperCase()}`}
                  </option>
                ))}
              </select>
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 font-bold mb-2 text-xs" htmlFor="gradoId">
                Grado
              </label>
              <select
                className="w-full p-2 border border-gray-300 rounded text-xs"
                id="gradoId"
                name="grado"
                value={asignatura.grado || ''}
                onChange={handleInputChange}
                required
              >
                <option value="">Seleccione un grado</option>
                {grados.map(grado => (
                  <option key={grado._id} value={grado._id}>
                    {grado.nombre}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex justify-center gap-2">
              <button className="bg-green-500 text-white text-xs px-4 py-2 rounded hover:bg-green-600 align-center w-32 h-8"
                type="submit"><i className="fa-solid fa-file-pen"></i> Actualizar
              </button>
              <button
                className="bg-red-500 text-white text-xs px-4 py-2 rounded hover:bg-red-600 align-center w-32 h-8"
                type="button" onClick={() => window.history.back()}>
                <i className="fa-solid fa-ban"></i> Cancelar
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}

export { ActualizarAsignatura };