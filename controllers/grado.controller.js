import { Grado } from '../models/grado.model.js';

// crear un nuevo grado
export const createGrado = async (req, res) => {
  try {
    const { nombre, descripcion } = req.body;

// Validación básica de campos obligatorios
    if (!nombre || !descripcion) {
      return res.status(400).json({ error: 'Faltan campos obligatorios' });
    }

    const nuevoGrado = new Grado({ nombre, descripcion });
    await nuevoGrado.save();
    res.status(201).json(nuevoGrado);
  } catch (error) {
    res.status(400).json({ error: 'Error al crear el grado', details: error.message });
  }
};

// obtener todos los grados
export const getAllGrados = async (req, res) => {
  try {
    const grados = await Grado.find();
    res.status(200).json(grados);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener los grados', details: error.message });
  }
};

// editar un grado
export const updateGrado = async (req, res) => {
  try { 
    const { id } = req.params;
    const updates = req.body;
    const gradoActualizado = await Grado.findByIdAndUpdate(id, updates, { new: true, runValidators: true });
    if (!gradoActualizado) {
      return res.status(404).json({ error: 'Grado no encontrado' });
    }
    res.status(200).json(gradoActualizado);
  } catch (error) {
    res.status(400).json({ error: 'Error al actualizar el grado', details: error.message });
  }
};

// obtener un grado por nombre o id
export const getGradoByQuery = async (req, res) => {
  try {
    const { nombre, id } = req.query;
    const query = {};
    if (nombre) {
      query.nombre = new RegExp(nombre, 'i');
    }
    if (id) {
      query._id = id;
    }
    const grado = await Grado.findOne(query);
    if (!grado) {
      return res.status(404).json({ error: 'Grado no encontrado' });
    }
    res.status(200).json(grado);
  } catch (error) {
    res.status(400).json({ error: 'Error al obtener el grado', details: error.message });
  }
};

