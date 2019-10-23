var mongoose = require('mongoose');
var Schema = mongoose.Schema;

municipioSchema = new Schema({
    id_dep: { type: String, required: [true, 'El departamento es necesario'] },
    nombre: { type: String, required: [true, 'El nombre es necesario'] }
});

module.exports = mongoose.model('Municipio', municipioSchema);