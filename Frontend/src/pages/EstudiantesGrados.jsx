import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Modal from "../components/Modal";
import Header from "../components/Header";
import "../components/styles.css";

function EstudiantesGrados() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [estudiantesConGrados, setEstudiantesConGrados] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [usuarioActual, setUsuarioActual] = useState(null);
  const [estudiantes, setEstudiantes] = useState([]);
  const [grados, setGrados] = useState([]);

  // Estado para la nueva asignación de grado
  const [nuevaAsignacion, setNuevaAsignacion] = useState({
    id_estudiante: "",
    id_grado: "",
  });

  // Definición de fetchEstudiantesConGrados
  const fetchEstudiantesConGrados = async () => {
    try {
      const response = await fetch(
        "http://localhost:3000/api/estudiantesGrados/detalles"
      );
      if (!response.ok) {
        throw new Error(
          `Network response was not ok. Status: ${response.status}`
        );
      }
      const data = await response.json();
      console.log("Estudiantes con grados:", data); // Verifica los datos aquí
      setEstudiantesConGrados(data);
      setLoading(false);
    } catch (error) {
      console.error("Error al obtener los estudiantes con grados:", error);
      setError(error.message);
      setLoading(false);
    }
  };

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await fetch(`http://localhost:3000/api/usuario/${id}`);
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const data = await response.json();
        setUsuarioActual(data);
        setLoading(false);
      } catch (error) {
        setError(error.message);
        setLoading(false);
      }
    };

    const fetchEstudiantes = async () => {
      try {
        const response = await fetch(
          "http://localhost:3000/api/usuarios?rol=estudiante"
        );
        if (!response.ok) {
          throw new Error(
            `Network response was not ok. Status: ${response.status}`
          );
        }
        const data = await response.json();
        setEstudiantes(data);
      } catch (error) {
        console.error("Error al obtener los estudiantes:", error);
      }
    };

    const fetchGrados = async () => {
      try {
        const response = await fetch("http://localhost:3000/api/grados");
        if (!response.ok) {
          throw new Error(
            `Network response was not ok. Status: ${response.status}`
          );
        }
        const data = await response.json();
        setGrados(data);
      } catch (error) {
        console.error("Error al obtener los grados:", error);
      }
    };

    fetchUser();
    fetchEstudiantesConGrados();
    fetchEstudiantes();
    fetchGrados();
  }, [id]);

  const handleAgregarGrado = async () => {
    try {
      if (!nuevaAsignacion.id_estudiante || !nuevaAsignacion.id_grado) {
        console.error("Faltan campos obligatorios");
        return;
      }

      const response = await fetch(
        "http://localhost:3000/api/estudiantesGrados",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            id_estudiante: nuevaAsignacion.id_estudiante,
            id_grado: nuevaAsignacion.id_grado,
          }),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        console.error("Error al asignar el grado al estudiante:", errorData);
        throw new Error(
          `Network response was not ok. Status: ${response.status}`
        );
      }

      const data = await response.json();
      // Refresca los datos de los estudiantes con grados
      fetchEstudiantesConGrados();
      setIsModalOpen(false);
      setNuevaAsignacion({
        id_estudiante: "",
        id_grado: "",
      });
    } catch (error) {
      console.error("Error al asignar el grado al estudiante:", error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNuevaAsignacion({
      ...nuevaAsignacion,
      [name]: value,
    });
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-0">
      <Header usuario={usuarioActual} id={id} />
      <div className="px-4 py-5 border border-gray-300 bg-gray-300 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <p className="text-xs font-bold ">
            PANEL DEL {usuarioActual?.rol.toUpperCase() || ""}
          </p>
        </div>
        <div className="flex items-center space-x-4">
          <button
            className="text-gray-800 font-bold hover:text-gray-800 text-xs"
            onClick={() => navigate(`/administradorDashboard/${id}`)}
          >
            INICIO
          </button>
          <a
            href={`/usuarios/${id}`}
            className="text-gray-800 font-bold hover:text-gray-800 text-xs"
          >
            USUARIO
          </a>
          <a
            href={`/asignaturas/${id}`}
            className="text-gray-800 font-bold hover:text-gray-800 text-xs"
          >
            ASIGNATURAS
          </a>
          <a
            href={`/estudiantesgrados/${id}`}
            className="text-gray-800 font-bold hover:text-gray-800 text-xs"
          >
            GRADOS
          </a>
        </div>
      </div>
      <div className="bg-white shadow-md rounded my-0 bg-gray-400">
        <div className="px-4 py-5 border border-gray-400 bg-gray-400">
          <div className="flex items-center justify-between">
            <button
              className="bg-green-500 text-xs text-white px-4 py-2 rounded hover:bg-green-600 align-center w-24 h-8"
              onClick={() => setIsModalOpen(true)}
            >
              <i className="fa-solid fa-user-plus"></i> Asignar
            </button>
            <h2 className="text-3xl font-bold text-white">
              Listado de Estudiantes
            </h2>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full whitespace-no-wrap">
            <thead>
              <tr className="text-left font-bold tracking-wide text-white uppercase bg-gray-400 border-b border-gray-400">
                <th className="px-4 py-3 text-xs">Nombre</th>
                <th className="px-4 py-3 text-xs">Apellido</th>
                <th className="px-4 py-3 text-xs">Grado Cursante</th>
              </tr>
            </thead>
            <tbody className="bg-gray-200 divide-y divide-gray-200">
              {estudiantesConGrados.map((estudianteConGrado, index) => (
                <tr key={index} className="text-gray-700 ">
                  <td className="px-4 py-1 text-xs">
                    {estudianteConGrado.id_estudiante?.nombre?.toUpperCase()}
                  </td>
                  <td className="px-4 py-1 text-xs">
                    {estudianteConGrado.id_estudiante?.apellido?.toUpperCase()}
                  </td>
                  <td className="px-4 py-1 text-xs">
                    {estudianteConGrado.id_grado?.nombre?.toUpperCase()}
                  </td>
                  <td className="px-4 py-1 text-xs flex justify-end">
                    <button
                      className="bg-blue-500 text-white text-xs px-2 py-1 rounded hover:bg-blue-600 mr-2"
                      onClick={() =>
                        navigate(
                          `/verAsignaturas/${estudianteConGrado.id_grado?._id}?currentUserId=${id}&from=${encodeURIComponent(window.location.pathname)}&nombreCompleto=${encodeURIComponent(`${estudianteConGrado.id_estudiante?.nombre?.toUpperCase()} ${estudianteConGrado.id_estudiante?.apellido?.toUpperCase()}`)}&nombreGrado=${encodeURIComponent(estudianteConGrado.id_grado?.nombre?.toUpperCase())}`
                        )
                      }
                    >
                      <i className="fa-solid fa-eye"></i> Ver Asignaturas del Grado
                    </button>
                    <button
  className="bg-yellow-500 text-white text-xs px-2 py-1 rounded hover:bg-yellow-600"
  onClick={() =>
    navigate(
      `/ActualizarEstudianteGrado/${estudianteConGrado._id}?currentUserId=${id}&nombre=${encodeURIComponent(estudianteConGrado.id_estudiante?.nombre?.toUpperCase())}&apellido=${encodeURIComponent(estudianteConGrado.id_estudiante?.apellido?.toUpperCase())}&grado=${encodeURIComponent(estudianteConGrado.id_grado?.nombre?.toUpperCase())}`
    )
  }
>
  <i className="fa-solid fa-edit"></i> Actualizar Asignación Grado
</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      {isModalOpen && (
        <Modal
          isOpen={isModalOpen}
          onRequestClose={() => setIsModalOpen(false)}
        >
          <div className="max-w-sm mx-auto px-4 py-8">
            <form onSubmit={(e) => e.preventDefault()}>
              <div className="px-0 py-3 flex items-center justify-between">
                <div className="flex items-center justify-center w-full">
                  <span className="text-2xl font-bold font-center">
                    ASIGNAR GRADO
                  </span>
                </div>
              </div>
              <div className="mb-1">
                <label
                  className="block text-gray-700 font-bold mb-2 text-xs"
                  htmlFor="id_estudiante"
                >
                  Estudiante
                </label>
                <select
                  className="w-full p-2 border border-gray-300 rounded text-xs"
                  id="id_estudiante"
                  name="id_estudiante"
                  value={nuevaAsignacion.id_estudiante}
                  onChange={handleInputChange}
                >
                  <option value="">Seleccione un estudiante</option>
                  {estudiantes
                    .filter((estudiante) => estudiante.rol === "estudiante")
                    .map((estudiante) => (
                      <option key={estudiante._id} value={estudiante._id}>
                        {`${estudiante.nombre.toUpperCase()} ${estudiante.apellido.toUpperCase()}`}
                      </option>
                    ))}
                </select>
              </div>
              <div className="mb-4">
                <label
                  className="block text-gray-700 text-xs font-bold mb-2"
                  htmlFor="id_grado"
                >
                  Grado
                </label>
                <select
                  className="w-full p-2 border border-gray-300 rounded text-xs"
                  id="id_grado"
                  name="id_grado"
                  value={nuevaAsignacion.id_grado}
                  onChange={handleInputChange}
                >
                  <option value="">Seleccione un grado</option>
                  {grados.map((grado) => (
                    <option key={grado._id} value={grado._id}>
                      {grado.nombre}
                    </option>
                  ))}
                </select>
              </div>
              <div className="flex justify-center gap-2">
                <button
                  className="bg-green-500 text-white text-xs px-4 py-2 rounded hover:bg-green-600 align-center w-32 h-8"
                  onClick={handleAgregarGrado}
                >
                  <i className="fa-solid fa-user-plus"></i> Asignar
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
        <div className="flex items-center space-x-2"></div>
        <button
          className="bg-green-500 text-xs text-white px-4 py-2 rounded hover:bg-green-600 align-center w-24 h-8"
          onClick={() => setIsModalOpen(true)}
        >
          <i className="fa-solid fa-user-plus"></i> Asignar
        </button>
      </div>
    </div>
  );
}

export { EstudiantesGrados };
