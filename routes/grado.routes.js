import { Router } from 'express';
import { createGrado, getGradoByQuery, getAllGrados, updateGrado } from '../controllers/grado.controller.js';

const router = Router();

// Ruta para traer todos los Grados
router.get('/grados', getAllGrados);

// Ruta para crear un nuevo Grado
router.post('/grado', createGrado); 

// Ruta para actualizar un Grado
router.patch('/grado/:id', updateGrado);

// Ruta para traer un grado por nombre o id
router.get('/grado', getGradoByQuery);

export default router;