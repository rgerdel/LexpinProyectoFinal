import { Router } from 'express';
import { createTarea, getAllTareas, getAsignaturasProfesor, updateTarea, countTareas, detailTareas, detailTareaEstudiante } from '../controllers/tarea.controller.js';

const router = Router();

// Ruta para traer todos las Tareas
router.get('/tareas', getAllTareas);

// Ruta para crear un nuevo Tareas
router.post('/tareas', createTarea); 

// Ruta para actualizar una Tareas
router.patch('/tarea/:id', updateTarea);

router.get('/tareas/profesor/:id_profesor', getAsignaturasProfesor);

//Ruta para traer la cantidad de asignaturas por Profesor
router.get ('/tareas/count/:id', countTareas)

//Ruta para traer el detalle de la Tareas asignadas a la asignatura
router.get ('/tareas/detalles/:id', detailTareas)

router.get ('/tareas/estudiante/:id', detailTareaEstudiante)

export default router;