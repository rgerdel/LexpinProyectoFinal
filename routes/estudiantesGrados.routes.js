import { Router } from "express";
import {
  getAllEstudiantesGrados,
  createEstudianteGrado,
  getEstudiantesConGrados,
  getAsignaturasByGrado,
  getEstudianteGradoId,
  updateEstudianteGrado,
} from "../controllers/estudiantesGrados.controller.js";

const router = Router();

// Ruta para traer todos los Grados
router.get("/estudiantesGrados", getAllEstudiantesGrados);

// Ruta para crear una nueva inscripción de grado para un estudiante
router.post("/estudiantesGrados", createEstudianteGrado);

// Ruta para traer todas las Grado con detalles del estudiante
router.get("/estudiantesgrados/detalles", getEstudiantesConGrados);

// Ruta para traer las asignaturas de un estudiante por su ID
router.get("/estudiantesgrados/grado/:id_grado", getAsignaturasByGrado);

// Ruta para traer de la coleccion estudiantesGrados por ID
router.get("/estudiantesGrados/:id", getEstudianteGradoId);

// Ruta para actualizar un registro en estudiantesGrados por ID
router.patch("/estudiantesGrados/:id", updateEstudianteGrado);

export default router;
