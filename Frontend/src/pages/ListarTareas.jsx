import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Modal from '../components/Modal';
import Header from '../components/Header.jsx';
import '../components/styles.css';


function ListarTareas() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [tareas, setTareas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newTask, setNewTask] = useState({ titulo: '', descripcion: '', id_asignatura: '', fecha_entrega: '', archivo: null });
  const [UsuarioActual, setUsuarioActual] = useState(null);
  const [formErrors, setFormErrors] = useState({});
  const [asignaturas, setAsignaturas] = useState([]);
  const [tareasCount, setTareasCount] = useState(0);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false); // Estado para el modal de detalles
  const [selectedTask, setSelectedTask] = useState(null); // Estado para la tarea seleccionada

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

    fetchUser();
  }, [id]);

  useEffect(() => {
    fetch("http://localhost:3000/api/tareas")
      .then((response) => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then((data) => {
        setTareas(data);
        setTareasCount(data.length);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error al obtener las tareas:", error);
        setError(error);
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    const fetchAsignaturas = async () => {
      try {
        const response = await fetch(`http://localhost:3000/api/tareas/profesor/${id}`);
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json();
        setAsignaturas(data);
      } catch (error) {
        console.error("Error al obtener las asignaturas:", error);
      }
    };

    fetchAsignaturas();
  }, [id]);

  const fetchTareas = async () => {
    try {
      const response = await fetch("http://localhost:3000/api/tareas");
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const data = await response.json();
      setTareas(data);
      setTareasCount(data.length);
    } catch (error) {
      console.error("Error al obtener las tareas:", error);
      setError(error);
    }
  };

  const handleAddTask = () => {
    setIsModalOpen(true);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setNewTask({ titulo: '', descripcion: '', asignatura: '', fechaEntrega: '', archivo: null });
    setFormErrors({});
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewTask({ ...newTask, [name]: value });
  };

  const handleFileChange = (e) => {
    setNewTask({ ...newTask, archivo: e.target.files[0] });
  };

  const validateForm = () => {
    const errors = {};

    if (!newTask.titulo.trim()) {
      errors.titulo = "El título es requerido.";
    }

    if (!newTask.descripcion.trim()) {
      errors.descripcion = "La descripción es requerida.";
    }

    if (!newTask.id_asignatura.trim()) {
      errors.id_asignatura = "La asignatura es requerida.";
    }

    if (!newTask.fecha_entrega.trim() || !/^\d{4}-\d{2}-\d{2}$/.test(newTask.fecha_entrega)) {
      errors.fecha_entrega = "La fecha de entrega es requerida y debe tener el formato DD-MM-YYYY.";
    }

    return errors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const errors = validateForm();
    if (Object.keys(errors).length > 0) {
      console.error("Errores de validación:", errors);
      setFormErrors(errors);
      return;
    }

    try {
      const response = await fetch('http://localhost:3000/api/tareas', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          titulo: newTask.titulo,
          descripcion: newTask.descripcion,
          id_asignatura: newTask.id_asignatura,
          fecha_entrega: newTask.fecha_entrega,
          id_profesor: id,
          archivo_adjunto: newTask.archivo ? newTask.archivo.name : null
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error("Error al agregar la tarea:", errorData);
        setFormErrors(errorData.errors || {});
        throw new Error(`Network response was not ok. Status: ${response.status}`);
      }

      const data = await response.json();
      fetchTareas();
      setIsModalOpen(false);
      setNewTask({
        titulo: '',
        descripcion: '',
        id_asignatura: '',
        fecha_entrega: '',
        archivo: null
      });
      setTareasCount(tareasCount + 1);
    } catch (error) {
      console.error("Error al agregar la tarea:", error);
    }
  };

  const formatDate = (date) => {
    if (!date) return '';
    const fecha = new Date(date);
    if (isNaN(fecha.getTime())) {
      return 'Invalid Date';
    }
    return fecha.toLocaleDateString('es-ES', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
  };

  const handleViewTask = (task) => {
    setSelectedTask(task);
    setIsDetailModalOpen(true);
  };

  const handleDetailModalClose = () => {
    setIsDetailModalOpen(false);
  };

  if (loading) return <div className="text-center text-gray-600">Cargando...</div>;

  return (
    <div className="max-w-5xl mx-auto px-4 py-0">
      <Header usuario={UsuarioActual} id={id} />
      <div className="px-4 py-5 border border-gray-300 bg-gray-300 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <p className="text-xs font-bold ">PANEL DEL {UsuarioActual?.rol.toUpperCase() || ''}</p>
        </div>
        <div className="flex items-center space-x-4">
          <button className="text-gray-800 font-bold hover:text-gray-800 text-xs" onClick={() => navigate(`/ProfesorDashboard/${id}`)}>
            INICIO
          </button>
          <a href={`/tareas/${id}`} className="text-gray-800 font-bold hover:text-gray-800 text-xs">TAREAS</a>
          <a href={`/evaluar/${id}`} className="text-gray-800 font-bold hover:text-gray-800 text-xs">POR EVALUAR</a>
        </div>
      </div>
      <div className="bg-white shadow-md rounded my- bg-gray-400">
        <div className="px-4 py-5 border border-gray-400 bg-gray-400">
          <div className="flex items-center justify-between">
            <button
              className="bg-green-500 text-xs text-white px-4 py-2 rounded hover:bg-green-600 align-center w-32 h-8"
              onClick={handleAddTask}
            >
              <i class="fa-solid fa-list-check"></i> Agregar
            </button>
            <h2 className="text-3xl font-bold text-white">Lista de Tareas</h2>
          </div>
        </div>
        <div className="overflow-x-auto ">
          <table className="w-full whitespace-no-wrap ">
            <thead>
              <tr className="text-left font-bold tracking-wide text-white uppercase bg-gray-400 border-b border-gray-400">
                <th className="px-4 py-3 text-xs">Título</th>
                <th className="px-4 py-3 text-xs">Descripción</th>
                <th className="px-4 py-3 text-xs">Asignatura</th>
                <th className="px-4 py-3 text-xs">Fecha de Entrega</th>
                <th className="px-4 py-3 text-xs"></th>
              </tr>
            </thead>
            <tbody className="bg-gray-200 divide-y divide-gray-200">
              {tareas.map((tarea, index) => (
                <tr key={index} className="text-gray-700">
                  <td className="px-4 py-1 text-xs">{tarea.titulo.toUpperCase()}</td>
                  <td className="px-4 py-1 text-xxs">{tarea.descripcion.substring(0, 30).toUpperCase()}</td>
                  <td className="px-4 py-1 text-xs">{tarea.id_asignatura.nombre.toUpperCase()}</td>
                  <td className="px-4 py-1 text-xs text-center">{formatDate(tarea.fecha_entrega)}</td>
                  <td className="px-4 py-1 text-right">
                     <button className="bg-blue-500 text-xs text-white px-2 py-1 rounded hover:bg-blue-600 mr-2 w-24 h-8 " onClick={() => handleViewTask(tarea)} disabled={tarea.eliminado}><i class="fa-solid fa-eye"></i> Ver Tarea</button>
                    <button className="bg-blue-500 text-xs text-white px-2 py-1 rounded hover:bg-blue-600 mr-2 w-24 h-8 " onClick={() => navigate(`/ActualizarTarea/${tarea._id}?currentUserId=${id}`)} disabled={tarea.eliminado}><i class="fa-solid fa-file-pen"></i> Actualizar</button>
                    <button
                      className={`bg-${tarea.eliminado ? 'green' : 'red'}-500 text-xs text-white px-2 py-1 rounded hover:bg-${tarea.eliminado ? 'green' : 'red'}-600 w-24 h-8`}
                      onClick={() => handleToggleTask(tarea._id)}
                    >
                      <i className={`fa-solid ${tarea.eliminado ? 'fa-check' : 'fa-eraser'}`}></i> {tarea.eliminado ? 'Activar' : 'Eliminar'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="px-4 py-5 border-t border-gray-200 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <p className="place-content-center text-sm flex items-center justify-center w-8 h-8 rounded-full bg-gray-600 text-white text-center font-bold">T</p>
            <p className="text-xs text-white font-bold">= TAREA&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; </p>
            <p className="text-xs text-white font-bold">{tareasCount}</p>
          </div>
          <button
            className="bg-green-500 text-xs text-white px-4 py-2 rounded hover:bg-green-600 align-center w-32 h-8"
            onClick={handleAddTask}
          >
            <i class="fa-solid fa-list-check"></i> Agregar
          </button>
        </div>
      </div>
      <Modal isOpen={isModalOpen} onRequestClose={handleModalClose}>
        <div className="max-w-sm mx-auto px-4 py-8">
          <form onSubmit={handleSubmit}>
            <div className="px-0 py-3 flex items-center justify-between">
              <div className="flex items-center justify-center w-full">
                <span className="text-2xl font-bold font-center">REGISTRO DE TAREA</span>
              </div>
            </div>
            <div className="mb-1">
              <label className="block text-gray-700 font-bold mb-2 text-xs" htmlFor="titulo">
                Título:
              </label>
              <input
                className="w-full p-2 border border-gray-300 rounded text-xs"
                type="text"
                id="titulo"
                name="titulo"
                value={newTask.titulo}
                onChange={handleInputChange}
                placeholder="Título"
              />
              {formErrors.titulo && (
                <p className="text-red-500 text-xs">{formErrors.titulo}</p>
              )}
            </div>
            <div className="mb-1">
              <label className="block text-gray-700 font-bold mb-2 text-xs" htmlFor="descripcion">
                Descripción:
              </label>
              <textarea
                className="w-full p-2 border border-gray-300 rounded text-xs"
                id="descripcion"
                name="descripcion"
                value={newTask.descripcion}
                onChange={handleInputChange}
                placeholder="Descripción"
              />
              {formErrors.descripcion && (
                <p className="text-red-500 text-xs">{formErrors.descripcion}</p>
              )}
            </div>
            <div className="mb-1">
              <label className="block text-gray-700 font-bold mb-2 text-xs" htmlFor="asignatura">
                Asignatura:
              </label>
              <select
                className="w-full p-2 border border-gray-300 rounded text-xs"
                id="id_asignatura"
                name="id_asignatura"
                value={newTask.id_asignatura}
                onChange={handleInputChange}
              >
                <option value="">Seleccione una asignatura</option>
                {asignaturas.map(asignatura => (
                  <option key={asignatura._id} value={asignatura._id}>
                    {asignatura.nombre}
                  </option>
                ))}
              </select>
              {formErrors.asignatura && (
                <p className="text-red-500 text-xs">{formErrors.asignatura}</p>
              )}
            </div>
            <div className="mb-1">
              <label className="block text-gray-700 font-bold mb-2 text-xs" htmlFor="archivo">
                Archivo:
              </label>
              <input
                className="w-full p-2 border border-gray-300 rounded text-xs"
                type="file"
                id="archivo"
                name="archivo"
                onChange={handleFileChange}
              />
            </div>
            <div className="mb-1">
              <label className="block text-gray-700 font-bold mb-2 text-xs" htmlFor="fechaEntrega">
                Fecha de Entrega:
              </label>
              <input
                className="w-full p-2 border border-gray-300 rounded text-xs"
                type="date"
                id="fecha_entrega"
                name="fecha_entrega"
                value={newTask.fecha_entrega}
                onChange={handleInputChange}
                placeholder="Fecha de Entrega"
              />
              {formErrors.fechaEntrega && (
                <p className="text-red-500 text-xs">{formErrors.fechaEntrega}</p>
              )}
            </div>

            <div className="flex justify-center gap-2">
              <button
                className="bg-green-500 text-white text-xs px-4 py-2 rounded hover:bg-green-600 align-center w-32 h-8"
                type="submit">
                <i class="fa-solid fa-list-check"></i> Agregar
              </button>
              <button
                className="bg-red-500 text-white text-xs px-4 py-2 rounded hover:bg-red-600 align-center w-32 h-8"
                onClick={() => setIsModalOpen(false)}
              > <i class="fa-solid fa-ban"></i> Cancelar
              </button>
            </div>
          </form>
        </div>
      </Modal>
      <Modal isOpen={isDetailModalOpen} onRequestClose={handleDetailModalClose}>
        <div className="max-w-sm mx-auto px-4 py-8">
          <h2 className="text-1xl font-bold mb-4 text-center">DETALLES DE LA TAREA</h2>
          {selectedTask && (
            <div>
              <p className="text-xs font-bold text-gray-700 mb-0">ASIGNATURA:</p>
              <p className="text-xs text-gray-700 mb-3">{selectedTask.id_asignatura.nombre.toUpperCase()}</p>
              <p className="text-xs font-bold text-gray-700 mb-0">TITULO:</p>
              <p className="text-xs text-gray-700 mb-3">{selectedTask.titulo.toUpperCase()}</p>
              <p className="text-xs font-bold text-gray-700 mb-0">DESCRIPCION:</p>
              <p className="text-xs text-gray-700 mb-3">{selectedTask.descripcion.toUpperCase()}</p>
              
              <p className="text-xs text-center text-gray-700 font-bold mb-0">FECHA DE ENTREGA:</p>
              <p className="text-xs text-center text-gray-700 mb-10">{formatDate(selectedTask.fecha_entrega)}</p>
            </div>
          )}
          <div className="flex justify-center">
            <button
              className="bg-red-500 text-white text-xs px-4 py-2 rounded hover:bg-red-600 align-center w-24 h-8"
              onClick={handleDetailModalClose}
            >
              <i class="fa-solid fa-ban"></i> Cerrar
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}

export { ListarTareas };