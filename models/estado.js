var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var estadoSchema = new Schema({

    nombre: { type: String, required: [true, 'El nombre del estado es necesario'] },
    app: { type: String, required: [true, 'La app es necesarea'] },
    estado: { type: String, required: [true, 'El estado es necesario'] }

});

module.exports = mongoose.model('Estado', estadoSchema);