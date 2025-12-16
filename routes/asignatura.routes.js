import { Router } from 'express';
import { createAsignatura, getAllAsignaturas, updateAsignatura, getAsignaturaByQuery, deleteAsignatura, 
    getAsignaturasByGrado, getAsignaturaById, getAsignaturasConDetalles, 
    countAsignaturas} from '../controllers/asignatura.controller.js';

const router = Router();    

// Ruta para traer todas las Asignaturas
router.get('/asignaturas', getAllAsignaturas);

// Ruta para traer una Asignatura por Id
router.get('/asignatura/:id', getAsignaturaById);

// Ruta para crear una nueva Asignatura
router.post('/asignatura', createAsignatura);

// Ruta para actualizar una Asignatura
router.patch('/asignatura/:id', updateAsignatura);

// Ruta para traer una Asignatura por periodo, nombre o codigo
router.get('/asignatura/:id', getAsignaturaByQuery);

// ruta para eliminar una Asignatura (soft delete)
router.delete('/asignatura/:id', deleteAsignatura);

// Ruta para traer todas las Asignaturas por id_grado
router.get('/asignaturas/grado/:id_grado', getAsignaturasByGrado);

// Ruta para traer todas las Asignaturas con detalles de profesor y grado
router.get('/asignaturas/detalles', getAsignaturasConDetalles);

//Ruta para traer la cantidad de asignaturas por Profesor
router.get ('/asignaturas/count/:id', countAsignaturas)



export default router;

