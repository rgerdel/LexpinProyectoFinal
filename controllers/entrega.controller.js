import { Entrega } from '../models/entrega.model.js';

// crear una nueva entrega
export const createEntrega = async (req, res) => {
  try {
    const { id_tarea, id_estudiante, fecha_entrega, archivo_url, estado } = req.body;

    // Validación básica de campos obligatorios
    if (!id_tarea || !id_estudiante || !fecha_entrega || !archivo_url || !estado) {
      return res.status(400).json({ error: 'Faltan campos obligatorios' });
    }
    const nuevaEntrega = new Entrega({ id_tarea, id_estudiante, fecha_entrega, archivo_url, estado });
    await nuevaEntrega.save();
    res.status(201).json(nuevaEntrega);
  } catch (error) {
    res.status(400).json({ error: 'Error al crear la entrega', details: error.message });
  } 
};

// obtener todas las entregas
export const getAllEntregas = async (req, res) => {
  try {
    const entregas = await Entrega.find();
    res.status(200).json(entregas);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener las entregas', details: error.message });
  }
};

