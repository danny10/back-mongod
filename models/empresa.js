var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var uniqueValidator = require('mongoose-unique-validator');

var empresaSchema = new Schema({
    nombre: { type: String, required: [true, 'El nombre es necesario'] },
    nit: { type: String, unique: true, required: [true, 'El nit es necesario'] },
    proveedor: { type: Number, default: 1 },
    estado: { type: String, default: '5d8e797a5b9cb00017c0bd30' }
});

empresaSchema.plugin(uniqueValidator, { message: '{PATH} El nit debe ser unico' });

module.exports = mongoose.model('Empresa', empresaSchema);