//ActualizarAsignatura

import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { useEffect, useState } from 'react';
//import Modal from '../components/Modal';
import '../components/styles.css';

function ActualizarUsuario() {
  const { id } = useParams();
  const location = useLocation();
  const currentUserId = new URLSearchParams(location.search).get('currentUserId'); // ID del usuario actual
  const navigate = useNavigate();
  const [usuario, setUsuario] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [passwordVisible, setPasswordVisible] = useState(false); // Controla la visibilidad de la contraseña

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

    fetchUser();
  }, [id]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUsuario({ ...usuario, [name]: value });
  };

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
        throw new Error('Network response was not ok');
      }

      const updatedUser = await response.json();
      navigate(`/usuarios/${currentUserId}`); // Redirigir a la lista de usuarios con el ID del usuario actualr
    } catch (error) {
      console.error("Error al actualizar el usuario:", error);
      setError(error);
    }
  };

  const togglePasswordVisibility = () => {
    setPasswordVisible(!passwordVisible);
  };

  if (loading) return <div className="text-center text-gray-600">Cargando...</div>;
  if (!usuario) return <div className="text-center text-gray-600">Usuario no encontrado</div>;

  return (
    
  <div className="max-w-sm mx-auto px-4 py-0">
  <div className="px-4 py-5 border border-gray-300 bg-gray-300 text-center">
    <span className="text-2xl font-bold">ACTUALIZAR USUARIO</span>
  </div>
  <div className="bg-white shadow-md rounded my-1 p-6">
    <form onSubmit={handleSubmit}>
      <div className="mb-1">
        <label className="block text-gray-700 font-bold mb-2 text-xs py-0" htmlFor="nombre">
          Nombre:
        </label>
        <input
          className="w-full p-2 border border-gray-300 rounded text-xs"
          type="text"
          id="nombre"
          name="nombre"
          value={usuario.nombre.toUpperCase()}
          onChange={handleInputChange}
          placeholder="Nombre"
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
          name="apellido"
          value={usuario.apellido.toUpperCase()}
          onChange={handleInputChange}
          placeholder="Apellido"
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
          name="email"
          value={usuario.email.toUpperCase()}
          onChange={handleInputChange}
          placeholder="Email"
        />
      </div>
      <div className="mb-1">
        <label className="block text-gray-700 font-bold mb-2 text-xs" htmlFor="password">
          Contraseña:
        </label>
            <div className="relative">
              <input
                className="w-full p-2 border border-gray-300 rounded text-xs pr-8"
                type={passwordVisible ? "text" : "password"}
                id="password"
                name="password"
                value={usuario.password}
                onChange={handleInputChange}
                placeholder="Contraseña"
              />
              <button
                type="button"
                className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                onClick={togglePasswordVisibility}
              >
                {passwordVisible ? (
                  <i className="fa-solid fa-eye"></i>
                ) : (
                  <i className="fa-solid fa-eye-slash"></i>
                )}
              </button>
            </div>
      </div>
      <div className="mb-4">
        <label className="block text-gray-700 font-bold mb-2 text-xs" htmlFor="rol">
          Rol:
        </label>
        <select
          className="w-full p-2 border border-gray-300 rounded text-xs"
          id="rol"
          name="rol"
          value={usuario.rol}
          onChange={handleInputChange}
        >
          <option value="estudiante">ESTUDIANTE</option>
          <option value="profesor">PROFESOR</option>
          <option value="admin">ADMINISTRADOR</option>
        </select>
      </div>
      <div className="flex justify-center gap-2">
        <button
          className="bg-blue-500 text-white text-xs px-4 py-2 rounded hover:bg-blue-600 align-center w-32 h-8"
          type="submit">
          <i class="fa-solid fa-file-pen"></i> Actualizar
        </button>
        <button
          className="bg-red-500 text-white text-xs px-4 py-2 rounded hover:bg-red-600 align-center w-32 h-8"
          type="button" onClick={() => window.history.back()}>
          <i class="fa-solid fa-ban"></i> Cancelar
        </button>
      </div>
    </form>
  </div>
</div>
  );
}

export { ActualizarUsuario }