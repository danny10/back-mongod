var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var uniqueValidator = require('mongoose-unique-validator');

var rolesSchema = new Schema({

    nombre: { type: String, unique: true, required: [true, 'El nombre es obligatorio'] },
    estado: { type: String, default: '5d8cc47a49ce820017bc1c1c' }

});

rolesSchema.plugin(uniqueValidator, { message: '{PATH} El nombre debe ser unico' });

module.exports = mongoose.model('Roles', rolesSchema);