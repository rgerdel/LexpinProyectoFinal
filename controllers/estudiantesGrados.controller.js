import { estudiantesGrados  } from '../models/estudiantesGrados.model.js';
import { Asignatura } from '../models/asignatura.model.js';
import { Usuario } from '../models/usuario.model.js';


// obtener el Grado inscrito a cada estudiante
export const getAllEstudiantesGrados = async (req, res) => {
  try {
    const estudiantesGradosData = await estudiantesGrados.find();
    res.status(200).json(estudiantesGradosData);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener los grados', details: error.message });
  }
};

// crear una nueva inscripción de grado para un estudiante
export const createEstudianteGrado = async (req, res) => {
  try {
    const { id_estudiante, id_grado } = req.body; 
    const nuevoEstudianteGrado = new estudiantesGrados({ id_estudiante, id_grado });
    await nuevoEstudianteGrado.save();
    res.status(201).json(nuevoEstudianteGrado);
  } catch (error) {
    res.status(500).json({ error: 'Error al crear la inscripción de grado', details: error.message });
  }
};

// mostrar todos los grados con detalles del estudiante
export const getEstudiantesConGrados = async (req, res) => {
  try {
    console.log('Obteniendo estudiantes con grados');
    const estudiantesConGrados = await estudiantesGrados.find().populate('id_estudiante').populate('id_grado');
    res.json(estudiantesConGrados);
  } catch (error) {
    console.error("Error al obtener los estudiantes con grados:", error);
    res.status(500).json({ error: 'Error al obtener los estudiantes con grados' });
  }
};

export const getAsignaturasByGrado = async (req, res) => {
    try {
        const { id_grado } = req.params;
        const asignaturas = await Asignatura.find({ grado: id_grado })
            .populate('id_profesor', 'nombre apellido')
            .populate('grado', 'nombre');

        if (asignaturas.length === 0) {
            return res.status(404).json({ error: 'No se encontraron asignaturas para el grado proporcionado' });
        }

        res.status(200).json(asignaturas);
    } catch (error) {
        console.error("Error al obtener las asignaturas del grado:", error);
        res.status(500).json({ error: 'Error al obtener las asignaturas', details: error.message });
    }
};

// Buscar coleccion estudiantesGrados por _id
export const getEstudianteGradoId = async (req, res) => {
  try {
    const { id } = req.params;
    console.log(`Buscando estudianteGrado con ID: ${id}`);
    const estudianteGrado = await estudiantesGrados.findById(id).populate('id_estudiante').populate('id_grado');
    if (!estudianteGrado) {
      return res.status(404).json({ error: 'EstudianteGrado no encontrado' });
    }
    res.json(estudianteGrado);
  } catch (error) {
    console.error("Error al obtener los datos del estudiante y grado:", error);
    res.status(500).json({ error: 'Error al obtener los datos del estudiante y grado' });
  }
};

// Actualizar desde la coleccion estudiantesgrados
export const updateEstudianteGrado = async (req, res) => {
  try {
    const { id } = req.params;
    const { id_estudiante, id_grado } = req.body;

    // Validar que se proporcionen los campos necesarios
    if (!id_estudiante && !id_grado) {
      return res.status(400).json({ error: 'Debe proporcionar al menos un campo para actualizar' });
    }

    const updatedFields = {};
    if (id_estudiante) updatedFields.id_estudiante = id_estudiante;
    if (id_grado) updatedFields.id_grado = id_grado;

    const estudianteGrado = await estudiantesGrados.findByIdAndUpdate(id, updatedFields, { new: true });
    if (!estudianteGrado) {
      return res.status(404).json({ error: 'EstudianteGrado no encontrado' });
    }

    res.json(estudianteGrado);
  } catch (error) {
    console.error("Error al actualizar los datos del estudiante y grado:", error);
    res.status(500).json({ error: 'Error al actualizar los datos del estudiante y grado' });
  }
};