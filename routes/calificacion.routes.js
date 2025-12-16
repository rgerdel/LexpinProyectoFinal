import { Router } from 'express';
import { createCalificacion, getAllCalificaciones, updateCalificacion, getCalificacionesByEstudiante } from '../controllers/calificacion.controller.js';

const router = Router();

// Ruta para traer todos las Calificaciones
router.get('/calificaciones', getAllCalificaciones);

// Ruta para crear un nueva Calificacion
router.post('/calificacion', createCalificacion); 

//Ruta oara actualizar una Calificacion
router.patch('/calificacion/:id', updateCalificacion);

// Ruta para filtrar calificaciones por id_estudiante
router.get('/calificaciones/estudiante/:id_estudiante', getCalificacionesByEstudiante);

export default router;