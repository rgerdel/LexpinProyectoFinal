import { Tarea } from "../models/tarea.model.js";
import { Asignatura } from "../models/asignatura.model.js";
import { estudiantesGrados } from '../models/estudiantesGrados.model.js';

export const createTarea = async (req, res) => {
  try {
    const { titulo, descripcion, id_asignatura,  id_profesor, fecha_entrega } = req.body;

    console.log("Datos recibidos:", req.body);

    if (!titulo || !descripcion || !id_asignatura || !id_profesor) {
      return res.status(400).json({ error: "Faltan campos obligatorios" });
    }

    const nuevaTarea = new Tarea({
      titulo,
      descripcion,
      id_asignatura,
      id_profesor,
      fecha_entrega: new Date(fecha_entrega), // Asegurar que se guarde en UTC
    });

    await nuevaTarea.save();

    res.status(201).json(nuevaTarea);
  } catch (error) {
    console.error("Error al crear la tarea:", error);
    res.status(400).json({ error: "Error al crear la tarea", details: error.message });
  }
};

export const getAllTareas = async (req, res) => {
  try {
    const tareas = await Tarea.find().populate('id_asignatura', 'nombre');
    res.status(200).json(tareas);
  } catch (error) {
    res.status(500).json({ error: "Error al obtener las tareas", details: error.message });
  }
};

export const updateTarea = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;
    const tareaActualizada = await Tarea.findByIdAndUpdate(id, updates, {
      new: true,
      runValidators: true,
    });
    if (!tareaActualizada) {
      return res.status(404).json({ error: "Tarea no encontrada" });
    }
    res.status(200).json(tareaActualizada);
  } catch (error) {
    res.status(400).json({ error: "Error al actualizar la tarea", details: error.message });
  }
};

export const getAsignaturasProfesor = async (req, res) => {
  try {
    const idProfesor = req.params.id_profesor;
    const asignaturas = await Asignatura.find({ id_profesor: idProfesor, eliminado: false });
    res.json(asignaturas);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

//Cuenta la cantidad de Tarea por profesor
export const countTareas = async (req, res) => {
  try {
    const { id } = req.params;
    const count = await Tarea.countDocuments({ id_profesor: id });
    if (count === 0) {
      return res.status(404).json({ error: 'No se encontraron tareas para el profesor especificado' });
    }
    res.json({ count });
  } catch (error) {
    console.error("Error al obtener la cantidad de tareas:", error);
    res.status(500).json({ error: 'Error al obtener la cantidad de tareas' });
  }
};

// Trae el detalle de las tareas creadas asignadas a la asignatura
export const detailTareas = async (req, res) => {
  try {
    const { id } = req.params;

    // Obtener todas las tareas del profesor
    const tareas = await Tarea.find({ id_profesor: id })
      .populate('id_asignatura', 'nombre')
      .exec();

    // Obtener los detalles de los estudiantes relacionados con las asignaturas de las tareas
    const estudiantesGrados = await EstudianteGrado.find({ id_asignatura: { $in: tareas.map(tarea => tarea.id_asignatura._id) } })
      .populate('id_asignatura', 'nombre')
      .exec();

    // Formatear los datos para devolver solo los campos necesarios
    const formattedTareas = tareas.map(tarea => ({
      asignatura: tarea.id_asignatura.nombre,
      tituloTarea: tarea.titulo,
      descripcionTarea: tarea.descripcion,
      estudiantesGrados: estudiantesGrados.filter(eg => eg.id_asignatura._id.toString() === tarea.id_asignatura._id.toString()).map(eg => ({
        id_estudiante: eg.id_estudiante,
        id_grado: eg.id_grado,
      })),
    }));

    res.json(formattedTareas);
  } catch (error) {
    console.error("Error al obtener las tareas:", error);
    res.status(500).json({ error: 'Error al obtener las tareas' });
  }
};


/*/*/


// Endpoint para obtener las tareas y sus detalles de asignatura y estudiantes por estudiante
export const detailTareaEstudiante = async (req, res) => {
  try {
    const { id } = req.params;

    // Obtener los grados cursados por el estudiante
    const estudiantesGradosData = await estudiantesGrados.find({ id_estudiante: mongoose.Types.ObjectId(id) });

    if (estudiantesGradosData.length === 0) {
      return res.status(404).json({ error: 'No se encontraron grados para el estudiante especificado' });
    }

    // Obtener las asignaturas que pertenecen a esos grados
    const asignaturas = await Asignatura.find({ grado: { $in: estudiantesGradosData.map(eg => eg.id_grado) } });

    if (asignaturas.length === 0) {
      return res.status(404).json({ error: 'No se encontraron asignaturas para el estudiante especificado' });
    }

    // Obtener las tareas que pertenecen a esas asignaturas
    const tareas = await Tarea.find({ id_asignatura: { $in: asignaturas.map(a => a._id) } }, 'titulo descripcion fecha_entrega')
      .exec();

    if (tareas.length === 0) {
      return res.status(404).json({ error: 'No se encontraron tareas para el estudiante especificado' });
    }

    // Formatear los datos para devolver solo los campos necesarios
    const formattedTareas = tareas.map(tarea => ({
      titulo: tarea.titulo,
      descripcion: tarea.descripcion,
      fecha_entrega: tarea.fecha_entrega,
    }));

    res.json(formattedTareas);
  } catch (error) {
    console.error("Error al obtener las tareas:", error);
    res.status(500).json({ error: 'Error al obtener las tareas' });
  }
};