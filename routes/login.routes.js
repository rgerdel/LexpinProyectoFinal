// routes/login.routes.js
import express from 'express';
import { Usuario } from '../models/usuario.model.js';

const router = express.Router();

router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    const usuario = await Usuario.findOne({ email });
    if (!usuario) {
      return res.status(400).json({ message: 'Usuario no encontrado' });
    }

    // Comparar la contraseña sin encriptación
    if (usuario.password !== password) {
      return res.status(400).json({ message: 'Contraseña incorrecta' });
    }

    // Devolver el rol y el _id del usuario
    res.json({ rol: usuario.rol, _id: usuario._id });
  } catch (error) {
    res.status(500).json({ message: 'Error interno del servidor' });
  }
});

export default router;