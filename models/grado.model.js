import mongoose from "mongoose";
import mongoosePaginate from 'mongoose-paginate-v2';

/*
 * Definición del esquema y modelo de Grado
 * - nombre: String, requerido, min 3, max 100.
 * - descripcion: String, requerido, min 10, max 100.
 * - timestamps: createdAt, updatedAt
*/

const gradoSchema = new mongoose.Schema({
    nombre: {
        type: String,
        required: true,
        minlength: 3,
        maxlength: 100,
        trim: true,
        lowercase: true,
        validate: {
            validator: function (v) {
                return /^[A-Za-z0-9\s.,;:?!-_]+$/g.test(v);
            },
            message: props => `${props.value} no es un nombre de grado válido!`
        },
    },
    descripcion: {
        type: String,
        required: true,
        minlength: 10,
        maxlength: 100,
        trim: true,
        lowercase: true,
        validate: {
            validator: function (v) {
                return /^[A-Za-z0-9\s.,;:?!-_]+$/g.test(v);
            },
            message: props => `${props.value} no es una descripción de grado válida!`
        }
    }
}, { timestamps: true });

gradoSchema.plugin(mongoosePaginate);

export const Grado = mongoose.model('Grado', gradoSchema);;