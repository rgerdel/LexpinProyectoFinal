import mongoose from 'mongoose';
import mongoosePaginate from 'mongoose-paginate-v2';

/*
 * Definición del esquema y modelo de Asignaturas
 * - nombre: String, requerido, min 3, max 50.
 * - descripcion: String, requerido, min 10, max 100.
 * - id_profesor: ObjectId, requerido, referencia a Usuario.
 * - grado: ObjectId, requerido, referencia a Grado.
 * - periodo_escolar: String, enum ['2025-2026'], por defecto '2025-2026'.
 * - eliminado: Boolean, por defecto false (soft delete).
 * - activo: Boolean, por defecto true.
 * - timestamps: createdAt, updatedAt.
 */

const asignaturaSchema = new mongoose.Schema({
  //id: mongoose.Schema.Types.ObjectId,
  nombre: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 50,
    trim: true,
    lowercase: true,
  },
  descripcion: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 100,
    trim: true,
    lowercase: true,
  },
  id_profesor: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Usuario',
    required: true 
  },
  grado: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Grado',
    required: true,
  },
  periodo_escolar: {
    type: String,
    enum: ['2025-2026'],
    default: '2025-2026',
  },
  eliminado: {
    type: Boolean,
    default: false,
  },
  activo: {
    type: Boolean,
    default: true,
  },
}, { timestamps: true });

asignaturaSchema.plugin(mongoosePaginate);

export const Asignatura = mongoose.model('Asignatura', asignaturaSchema, 'asignaturas');
       