import { Asignatura } from '../models/asignatura.model.js';

// crear una nueva asignatura
export const createAsignatura = async (req, res) => {
  try {
    const { nombre, descripcion, id_profesor, grado, periodo_escolar}  = req.body;

    // Validación básica de campos obligatorios
    if (!nombre || !descripcion || !id_profesor || !grado || !periodo_escolar) {
      return res.status(400).json({ error: 'Faltan campos obligatorios' });
    }

    const nuevaAsignatura = new Asignatura({ nombre, descripcion, id_profesor, grado, periodo_escolar });
    await nuevaAsignatura.save();
    res.status(201).json(nuevaAsignatura);
  } catch (error) {
    res.status(400).json({ error: 'Error al crear la asignatura', details: error.message });
  }
};

// obtener todas las asignaturas
export const getAllAsignaturas = async (req, res) => {
  try {
    const asignaturas = await Asignatura.find()
      .populate('id_profesor', 'nombre apellido') // Poblamos el campo id_profesor
      .populate('grado', 'nombre'); // Poblamos el campo grado
    res.status(200).json(asignaturas);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener las asignaturas', details: error.message });
  }
};

// editar una asignatura
export const updateAsignatura = async (req, res) => {
  try { 
    const { id } = req.params;
    const updates = req.body;
    const asignaturaActualizada = await Asignatura.findByIdAndUpdate(id, updates, { new: true, runValidators: true });
    if (!asignaturaActualizada) {
      return res.status(404).json({ error: 'Asignatura no encontrada' });
    }
    res.status(200).json(asignaturaActualizada);
  } catch (error) {
    res.status(400).json({ error: 'Error al actualizar la asignatura', details: error.message });
  }
};  

// obtener una asignatura por periodo, nombre o id
export const getAsignaturaByQuery = async (req, res) => {
  try {
    const { periodo_escolar, nombre, id } = req.query;
    const query = {};
    if (periodo_escolar) {
      query.periodo_escolar = periodo_escolar;
    }
    if (nombre) {
      query.nombre = new RegExp(nombre, 'i');
    }
    if (id) {
      query.codigo = new RegExp(id, 'i');
    }
    const asignatura = await Asignatura.find(query);
    if (!asignatura) {
      return res.status(404).json({ error: 'Asignatura no encontrada' });
    }
    res.status(200).json(asignatura);
  } catch (error) {
    res.status(400).json({ error: 'Error al obtener la asignatura', details: error.message });
  }
};  

// eliminar una asignatura
export const deleteAsignatura = async (req, res) => {
  try {
    const { id } = req.params;
    const asignaturaEliminada = await Asignatura.findByIdAndDelete(id);
    if (!asignaturaEliminada) {
      return res.status(404).json({ error: 'Asignatura no encontrada' });
    }
    res.status(200).json({ message: 'Asignatura eliminada correctamente' });
  } catch (error) {
    res.status(400).json({ error: 'Error al eliminar la asignatura', details: error.message });
  }
};

export const getAsignaturasByGrado = async (req, res) => {
  try {
    const { id_grado } = req.params;
    const asignaturas = await Asignatura.find({ grado: id_grado }); 
    res.status(200).json(asignaturas);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener las asignaturas por grado' });
  }
};

export const getAsignaturasConDetalles = async (req, res) => {
  try {
    // Obtener todas las asignaturas
    const asignaturas = await Asignatura.find().populate('id_profesor').populate('grado');

    // Formatear los datos para incluir los nombres y apellidos de los profesores y los nombres de los grados
    const asignaturasConDetalles = asignaturas.map(asignatura => ({
      id: asignatura._id,
      nombre: asignatura.nombre,
      descripcion: asignatura.descripcion,
      profesorNombre: asignatura.id_profesor.nombre,
      profesorApellido: asignatura.id_profesor.apellido,
      gradoNombre: asignatura.grado.nombre
    }));

    res.status(200).json(asignaturasConDetalles);
  } catch (error) {
    console.error("Error al obtener las asignaturas con detalles:", error);
    res.status(500).json({ error: 'Error al obtener las asignaturas con detalles' });
  }
};

export const getAsignaturaById = async (req, res) => {
  try {
    const { id } = req.params;  
    const asignatura = await Asignatura.findById(id);
    if (!asignatura) {
      return res.status(404).json({ error: 'Asignatura no encontrada' });
    }   
    res.status(200).json(asignatura);
  } catch (error) {
    res.status(400).json({ error: 'Error al obtener la asignatura', details: error.message });
  } 
};

//Cuenta la cantidad de asignaturas por profesor
 export const countAsignaturas = async (req, res) => {
  try {
    const { id } = req.params;
    const count = await Asignatura.countDocuments({ id_profesor: id });
    if (count === 0) {
      return res.status(404).json({ error: 'No se encontraron asignaturas para el profesor especificado' });
    }
    res.json({ count });
  } catch (error) {
    console.error("Error al obtener la cantidad de asignaturas:", error);
    res.status(500).json({ error: 'Error al obtener la cantidad de asignaturas' });
  }
};

