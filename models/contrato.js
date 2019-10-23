var mongoose = require('mongoose');
var uniqueValidator = require('mongoose-unique-validator');

var Schema = mongoose.Schema;

var contratoSchema = new Schema({

    nombre: { type: String, required: [true, 'El nombre del contrato es requerido'] },
    numero: { type: String, unique: true, required: [true, 'El numero del contrato es requerido '] },
    centro: { type: String, required: [true, 'El centro es requerido'] },
    estado: { type: String, default: '5d8bdcaf487fe800176ee0f1' },
    ano: { type: String, required: [true, 'El año del contrato es requerido'] },
    tipo: { type: String, default: '5d8be0f8df997a001722135d' }

});

contratoSchema.plugin(uniqueValidator, { message: '{PATH} El numero del contrato debe ser unico' });

module.exports = mongoose.model('Contrato', contratoSchema);