import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
import mongoosePaginate from 'mongoose-paginate-v2';


/*
 * Definición del esquema y modelo de Usuario
 * - nombre: String, requerido, min 3, max 50, solo letras
 * - apellido: String, requerido, min 3, max 50, solo letras
 * - email: String, requerido, único, formato email
 * - password: String, requerido, min 8, max 100, al menos una mayúscula, una minúscula, un número y un carácter especial
 * - eliminado: Boolean, por defecto false (soft delete)
 * - rol: String, enum ['admin', 'estudiante', 'profesor'], por defecto 'admin'
 * - timestamps: createdAt, updatedAt
 */

const usuarioSchema = new mongoose.Schema({
  nombre: {
    type: String,
    required: true,
    minlength: 3,
    maxlength: 50,
    trim: true,
    lowercase: true,
    validate: {
      validator: function (v) {
        return /^[A-Za-záéíóúÁÉÍÓÚñÑ ]+$/.test(v); // Solo letras
      },
      message: props => `${props.value} no es un nombre válido!`
    },
  },
  apellido: {
    type: String,
    required: true,
    minlength: 3,
    maxlength: 50,
    trim: true,
    lowercase: true,
    validate: {
      validator: function (v) {
        return /^[A-Za-záéíóúÁÉÍÓÚñÑ ]+$/.test(v); // Solo letras
      },
      message: props => `${props.value} no es un apellido válido!`
    },
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true,
    validate: {
      validator: function (v) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v); // Formato de email
      },
      message: props => `${props.value} no es un email válido!`
    },
  },
  password: {
  type: String,
  required: true,
  minlength: 8,
  maxlength: 100,
  validate: {
    validator: function (v) {
      return /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z\d\s])[A-Za-z\d\s\W_]{8,}$/.test(v);
    },
    message: props => `La contraseña no cumple con los requisitos mínimos!`
  }
},
  eliminado: { type: Boolean, default: false },
  rol: { type: String, enum: ['admin', 'estudiante', 'profesor'], default: 'admin', lowercase: true },
}, { timestamps: true });


// Encriptar la contraseña antes de guardar
/*usuarioSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});*/

usuarioSchema.plugin(mongoosePaginate);

// Exportar el modelo de Usuario

export const Usuario = mongoose.model('Usuario', usuarioSchema);