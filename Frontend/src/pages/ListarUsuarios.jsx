import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Modal from '../components/Modal';
import Header from '../components/Header.jsx';
import '../components/styles.css';

function ListarUsuarios() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [usuarios, setUsuarios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newUser, setNewUser] = useState({ nombre: '', apellido: '', email: '', password: '', rol: 'estudiante' });
  const [usuarioActual, setUsuarioActual] = useState(null); // Estado para el usuario actual
  const [formErrors, setFormErrors] = useState({}); // Estado para los errores de validación

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

  useEffect(() => {
    fetch("http://localhost:3000/api/usuarios")
      .then((response) => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then((data) => {
        setUsuarios(data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error al obtener los usuarios:", error);
        setError(error);
        setLoading(false);
      });
  }, []);

  const handleAddUser = () => {
    setIsModalOpen(true);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setNewUser({ nombre: '', apellido: '', email: '', password: '', rol: '' });
    setFormErrors({}); // Limpiar errores al cerrar el modal
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewUser({ ...newUser, [name]: value });
  };

  const validateForm = () => {
    const errors = {};

    // Validar nombre (solo letras)
    if (!/^[A-Za-záéíóúÁÉÍÓÚñÑ ]+$/.test(newUser.nombre)) {
      errors.nombre = "El nombre debe contener solo letras.";
    }

    // Validar apellido (solo letras)
    if (!/^[A-Za-záéíóúÁÉÍÓÚñÑ ]+$/.test(newUser.apellido)) {
      errors.apellido = "El apellido debe contener solo letras.";
    }

    // Validar email (formato correcto)
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(newUser.email)) {
      errors.email = "El email no es válido.";
    }

    // Validar password (mínimo 8 caracteres, al menos 1 mayúscula, 1 minúscula, 1 número y 1 carácter especial)
    if (!/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z\d\s])[A-Za-z\d\s\W_]{8,}$/.test(newUser.password)) {
      errors.password = "La contraseña debe tener al menos 8 caracteres, incluyendo al menos una mayúscula, una minúscula, un número y un carácter especial.";
    }

    return errors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validar el formulario
    const errors = validateForm();
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return; // No enviar el formulario si hay errores
    }

    try {
      const response = await fetch('http://localhost:3000/api/usuario', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newUser),
      });

      if (!response.ok) {
        const errorData = await response.json(); // Suponiendo que la API devuelve errores en formato JSON
        setFormErrors(errorData.errors || {});
        throw new Error('Network response was not ok');
      }

      const data = await response.json();
      setUsuarios([...usuarios, data]);
      setIsModalOpen(false);
      setNewUser({ nombre: '', apellido: '', email: '', password: '', rol: '' });
    } catch (error) {
      console.error("Error al agregar el usuario:", error);
      setError(error);
    }
  };

  const handleToggleUser = async (userId) => {
  try {
    const response = await fetch(`http://localhost:3000/api/usuario/${userId}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        eliminado: !usuarios.find(user => user._id === userId).eliminado,
      }),
    });

    if (!response.ok) {
      throw new Error('Network response was not ok');
    }

    const updatedUser = await response.json();
    setUsuarios(usuarios.map(user => user._id === userId ? updatedUser : user));
  } catch (error) {
    console.error("Error al actualizar el usuario:", error);
    setError(error);
  }
};

  if (loading) return <div className="text-center text-gray-600">Cargando...</div>;

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
      <div className="bg-white shadow-md rounded my- bg-gray-400">
        <div className="px-4 py-5 border border-gray-400 bg-gray-400">
          <div className="flex items-center justify-between">
            <button
              className="bg-green-500 text-xs text-white px-4 py-2 rounded hover:bg-green-600 align-center w-24 h-8"
              onClick={handleAddUser}
            >
              <i className="fa-solid fa-user-plus"></i> Agregar
            </button>
            <h2 className="text-3xl font-bold text-white">Lista de Usuarios</h2>
          </div>
        </div>
        <div className="overflow-x-auto ">
          <table className="w-full whitespace-no-wrap ">
            <thead>
              <tr className="text-left font-bold tracking-wide text-white uppercase bg-gray-400 border-b border-gray-400">
                <th className="px-4 py-3 text-xs">Rol</th>
                <th className="px-4 py-3 text-xs">Nombre</th>
                <th className="px-4 py-3 text-xs">Apellido</th>
                <th className="px-4 py-3 text-xs">correo electrónico</th>
                <th className="px-4 py-3 text-xs"></th>
              </tr>
            </thead>
            <tbody className="bg-gray-200 divide-y divide-gray-200">
              {usuarios.map((usuario, index) => (
                <tr key={index} className="text-gray-700">
                  <td className="px-4 py-1 place-content-center text-sm flex items-center justify-center w-8 h-8 rounded-full bg-gray-600 text-white text-center">{getRolInitial(usuario.rol)}</td>
                  <td className={`px-4 py-1 text-xs ${usuario.eliminado ? 'thick-line-through' : ''}`}>{usuario.nombre.toUpperCase()}</td>
                  <td className={`px-4 py-1 text-xs ${usuario.eliminado ? 'thick-line-through' : ''}`}>{usuario.apellido.toUpperCase()}</td>
                  <td className={`px-4 py-1 text-xs ${usuario.eliminado ? 'thick-line-through' : ''}`}>{usuario.email.toUpperCase()}</td>
                  <td className="px-4 py-1 text-right">
                    <button className="bg-blue-500 text-xs text-white px-2 py-1 rounded hover:bg-blue-600 mr-2 w-24 h-8 " onClick={() => navigate(`/ActualizarUsuario/${usuario._id}?currentUserId=${id}`)} disabled={usuario.eliminado}><i class="fa-solid fa-file-pen"></i> Actualizar</button>
                    <button
                      className={`bg-${usuario.eliminado ? 'green' : 'red'}-500 text-xs text-white px-2 py-1 rounded hover:bg-${usuario.eliminado ? 'green' : 'red'}-600 w-24 h-8`}
                      onClick={() => handleToggleUser(usuario._id)}
                    >
                      <i className={`fa-solid ${usuario.eliminado ? 'fa-check' : 'fa-eraser'}`}></i> {usuario.eliminado ? 'Activar' : 'Eliminar'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="px-4 py-5 border-t border-gray-200 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <p className="place-content-center text-sm flex items-center justify-center w-8 h-8 rounded-full bg-gray-600 text-white text-center font-bold">P</p>
            <p className="text-xs text-white font-bold">= PROFESOR&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; </p>
            <p className="place-content-center text-sm flex items-center justify-center w-8 h-8 rounded-full bg-gray-600 text-white text-center font-bold">E</p>
            <p className="text-xs text-white font-bold">= ESTUDIANTE&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</p>
            <p className="place-content-center text-sm flex items-center justify-center w-8 h-8 rounded-full bg-gray-600 text-white text-center font-bold">A</p>
            <p className="text-xs text-white font-bold">= ADMINISTRADOR</p>
          </div>
          <button
            className="bg-green-500 text-xs text-white px-4 py-2 rounded hover:bg-green-600 align-center w-24 h-8"
            onClick={handleAddUser}
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
                <span className="text-2xl font-bold font-center">REGISTRO DE USUARIO</span>
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
                value={newUser.nombre}
                onChange={handleInputChange}
                placeholder="Nombre"
              />
              {formErrors.nombre && (
                <p className="text-red-500 text-xs">{formErrors.nombre}</p>
              )}
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
                value={newUser.apellido}
                onChange={handleInputChange}
                placeholder="Apellido"
              />
              {formErrors.apellido && (
                <p className="text-red-500 text-xs">{formErrors.apellido}</p>
              )}
            </div>
            <div className="mb-1">
              <label className="block text-gray-700 font-bold mb-2 text-xs" htmlFor="email">
                Correo Electronico:
              </label>
              <input
                className="w-full p-2 border border-gray-300 rounded text-xs"
                type="email"
                id="email"
                name="email"
                value={newUser.email}
                onChange={handleInputChange}
                placeholder="Email"
              />
              {formErrors.email && (
                <p className="text-red-500 text-xs">{formErrors.email}</p>
              )}
            </div>
            <div className="mb-1">
              <label className="block text-gray-700 font-bold mb-2 text-xs" htmlFor="password">
                Contraseña:
              </label>
              <input
                className="w-full p-2 border border-gray-300 rounded text-xs"
                type="password"
                id="password"
                name="password"
                value={newUser.password}
                onChange={handleInputChange}
                placeholder="Contraseña"
              />
              {formErrors.password && (
                <p className="text-red-500 text-xs">{formErrors.password}</p>
              )}
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 font-bold mb-2 text-xs" htmlFor="rol">
                Rol:
              </label>
              <select
                className="w-full p-2 border border-gray-300 rounded text-xs"
                id="rol"
                name="rol"
                value={newUser.rol}
                onChange={handleInputChange}
              >
                <option value="estudiante">Estudiante</option>
                <option value="profesor">Profesor</option>
                <option value="admin">Administrador</option>
              </select>
            </div>
            <div className="flex justify-center gap-2">
              <button
                className="bg-green-500 text-white text-xs px-4 py-2 rounded hover:bg-green-600 align-center w-32 h-8"
                type="submit">
                <i className="fa-solid fa-user-plus"></i> Agregar
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
    </div>
  );
}

function getRolInitial(rol) {
  switch (rol) {
    case 'estudiante':
      return 'E';
    case 'profesor':
      return 'P';
    case 'admin':
      return 'A';
    default:
      return '';
  }
}

export { ListarUsuarios };