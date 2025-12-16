import { Usuario } from '../models/usuario.model.js';

// crear un nuevo usuario
export const createUser = async (req, res) => {
  try {
    const { nombre, apellido, email, password, fecha_nacimiento, rol } = req.body;

    // Validación básica de campos requeridos
    if (!nombre || !apellido || !email || !password || !rol) {
      return res.status(400).json({ error: 'Faltan campos requeridos' });
    }

    const nuevoUsuario = new Usuario({ nombre, apellido, email, password, fecha_nacimiento, rol });
    await nuevoUsuario.save();
    res.status(201).json(nuevoUsuario);
  } catch (error) {
    res.status(400).json({ error: 'Error al crear el usuario', details: error.message });
  }
};

// traer todos los usuarios
export const getAllUsers = async (req, res) => {
  try { 
    // Obtener el parámetro de consulta 'eliminado'
    const { eliminado } = req.query;

    let query = {};
    if (eliminado !== undefined) {
      query.eliminado = eliminado === 'true';
    }

    const usuarios = await Usuario.find(query);
    res.status(200).json(usuarios);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener los usuarios', details: error.message });
  }
};

// traer un usuario por ID
export const getUserById = async (req, res) => {
  try {
    const { id } = req.params;
    const usuario = await Usuario.findById(id);
    if (!usuario || usuario.eliminado) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }
    res.status(200).json(usuario);
  } catch (error) {
    res.status(400).json({ error: 'Error al obtener el usuario', details: error.message });
  }
};


// actualizar un usuario
export const updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;
    const usuarioActualizado = await Usuario.findByIdAndUpdate(id, updates, { new: true, runValidators: true });
    if (!usuarioActualizado) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }
    res.status(200).json(usuarioActualizado);
  } catch (error) {
    res.status(400).json({ error: 'Error al actualizar el usuario', details: error.message });
  }
};

// eliminar un usuario (soft delete)
export const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;
    const usuarioEliminado = await Usuario.findByIdAndUpdate(id, { eliminado: true }, { new: true });
    if (!usuarioEliminado) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }
    res.status(200).json({ message: 'Usuario eliminado correctamente' });
  } catch (error) {
    res.status(400).json({ error: 'Error al eliminar el usuario', details: error.message });
  }
};

// obtener usuarios por rol
export const getUsuariosByRol = async (req, res) => {
    try {
        const { rol } = req.query; // Obtener el rol desde los parámetros de la URL
        if (!rol) {
            return res.status(400).json({ error: 'El parámetro "rol" es requerido' });
        }

        const usuarios = await Usuario.find({ rol: rol });
        res.status(200).json(usuarios);
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener los usuarios', details: error.message });
    }
};




