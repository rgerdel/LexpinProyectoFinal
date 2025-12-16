import { Router } from 'express';
import { createEntrega, getAllEntregas } from '../controllers/entrega.controller.js';

const router = Router();

// Ruta para traer todos las Tareas
router.get('/entregas', getAllEntregas);

// Ruta para crear un nuevo Tareas
router.post('/entrega', createEntrega); 

export default router;