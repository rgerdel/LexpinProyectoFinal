// models/estudiantesGrados.model.js
import mongoose from 'mongoose';
import mongoosePaginate from 'mongoose-paginate-v2';

const estudiantesGradosSchema = new mongoose.Schema({
    id_estudiante: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Usuario', // Referencia al modelo Usuario
        required: true,
    },
    id_grado: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Grado', // Referencia al modelo Grado
        required: true,
    },
}, { timestamps: true });

estudiantesGradosSchema.plugin(mongoosePaginate);

export const estudiantesGrados = mongoose.model('estudiantesGrados', estudiantesGradosSchema);