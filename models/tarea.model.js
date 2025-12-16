import mongoose from 'mongoose';
import mongoosePaginate from 'mongoose-paginate-v2';

/*
 * Definición del esquema y modelo de Tarea
 * - titulo: String, requerido, min 3, max 100.
 * - descripcion: String, requerido, min 10, max 100.
 * - id_profesor: number, requerido, único, positivo.
 * - id_asignatura number, requerido, único, positivo.
 * - archivo_adjunto: String, requerido, URL válida.
 * - fecha_entrega: Date, requerido, no puede ser una fecha pasada.
 * - timestamps: createdAt, updatedAt
 */

const tareaSchema = new mongoose.Schema({
  titulo: {
    type: String,
    required: true,
    minlength: 3,
    maxlength: 100,
    trim: true,
    lowercase: true,
  },
  descripcion: {
    type: String,
    required: true,
    minlength: 3,
    maxlength: 500,
    trim: true,
    lowercase: true,
  },
  id_profesor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Usuario',
    required: true,
  },
  id_asignatura: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Asignatura',
    required: true,
  },
  archivo_adjunto: {
    type: String,
    required: false,
    validate: {
      validator: function (v) {
        return /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/.test(v);
      },
      message: props => `${props.value} no es una URL válida!`
    }
  },
  fecha_entrega: {
    type: Date,
    required: false,
    validate: {
      validator: function (v) {
        return v >= new Date();
      },
      message: props => `La fecha de entrega ${props.value} no puede ser una fecha pasada!`
    }
  }
}, { timestamps: true });

tareaSchema.plugin(mongoosePaginate);

export const Tarea = mongoose.model('Tarea', tareaSchema);