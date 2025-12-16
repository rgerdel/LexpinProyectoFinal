import express, { json } from 'express';
import connection from './config/dbConnection.js';
import usuarioRoutes from './routes/usuario.routes.js';
import tareaRoutes from './routes/tarea.routes.js';
import entregaRoutes from './routes/entrega.routes.js';
import calificacionRoutes from './routes/calificacion.routes.js';
import asignaturaRoutes from './routes/asignatura.routes.js';
import gradoRoutes from './routes/grado.routes.js';
import loginRoutes from './routes/login.routes.js';
import estudiantesGradosRoutes from './routes/estudiantesGrados.routes.js';
import cors from 'cors';

// Establecer la zona horaria en UTC
process.env.TZ = 'UTC';

const app = express();
const port = 3000;

app.use(json());
connection; // Ejecutar la conexión a la base de datos

// Configurar CORS
const whitelist = ['http://localhost:3000', 'http://localhost:5173'];
const corsOptions = {
  origin: function (origin, callback) {
    if (whitelist.indexOf(origin) !== -1 || !origin) {
      callback(null, true);
    } else {
      callback(new Error('No permitido por CORS'));
    }
  }
};
app.use(cors(corsOptions));

// Ruta principal
app.get('/', (req, res) => {
  res.send('Bienvenido a la API con Express');
});

// Registrar la ruta de inicio de sesión
app.use('/api', loginRoutes);

// Registrar las rutas de la API
app.use('/api', usuarioRoutes);
app.use('/api', tareaRoutes);
app.use('/api', entregaRoutes);
app.use('/api', calificacionRoutes);
app.use('/api', asignaturaRoutes);
app.use('/api', gradoRoutes);
app.use('/api', estudiantesGradosRoutes);




// Iniciar el servidor
app.listen(port, () => {
  console.log(`Servidor corriendo en http://localhost:${port}`);
});