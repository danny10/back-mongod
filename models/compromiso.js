var mongoose = require('mongoose');
var Schema = mongoose.Schema;

compromisoSchema = new Schema({
    descripcion: { type: String, required: [true, 'La descripcion es necesaria'] },
    observacion: { type: String },
    solicitante: { type: String, required: [true, 'El solicitante es necesario'] },
    responsable_seguimiento: { type: String, required: [true, 'El responsable de seguimiento es necesario'] },
    responsable_hacer: { type: String, unique: true, required: [true, 'El responsable de hacer es necesario'] },
    motivo_incumplimiento: { type: String },
    motivo_descarte: { type: String },
    motivo_cumplimiento: { type: String },
    radicado_cumplimiento: { type: String },
    estado_seguimiento: { type: String, default: '5d8e877849658e00175ab859' },
    estado_hacer: { type: String, default: '5d8e877849658e00175ab859' },

});

module.exports = mongoose.model('Compromiso', compromisoSchema);