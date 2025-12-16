import { useParams, useLocation } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../components/styles.css';

function ActualizarEstudianteGrado() {
    const { id } = useParams();
    const location = useLocation();
    const currentUserId = new URLSearchParams(location.search).get('currentUserId'); // ID del usuario actual
    const navigate = useNavigate();
    const [estudiantes, setEstudiantes] = useState([]);
    const [grados, setGrados] = useState([]);
    const [nuevaAsignacion, setNuevaAsignacion] = useState({
        id_estudiante: '',
        id_grado: '',
    });

    useEffect(() => {
        const fetchEstudiantes = async () => {
            try {
                const response = await fetch("http://localhost:3000/api/usuarios?rol=estudiante");
                if (!response.ok) {
                    throw new Error(`Network response was not ok. Status: ${response.status}`);
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
                    throw new Error(`Network response was not ok. Status: ${response.status}`);
                }
                const data = await response.json();
                setGrados(data);
            } catch (error) {
                console.error("Error al obtener los grados:", error);
            }
        };

        const fetchEstudianteGrado = async () => {
            try {
                const response = await fetch(`http://localhost:3000/api/estudiantesGrados/${id}`);
                if (!response.ok) {
                    throw new Error(`Network response was not ok. Status: ${response.status}`);
                }
                const data = await response.json();
                setNuevaAsignacion({
                    id_estudiante: data.id_estudiante._id,
                    id_grado: data.id_grado._id,
                });
            } catch (error) {
                console.error("Error al obtener los datos del estudiante y grado:", error);
            }
        };

        fetchEstudiantes();
        fetchGrados();
        fetchEstudianteGrado();
    }, [id]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setNuevaAsignacion({
            ...nuevaAsignacion,
            [name]: value,
        });
    };

    const handleUpdate = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch(`http://localhost:3000/api/estudiantesGrados/${id}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    id_estudiante: nuevaAsignacion.id_estudiante,
                    id_grado: nuevaAsignacion.id_grado,
                }),
            });

            if (!response.ok) {
                throw new Error(`Network response was not ok. Status: ${response.status}`);
            }

            navigate(`/estudiantesGrados/${currentUserId}`); // Redirigir con el id del perfil

        } catch (error) {
            console.error("Error al actualizar la asignación del grado:", error);
        }
    };

    return (
        <div className="max-w-sm mx-auto px-4 py-0">
            <div className="px-4 py-5 border border-gray-300 bg-gray-300 text-center">
                <h2 className="text-2xl font-bold">ACTUALIZAR ASIG. GRADO</h2>
            </div>
            <div className="bg-white shadow-md rounded my-1 p-6">
                <form onSubmit={handleUpdate}>
                    <div className="mb-4">
                        <label className="block text-gray-700 font-bold mb-2 text-xs" htmlFor="id_estudiante">
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
                        <label className="block text-gray-700 text-xs font-bold mb-2" htmlFor="id_grado">
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
                            type="submit"
                        >
                            <i className="fa-solid fa-edit"></i> Actualizar
                        </button>
                        <button
                            className="bg-red-500 text-white text-xs px-4 py-2 rounded hover:bg-red-600 align-center w-32 h-8"
                            type="button" onClick={() => window.history.back()}>
                            <i className="fa-solid fa-ban"></i> Cancelar
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export { ActualizarEstudianteGrado };