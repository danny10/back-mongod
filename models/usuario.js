var mongoose = require('mongoose');
var uniqueValidator = require('mongoose-unique-validator');

var Schema = mongoose.Schema;

var usuarioSchema = new Schema({

    nombre: { type: String, required: [true, 'El nombre es necesario'] },
    apellido: { type: String, required: [true, 'El apellido es necesario'] },
    direccion: { type: String, required: [true, 'La direccion es necesaria'] },
    telefono: { type: String, required: [true, 'El telefono es necesario'] },
    email: { type: String, unique: true, required: [true, 'El email es necesario'] },
    sexo: { type: String, required: [true, 'El nombre es necesario'] },
    password: { type: String, required: [true, 'La clave es necesaria'] },
    img: { type: String, required: false },
    rol: { type: String, required: true, default: '1' },
    cedula: { type: String, unique: true, required: true },
    estado: { type: String, default: '5d8e877849658e00175ab859' },
});

usuarioSchema.plugin(uniqueValidator, { message: '{PATH} El email debe ser unico' });

module.exports = mongoose.model('Usuario', usuarioSchema);