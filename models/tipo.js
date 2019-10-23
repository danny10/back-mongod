var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var tipoSchema = new Schema({
    nombre: { type: String, required: [true, 'El nombre del tipo es requerido'] },
    app: { type: String, required: [true, 'La app es requerida'] },
    estado: { type: String, required: [true, 'El estado es requerido'] }

});

module.exports = mongoose.model('Tipo', tipoSchema);