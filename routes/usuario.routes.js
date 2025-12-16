import { Router } from 'express';
import { getAllUsers, getUserById, createUser, updateUser, deleteUser, getUsuariosByRol } from '../controllers/usuario.controller.js';

const router = Router();

// Ruta para traer todos los usuarios
router.get('/usuarios', getAllUsers);

// Ruta traer un usuario por ID
router.get('/usuario/:id', getUserById);

// Ruta para crear un nuevo usuario
router.post('/usuario', createUser);

// Ruta para actualizar un usuario
router.patch('/usuario/:id', updateUser);

//Ruta para eliminar un usuario (soft delete)
router.delete('/usuario/:id', deleteUser)


// Ruta para traer usuarios por rol
router.get('/usuarios/rol/:rol', getUsuariosByRol);




export default router;