import { Calificacion } from '../models/calificacion.model.js';


// crear una nueva calificación

export const createCalificacion = async (req, res) => {
  try {
    const { id_entrega, calificacion, comentarios, id_profesor } = req.body;

    // Validación básica de campos obligatorios
    if (!id_entrega || !id_profesor || !calificacion || !comentarios || !fecha_calificacion) {
      return res.status(400).json({ error: 'Faltan campos obligatorios' });
    }    
    const nuevaCalificacion = new Calificacion({ id_entrega, id_profesor, calificacion, comentarios, fecha_calificacion });
    await nuevaCalificacion.save();
    res.status(201).json(nuevaCalificacion);
  } catch (error) {
    res.status(400).json({ error: 'Error al crear la calificación', details: error.message });
  }
};

// obtener todas las calificaciones
export const getAllCalificaciones = async (req, res) => {
  try {
    const calificaciones = await Calificacion.find();
    res.status(200).json(calificaciones);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener las calificaciones', details: error.message });
  }
};

// editar una calificación
export const updateCalificacion = async (req, res) => {
  try { 
    const { id } = req.params;
    const updates = req.body;
    const calificacionActualizada = await Calificacion.findByIdAndUpdate(id, updates, { new: true, runValidators: true });
    if (!calificacionActualizada) {
      return res.status(404).json({ error: 'Calificación no encontrada' });
    }
    res.status(200).json(calificacionActualizada);
  } catch (error) {
    res.status(400).json({ error: 'Error al actualizar la calificación', details: error.message });
  }
};

// filtrar calificaciones por id_estudiante
export const getCalificacionesByEstudiante = async (req, res) => {
  try {
    const { id_estudiante } = req.params;
    const calificaciones = await Calificacion.find().populate({ path: 'id_estudiante', match: { id: id_estudiante } });
    res.status(200).json(calificaciones);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener las calificaciones', details: error.message });
  }
};