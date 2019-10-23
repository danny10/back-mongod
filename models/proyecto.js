var mongoose = require('mongoose');
var Schema = mongoose.Schema;

proyectoSchema = new Schema({
    id_municipio: { type: String, required: [true, 'El municipio es necesario'] },
    nombre: { type: String, required: [true, 'El nombre es necesario'] },
    contratista: { type: String, required: [true, 'El contratista es necesario'] },
    contrato: { type: String, required: [true, 'El contrato es necesario'] },
    contrato_obra: { type: String, unique: true, required: [true, 'El responsable de hacer es necesario'] },
    no_cuenta: { type: String },
    entidad_bancaria: { type: String },
    tipo: { type: String, required: [true, 'El tipo es necesario'] },
    estado: { type: String, default: '5d8e877849658e00175ab859' },

});

module.exports = mongoose.model('Proyecto', proyectoSchema);