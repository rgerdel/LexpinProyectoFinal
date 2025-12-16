import mongoose from 'mongoose';
import mongoosePaginate from 'mongoose-paginate-v2';

/*
    * Definición del esquema y modelo de Calificación
    * - id_entrega : number, requerido, unico, positivo.    
    * - calificacion: number, requerido, min 0, max 20.
    * - comentarios: String, opcional, max 500.
    * - id_profesor: number, requerido, positivo.
    * - timestamps: createdAt, updatedAt
*/
const calificacionSchema = new mongoose.Schema ({
    id_entrega: {
        type: String,
        required: true
    },
    calificacion: {
        type: Number,
        requiered: true,
        min: 0,
        max: 20
    },
    comentarios: {
        type: String,
        required: false
    },
    id_profesor:{
        type: String,
        required: true
    },
}, { timestamps: true});

calificacionSchema.plugin(mongoosePaginate);

export const Calificacion = mongoose.model('Calificacion', calificacionSchema);