import mongoose from "mongoose";
import mongoosePaginate from 'mongoose-paginate-v2';

/*
 * Definición del esquema y modelo de Entrega de Tareas
 * - id_tarea: number, requerido, unico, positivo.
 * - id_estudiante: number, requerido, unico, positivo.
 * - fecha_entrega: Date, requerido, no puede ser futura.
 * - calificacion: number, requerido, min 0, max 20.
 * - archivo_entregado: String, requerido, formato URL.
 * - estado: enum ['pendiente', 'entregado', 'no entregado'], por defecto 'pendiente'.
 * - timestamps: createdAt, updatedAt
*/

const entregaSchema = new mongoose.Schema ({
    id_tarea :{
        type: String,
        required: true,
    },
    id_estudiante: {
        type: String,
        required: true,
    },
    fecha_entrega: {
        type: Date,
        required: true,
    },
    calificacion: {
        type: Number,
        required: true,
        min: 0,
        max: 20,
    },
    archivo_entregado:{
         type: String,
        required: true,
        validate: {
            validator: function (v) {   
            return /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/.test(v);
            },
            message: props => `${props.value} no es una URL valida!`
        }
    },
    estado: {
        type: String,
        required: true,
        enum: ['pendiente', 'entregado', 'no entregado'],
            default: 'pendiente',
    },
},
    { timestamps: true })

    entregaSchema.plugin(mongoosePaginate);
    
    export const Entrega = mongoose.model('Entrega', entregaSchema);
    
           